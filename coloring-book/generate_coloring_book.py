#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOE Rhythm Quest: Coloring Book — Print HTML Generator
======================================================
Generates the single print HTML (cover + parent intro + 38 coloring plates)
from coloring_book_content.json. Art is referenced from art_print/, which
make_coloring_book_pdf.py stages from the tracked masters in
web/public/assets/coloring-book/.

Origin: implements the Claude Design document
"Rhythm Quest Coloring Book.dc.html" (project 9a5fbc61-790e-4eae-a8d5-08fb78dd9350).
That file is a template — {{ ink }} placeholders, <sc-if> blocks and a DCLogic
class that only resolve inside the Design editor. Here that layer is resolved
away: the design's three props are data attributes on <html> and renderVals()
is a set of CSS custom properties, so the output prints with no runtime.

Usage:
    py generate_coloring_book.py            # build the print HTML
    py generate_coloring_book.py --check    # validate content JSON only

Requirements: Python 3.8+  (no external libraries needed)
"""

import argparse
import html
import json
import pathlib
import sys
from urllib.parse import quote

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ---------------------------------------------------------------------------
# PATHS
# ---------------------------------------------------------------------------
BASE_DIR     = pathlib.Path(__file__).parent.resolve()
CONTENT_FILE = BASE_DIR / "coloring_book_content.json"
CSS_FILE     = BASE_DIR / "styles" / "coloring-book.css"
ART_PRINT    = BASE_DIR / "art_print"
HTML_OUT     = BASE_DIR / "Rhythm_Quest_Coloring_Book_print.html"

# Masters live with the website so one redraw propagates everywhere.
ART_MASTERS  = BASE_DIR.parent / "web" / "public" / "assets" / "coloring-book"

# Type stack from design-system tokens/fonts.css.
FONT_HREF = (
    "https://fonts.googleapis.com/css2"
    "?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800"
    "&family=Fredoka:wght@400;500;600;700"
    "&family=Inter:wght@300;400;500;600;700"
    "&family=Dancing+Script:wght@400;600;700&display=swap"
)

FAVICON = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'"
    "%3E%3Ctext y='26' font-size='26'%3E%E2%98%85%3C/text%3E%3C/svg%3E"
)

# The design's three props (palette / pageStyle / pageMood) plus a local
# ink-saver mode. Values are the data-attribute values book.css keys off.
CONTROLS = [
    ("palette", "Palette", [("sky", "Sky &amp; sunshine"),
                            ("meadow", "Meadow morning"),
                            ("plum", "Plum twilight")]),
    ("style",   "Pages",   [("framed", "Framed card"), ("bleed", "Full bleed")]),
    ("mood",    "Mood",    [("playful", "Playful prompts"), ("quiet", "Quiet pages")]),
    ("ink",     "Ink",     [("full", "Full colour"), ("saver", "Ink saver")]),
]


def esc(text):
    return html.escape(str(text), quote=False)


def art_src(filename):
    """Plates are staged as JPEGs; the content JSON names the PNG master."""
    stem = pathlib.Path(filename).stem
    return "art_print/" + quote(stem + ".jpg")


# ---------------------------------------------------------------------------
# VALIDATION
# ---------------------------------------------------------------------------
def validate(doc):
    """A silent gap here ships a book with a blank page in it."""
    problems = []
    plates = doc["plates"]

    for p in plates:
        for field in ("n", "title", "prompt", "art"):
            if not p.get(field):
                problems.append(f"plate {p.get('n', '?')}: missing {field}")
        if not (ART_MASTERS / p["art"]).exists():
            problems.append(f"plate {p['n']}: master not found - {p['art']}")

    numbers = [p["n"] for p in plates]
    expected = list(range(1, len(plates) + 1))
    if sorted(numbers) != expected:
        problems.append(f"page numbering is not 1..{len(plates)}: {sorted(numbers)}")

    if len(set(numbers)) != len(numbers):
        problems.append("duplicate page numbers")

    cover = doc.get("cover_art")
    if cover and not (ART_MASTERS / cover).exists():
        problems.append(f"cover master not found - {cover}")

    return problems


# ---------------------------------------------------------------------------
# RENDER
# ---------------------------------------------------------------------------
def render_controls():
    out = []
    for key, label, options in CONTROLS:
        opts = "\n        ".join(
            f'<option value="{v}">{t}</option>' for v, t in options
        )
        out.append(
            f'  <label>{label}\n'
            f'    <select data-prop="{key}">\n        {opts}\n    </select>\n'
            f'  </label>'
        )
    return "\n".join(out)


def render_cover(doc):
    return f"""
  <section class="page page--cover">
   <div class="sheet sheet--cover">
    <div class="cover__eyebrow">
      <span class="cover__rule"></span>
      <span>{esc(doc['eyebrow'])}</span>
      <span class="cover__rule"></span>
    </div>
    <h1 class="cover__title">{esc(doc['title'])}</h1>
    <div class="cover__subtitle">{esc(doc['subtitle'])}</div>
    <div class="cover__art">
      <img src="art_print/{quote(doc['cover_art'])}" alt="{esc(doc['cover_alt'])}" />
    </div>
    <div class="cover__foot">
      <div class="cover__owner">
        <div class="cover__owner-label">This book belongs to</div>
        <div class="cover__owner-rule"></div>
      </div>
      <div class="cover__ages"><div>{esc(doc['ages'])}</div></div>
      <div class="cover__tagline">{esc(doc['tagline'])}</div>
    </div>
   </div>
  </section>"""


def render_intro(doc, plate_count):
    intro = doc["intro"]
    cards = "\n".join(
        f"""      <div class="intro__card">
        <div class="intro__card-title">{esc(c['title'])}</div>
        <p>{esc(c['body'])}</p>
      </div>""" for c in intro["cards"]
    )
    return f"""
  <section class="page page--intro">
   <div class="sheet sheet--intro">
    <div class="intro__eyebrow">{esc(intro['eyebrow'])}</div>
    <h2 class="intro__title">{esc(intro['title'])}</h2>
    <p class="intro__lede">{esc(intro['lede'].replace('{n}', str(plate_count)))}</p>
    <div class="intro__cards">
{cards}
    </div>
    <p class="intro__kicker">{esc(intro['kicker'])}</p>
   </div>
  </section>"""


def render_plate(plate, footer):
    # Deliberately no loading="lazy": this document exists to be printed, and a
    # lazy image that has not resolved when the print dialog opens prints an
    # empty frame.
    return f"""
  <section class="page page--plate">
   <div class="sheet sheet--plate">
    <header class="plate__head">
      <h2 class="plate__title">{esc(plate['title'])}</h2>
      <div class="plate__num"><span class="plate__star">&#9733;</span><span>Page {plate['n']:02d}</span></div>
    </header>
    <p class="plate__prompt">{esc(plate['prompt'])}</p>
    <div class="plate__frame">
      <img src="{art_src(plate['art'])}" alt="{esc(plate['title'])} &mdash; coloring page line art" />
    </div>
    <footer class="plate__foot">
      <span>Name ____________________</span>
      <span>{esc(footer)}</span>
      <span>Date ____________</span>
    </footer>
   </div>
  </section>"""


def build(doc):
    plates = doc["plates"]
    body = [render_cover(doc), render_intro(doc, len(plates))]
    body += [render_plate(p, doc["footer"]) for p in plates]

    return f"""<!DOCTYPE html>
<html lang="en" data-palette="sky" data-style="framed" data-mood="playful" data-ink="full">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(doc['title'])} {esc(doc['subtitle'])} &middot; {esc(doc['eyebrow'])}</title>
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONT_HREF}">
<link rel="stylesheet" href="styles/coloring-book.css">
</head>
<body>

<!-- Screen only. Replaces the Design editor's props panel so the book can be
     set up before it goes to the printer. Hidden by @media print. -->
<div class="controls" role="group" aria-label="Coloring book options">
{render_controls()}
  <button type="button" onclick="window.print()">Print &#8250;</button>
</div>

<main>
{"".join(body)}
</main>

<script>
  // Each control flips a data-attribute on <html>; every visual consequence
  // lives in coloring-book.css. Nothing here computes style.
  for (const sel of document.querySelectorAll('.controls [data-prop]')) {{
    const key = sel.dataset.prop;
    sel.value = document.documentElement.dataset[key];
    sel.addEventListener('change', () => {{
      document.documentElement.dataset[key] = sel.value;
      localStorage.setItem('rq-' + key, sel.value);
    }});
    const saved = localStorage.getItem('rq-' + key);
    if (saved) {{ sel.value = saved; document.documentElement.dataset[key] = saved; }}
  }}
</script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser(description="Build the Rhythm Quest Coloring Book print HTML.")
    ap.add_argument("--check", action="store_true", help="validate content JSON and exit")
    args = ap.parse_args()

    doc = json.loads(CONTENT_FILE.read_text(encoding="utf-8"))

    problems = validate(doc)
    if problems:
        print(f"[FAIL] {len(problems)} problem(s) in {CONTENT_FILE.name}:")
        for p in problems:
            print("  -", p)
        return 1
    print(f"[ok] {len(doc['plates'])} plates validated against {ART_MASTERS.name}/")

    if args.check:
        return 0

    if not CSS_FILE.exists():
        print(f"[FAIL] missing stylesheet: {CSS_FILE}")
        return 1

    HTML_OUT.write_text(build(doc), encoding="utf-8")
    sheets = len(doc["plates"]) + 2
    print(f"[ok] {HTML_OUT.name} - {sheets} sheets (cover + intro + {len(doc['plates'])} plates)")

    if not ART_PRINT.exists():
        print("[note] art_print/ not staged yet - run: py make_coloring_book_pdf.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
