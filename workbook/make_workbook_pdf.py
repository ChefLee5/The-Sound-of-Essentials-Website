#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOE Summer Stretch Workbook — Print PDF Builder
Merges cover + frontmatter + all 40 day pages + back matter into a
single print HTML, then drives headless Microsoft Edge to produce
the letter-size print PDF automatically (no manual print dialog).

Usage:
  py make_workbook_pdf.py            # build HTML + PDF
  py make_workbook_pdf.py --html     # build merged HTML only
"""
import re
import subprocess
import sys
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
PAGES = BASE / "OEBPS" / "pages"
CSS_FILE = BASE / "OEBPS" / "styles" / "workbook.css"
HTML_OUT = BASE / "SOE_The_Summer_Stretch_Workbook_print.html"
PDF_OUT = BASE / "SOE_The_Summer_Stretch_Workbook_print.pdf"

EDGE_CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]


IMAGES_SRC = BASE / "OEBPS" / "images"
IMAGES_PRINT = BASE / "OEBPS" / "images_print"
MAX_WIDTH = 800         # ~150 dpi at the rendered 360px display width
JPEG_QUALITY = 72


def compress_images():
    """Mirror OEBPS/images into OEBPS/images_print as resized JPEGs.
    Transparency is flattened onto white. Originals are never touched."""
    from PIL import Image

    count, before, after = 0, 0, 0
    for src in IMAGES_SRC.rglob("*"):
        if src.suffix.lower() not in (".png", ".jpg", ".jpeg"):
            continue
        rel = src.relative_to(IMAGES_SRC)
        dest = (IMAGES_PRINT / rel).with_suffix(".jpg")
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
            count += 1
            before += src.stat().st_size
            after += dest.stat().st_size
            continue
        img = Image.open(src)
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1])
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")
        if img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / img.width
            img = img.resize((MAX_WIDTH, round(img.height * ratio)), Image.LANCZOS)
        img.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True)
        count += 1
        before += src.stat().st_size
        after += dest.stat().st_size
    print(f"[img] {count} images -> images_print/  ({before/1e6:.0f} MB -> {after/1e6:.0f} MB)")


def ordered_pages():
    order = [PAGES / "cover.xhtml", PAGES / "frontmatter.xhtml"]
    for w in range(1, 9):
        for d in range(1, 6):
            p = PAGES / f"week{w}" / f"day{d}.xhtml"
            if p.exists():
                order.append(p)
    for bm in ["bm_achievement.xhtml", "bm_glossary.xhtml", "bm_parent_guide.xhtml"]:
        p = PAGES / bm
        if p.exists():
            order.append(p)
    return order


def extract(path: Path):
    content = path.read_text(encoding="utf-8")
    styles = re.findall(r"<style>(.*?)</style>", content, re.DOTALL)
    m = re.search(r"<body[^>]*>(.*?)</body>", content, re.DOTALL)
    body = m.group(1).strip() if m else ""
    # image paths: pages reference ../images/... — point them at the
    # compressed print mirror (all JPEG) instead of the full-res originals
    body = body.replace('src="../images/', 'src="OEBPS/images_print/')
    body = re.sub(r'(src="OEBPS/images_print/[^"]*)\.png"', r'\1.jpg"', body)
    # per-page <style> blocks scope the header color to .day-page — keep them
    # scoped by wrapping each page body in a div carrying that page's style.
    return body, styles


BRAND_FONTS = ("Fredoka", "Inter", "Bricolage")


def check_brand_fonts():
    """Warn loudly if the brand typefaces are not installed on this machine.

    Headless Edge's --print-to-pdf pipeline does NOT load @font-face webfonts.
    Verified 2026-07-30: neither data: URIs nor local file:// URLs are applied;
    both fall back silently. It DOES resolve fonts installed on the system, by
    family name -- and workbook.css already names the right stacks. So the only
    working fix is to install Fredoka / Inter / Bricolage Grotesque as system
    fonts. Without them this script produces a book set in Segoe UI and Arial,
    which is what shipped before anyone noticed.
    """
    import os
    dirs = [Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts",
            Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "Windows" / "Fonts"]
    have = set()
    for d in dirs:
        if not d.exists():
            continue
        for f in d.glob("*.tt*"):
            for b in BRAND_FONTS:
                if b.lower() in f.name.lower():
                    have.add(b)
    missing = [b for b in BRAND_FONTS if b not in have]
    if missing:
        print("[font] " + "!" * 62)
        print(f"[font] WARNING: brand typefaces NOT installed: {', '.join(missing)}")
        print("[font] Output will fall back to Segoe UI / Arial, NOT brand canon.")
        print("[font] Fix: install the .ttf files, then re-run. @font-face does")
        print("[font] not work here -- headless Edge print ignores webfonts.")
        print("[font] " + "!" * 62)
    else:
        print(f"[font] brand typefaces present: {', '.join(sorted(have))}")
    return not missing


def build():
    css = CSS_FILE.read_text(encoding="utf-8")
    # The Google Fonts @import stalls headless Edge's print pipeline, so it goes.
    css = re.sub(r"@import url\([^)]*\);", "", css)
    check_brand_fonts()
    parts = [
        "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'/>",
        "<title>SOE Rhythm Quest: The Summer Stretch Workbook — Print</title>",
        f"<style>{css}</style>",
        "</head><body>",
    ]
    n = 0
    for page in ordered_pages():
        body, styles = extract(page)
        scope = f"pg{n}"
        scoped_styles = "".join(
            f"<style>{s.replace('.day-page', f'#{scope} .day-page')}</style>" for s in styles
        )
        parts.append(f"<div id='{scope}'>{scoped_styles}{body}</div>")
        n += 1
    parts.append("</body></html>")
    HTML_OUT.write_text("\n".join(parts), encoding="utf-8")
    print(f"[html] merged {n} pages -> {HTML_OUT.name}")
    return n


def to_pdf():
    edge = next((e for e in EDGE_CANDIDATES if Path(e).exists()), None)
    if not edge:
        print("[pdf] ERROR: Edge not found; open the HTML and print manually.")
        return False
    import tempfile
    profile = Path(tempfile.mkdtemp(prefix="edge_pdf_"))
    cmd = [
        edge,
        "--headless=new",
        "--disable-gpu",
        "--disable-extensions",
        f"--user-data-dir={profile}",
        "--no-first-run",
        "--no-margins",
        f"--print-to-pdf={PDF_OUT}",
        "--print-to-pdf-no-header",
        HTML_OUT.resolve().as_uri(),
    ]
    print("[pdf] rendering with headless Edge ...")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=560)
    if PDF_OUT.exists():
        mb = PDF_OUT.stat().st_size / 1e6
        print(f"[pdf] OK -> {PDF_OUT.name}  ({mb:.1f} MB)")
        return True
    print(f"[pdf] FAILED: {result.stderr[-500:]}")
    return False


if __name__ == "__main__":
    compress_images()
    build()
    if "--html" not in sys.argv:
        to_pdf()
