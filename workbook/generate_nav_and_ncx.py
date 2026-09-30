#!/usr/bin/env python3
"""
Generate valid EPUB 3 nav.xhtml and EPUB 2 toc.ncx.
Ensures 100% compliance with Lulu Ebook Creation Guide (Pages 6-7, 10-11).
"""
import json
from pathlib import Path
from xml.sax.saxutils import escape

BASE_DIR = Path(__file__).parent.resolve()
CONTENT_FILE = BASE_DIR / "workbook_content.json"
NAV_FILE = BASE_DIR / "OEBPS" / "pages" / "nav.xhtml"
NCX_FILE = BASE_DIR / "OEBPS" / "toc.ncx"

def generate():
    content = json.loads(CONTENT_FILE.read_text(encoding="utf-8"))
    weeks = content.get("weeks", [])
    
    # ── 1. BUILD nav.xhtml (EPUB 3) ──────────────────────────────────────────
    toc_items = [
        '      <li><a href="cover.xhtml">Cover</a></li>',
        '      <li><a href="title_page.xhtml">Title Page</a></li>',
        '      <li><a href="copyright.xhtml">Copyright</a></li>',
        '      <li><a href="frontmatter.xhtml">How to Use This Workbook</a></li>',
        '      <li><a href="weekly_overview.xhtml">Rhythm Ready Quest Calendar</a></li>',
    ]

    day_labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    for w in weeks:
        wn = w.get("week")
        theme = w.get("theme", f"Week {wn}")
        day_subitems = []
        for d in w.get("days", []):
            dn = d.get("day")
            day_title = d.get("day_title", "")
            dlabel = day_labels[dn-1] if 1 <= dn <= 5 else f"Day {dn}"
            label = f"Day {dn} ({dlabel}): {day_title}" if day_title else f"Day {dn} — {dlabel}"
            day_subitems.append(f'          <li><a href="week{wn}/day{dn}.xhtml">{escape(label)}</a></li>')
        
        toc_items.append(
            f'      <li>\n'
            f'        <a href="week{wn}/day1.xhtml">Week {wn}: {escape(theme)}</a>\n'
            f'        <ol>\n' + "\n".join(day_subitems) + f'\n        </ol>\n'
            f'      </li>'
        )

    toc_items += [
        '      <li><a href="bm_achievement.xhtml">Quest Achievement Chart</a></li>',
        '      <li><a href="bm_glossary.xhtml">Workbook Glossary</a></li>',
        '      <li><a href="bm_parent_guide.xhtml">Parent &amp; Educator Guide</a></li>',
    ]

    nav_xhtml = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops"
      lang="en" xml:lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Table of Contents — SOE RhythmReady Workbook</title>
  <link rel="stylesheet" type="text/css" href="../styles/workbook.css"/>
  <style>
    nav#toc ol {{ list-style-type: none; padding-left: 1.25rem; }}
    nav#toc > ol {{ padding-left: 0; }}
    nav#toc li {{ margin: 0.4rem 0; }}
    nav#toc a {{ text-decoration: none; color: #1a1a2e; font-weight: 500; }}
    nav#toc a:hover {{ color: #4F46E5; }}
  </style>
</head>
<body>
  <nav epub:type="toc" id="toc" aria-label="Table of Contents">
    <h1 class="page-title">Table of Contents</h1>
    <ol>
{chr(10).join(toc_items)}
    </ol>
  </nav>

  <nav epub:type="landmarks" id="landmarks" hidden="hidden" aria-label="Landmarks">
    <h2>Landmarks</h2>
    <ol>
      <li><a epub:type="cover" href="cover.xhtml">Cover</a></li>
      <li><a epub:type="titlepage" href="title_page.xhtml">Title Page</a></li>
      <li><a epub:type="toc" href="nav.xhtml">Table of Contents</a></li>
      <li><a epub:type="bodymatter" href="week1/day1.xhtml">Start Quest</a></li>
    </ol>
  </nav>
</body>
</html>
"""
    NAV_FILE.write_text(nav_xhtml, encoding="utf-8")
    print(f"Generated {NAV_FILE.name}")

    # ── 2. BUILD toc.ncx (EPUB 2 fallback for Lulu/Retailers) ─────────────────
    ncx_points = []
    play_order = 1

    def add_point(title, src):
        nonlocal play_order
        ncx_points.append(
            f'    <navPoint id="num_{play_order}" playOrder="{play_order}">\n'
            f'      <navLabel><text>{escape(title)}</text></navLabel>\n'
            f'      <content src="pages/{src}"/>\n'
            f'    </navPoint>'
        )
        play_order += 1

    add_point("Cover", "cover.xhtml")
    add_point("Title Page", "title_page.xhtml")
    add_point("Copyright", "copyright.xhtml")
    add_point("How to Use This Workbook", "frontmatter.xhtml")
    add_point("Rhythm Ready Quest Calendar", "weekly_overview.xhtml")

    for w in weeks:
        wn = w.get("week")
        theme = w.get("theme", f"Week {wn}")
        w_play = play_order
        play_order += 1
        
        day_points = []
        for d in w.get("days", []):
            dn = d.get("day")
            day_title = d.get("day_title", "")
            dlabel = day_labels[dn-1] if 1 <= dn <= 5 else f"Day {dn}"
            label = f"Day {dn} ({dlabel}): {day_title}" if day_title else f"Day {dn} — {dlabel}"
            day_points.append(
                f'      <navPoint id="num_{play_order}" playOrder="{play_order}">\n'
                f'        <navLabel><text>{escape(label)}</text></navLabel>\n'
                f'        <content src="pages/week{wn}/day{dn}.xhtml"/>\n'
                f'      </navPoint>'
            )
            play_order += 1

        ncx_points.append(
            f'    <navPoint id="num_{w_play}" playOrder="{w_play}">\n'
            f'      <navLabel><text>Week {wn}: {escape(theme)}</text></navLabel>\n'
            f'      <content src="pages/week{wn}/day1.xhtml"/>\n'
            + "\n".join(day_points) +
            f'\n    </navPoint>'
        )

    add_point("Quest Achievement Chart", "bm_achievement.xhtml")
    add_point("Workbook Glossary", "bm_glossary.xhtml")
    add_point("Parent & Educator Guide", "bm_parent_guide.xhtml")

    ncx_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="soe-rhythmready-workbook-2026"/>
    <meta name="dtb:depth" content="2"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>SOE Rhythm Quest: Rhythm Ready Workbook</text>
  </docTitle>
  <docAuthor>
    <text>The Sound of Essentials Team</text>
  </docAuthor>
  <navMap>
{chr(10).join(ncx_points)}
  </navMap>
</ncx>
"""
    NCX_FILE.write_text(ncx_content, encoding="utf-8")
    print(f"Generated {NCX_FILE.name} with {play_order-1} navigation points.")

if __name__ == "__main__":
    generate()
