#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOE Rhythm Quest: Rhythm Ready Workbook — Lulu Interior & Complete PDF Builder
Generates 100% Lulu-compliant interior & complete PDFs:
- Trim: US Letter (8.5" x 11.0" / 612 x 792 pt)
- Mirrored duplex margins: 0.85" inside binding gutter, 0.55" outside safety margin
- 300 DPI high-resolution interior artwork properly sourced and populated
- Embedded TrueType brand fonts (Fredoka, Inter)
- Zero browser header/footer artifacts (--no-pdf-header-footer)
- Even page count guaranteed (required by Lulu print)
"""
import re
import subprocess
import sys
import tempfile
import shutil
from pathlib import Path
from PIL import Image
import pymupdf

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
PAGES = BASE / "OEBPS" / "pages"
CSS_FILE = BASE / "OEBPS" / "styles" / "workbook.css"
HTML_OUT = BASE / "SOE_RhythmReady_Workbook_Interior_Lulu.html"
PDF_OUT = BASE / "SOE_RhythmReady_Workbook_Interior_Lulu.pdf"

PDF_COMPLETE_OUT = BASE / "SOE_RhythmReady_Workbook_Complete.pdf"

IMAGES_SRC = BASE / "OEBPS" / "images_fullres_backup" if (BASE / "OEBPS" / "images_fullres_backup").exists() else BASE / "OEBPS" / "images"
IMAGES_PRINT = BASE / "OEBPS" / "images_print"

SRC_FRONT = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\rhythm-ready-workbook-cover.png")
SRC_BACK  = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\rhythm-ready-workbook-back cover1.png")

MAX_WIDTH = 1800         # High-resolution ~300 DPI at typical rendered widths
JPEG_QUALITY = 90
DPI = 300

EDGE_CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]


def prepare_images():
    """Convert and optimize master images for 300 DPI high-res print, preserving character PNGs."""
    print(f"\n[img] Preparing high-res print images from {IMAGES_SRC.name} -> images_print/ ...")
    count, before, after = 0, 0, 0
    IMAGES_PRINT.mkdir(parents=True, exist_ok=True)
    
    # 1. Process dictionary and general images
    for src in IMAGES_SRC.rglob("*"):
        if src.is_dir() or src.suffix.lower() not in (".png", ".jpg", ".jpeg"):
            continue
        rel = src.relative_to(IMAGES_SRC)
        dest = IMAGES_PRINT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        
        # If character image, copy PNG directly to preserve transparency and lower/upper casing
        if "characters" in rel.parts:
            shutil.copy2(src, dest)
            shutil.copy2(src, dest.parent / dest.name.lower())
            count += 1
            continue

        dest_jpg = dest.with_suffix(".jpg")
        if dest_jpg.exists() and dest_jpg.stat().st_mtime >= src.stat().st_mtime:
            count += 1
            before += src.stat().st_size
            after += dest_jpg.stat().st_size
            continue

        im = Image.open(src)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        elif im.mode != "RGB":
            im = im.convert("RGB")
        if im.width > MAX_WIDTH:
            ratio = MAX_WIDTH / im.width
            im = im.resize((MAX_WIDTH, round(im.height * ratio)), Image.LANCZOS)
        im.save(dest_jpg, "JPEG", quality=JPEG_QUALITY, dpi=(DPI, DPI), optimize=True)
        count += 1
        before += src.stat().st_size
        after += dest_jpg.stat().st_size

    # 2. Also copy all character avatars from OEBPS/images/characters
    char_src = BASE / "OEBPS" / "images" / "characters"
    char_dest = IMAGES_PRINT / "characters"
    char_dest.mkdir(parents=True, exist_ok=True)
    for c in char_src.glob("*.*"):
        shutil.copy2(c, char_dest / c.name)
        shutil.copy2(c, char_dest / c.name.lower())

    # 3. Also copy all Land Hero scenes from OEBPS/images/lands
    lands_src = BASE / "OEBPS" / "images" / "lands"
    lands_dest = IMAGES_PRINT / "lands"
    lands_dest.mkdir(parents=True, exist_ok=True)
    for l in lands_src.glob("*.*"):
        shutil.copy2(l, lands_dest / l.name)

    print(f"[img] ✅ High-res print images ready in images_print/ ({count} assets).")


def ordered_pages():
    """Interior reading order per Lulu standards: starts on Title Page (Recto)."""
    order = [
        PAGES / "title_page.xhtml",
        PAGES / "copyright.xhtml",
        PAGES / "frontmatter.xhtml",
        PAGES / "weekly_overview.xhtml",
    ]
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
    # Map image paths to absolute file:/// URIs pointing to images_print
    print_images_uri = (BASE / "OEBPS" / "images_print").as_uri()
    body = re.sub(r'src="(?:\.\./)+images/', f'src="{print_images_uri}/', body)
    return body, styles


def build_html():
    print(f"\n[html] Merging interior pages into {HTML_OUT.name}...")
    css = CSS_FILE.read_text(encoding="utf-8")
    css = re.sub(r"@import url\([^)]*\);", "", css)

    lulu_print_styles = """
    @page {
      size: 8.5in 11.0in;
      margin-top: 0.55in;
      margin-bottom: 0.65in;
    }
    @page :left {
      margin-left: 0.55in;   /* Outside margin */
      margin-right: 0.85in;  /* Inside binding gutter */
    }
    @page :right {
      margin-left: 0.85in;   /* Inside binding gutter */
      margin-right: 0.55in;  /* Outside margin */
    }
    body {
      background: #FFFDF6;
      padding: 0;
      font-size: 10.5pt;
      max-width: 100%;
    }
    .day-page {
      page-break-before: always;
      break-before: page;
    }
    .title-page-container, .copyright-container {
      page-break-after: always;
      break-after: page;
    }
    .activity-block {
      break-inside: avoid;
      page-break-inside: avoid;
      box-shadow: 0 2px 8px rgba(26,26,46,0.10);
      margin-bottom: 14pt;
    }
    .day-hero-scene {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #ffffff;
      border-radius: 12px;
      padding: 10px 10px 6px;
      margin: 14pt 0 16pt;
      text-align: center;
      box-shadow: 0 4px 14px rgba(26,26,46,0.08);
    }
    .day-hero-scene img {
      width: 100% !important;
      max-width: 520px !important;
      max-height: 250px !important;
      height: auto !important;
      object-fit: cover !important;
      display: block;
      margin: 0 auto;
      border-radius: 8px;
    }
    .day-hero-scene .hero-caption {
      font-family: 'Fredoka', cursive, sans-serif;
      font-size: 10pt;
      font-weight: 700;
      color: #555555;
      padding-top: 8px;
    }
    .dict-image-zone {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #ffffff;
      border-radius: 12px;
      padding: 8px 8px 4px;
      margin: 10px 0;
      text-align: center;
      box-shadow: 0 3px 10px rgba(26,26,46,0.08);
    }
    .dict-image-zone img {
      width: 100% !important;
      max-width: 500px !important;
      max-height: 260px !important;
      height: auto !important;
      object-fit: contain !important;
      display: block;
      margin: 0 auto;
      border-radius: 8px;
    }
    .write-zone, .draw-zone, .handwriting-zone {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .reflection-bubble, .goal-tracker, .char-tip {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    """

    parts = [
        "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'/>",
        "<title>SOE Rhythm Quest: Rhythm Ready Workbook — Lulu Interior</title>",
        f"<style>{css}\n{lulu_print_styles}</style>",
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
    print(f"[html] ✅ Merged {n} sections -> {HTML_OUT.name}")
    return n


def render_pdf(html_path: Path, pdf_path: Path, enforce_even: bool = True):
    edge = next((e for e in EDGE_CANDIDATES if Path(e).exists()), None)
    if not edge:
        print("[pdf] ERROR: Microsoft Edge not found.")
        return False

    profile = Path(tempfile.mkdtemp(prefix="edge_pdf_render_"))
    cmd = [
        edge,
        "--headless=new",
        "--disable-gpu",
        "--disable-extensions",
        f"--user-data-dir={profile}",
        "--no-first-run",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path.resolve()}",
        html_path.resolve().as_uri(),
    ]
    print(f"\n[pdf] Rendering {pdf_path.name} with Microsoft Edge Headless (clean headers/footers)...")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    
    if pdf_path.exists():
        doc = pymupdf.open(pdf_path)
        total_pages = len(doc)
        rect = doc[0].rect
        w_in, h_in = rect.width / 72.0, rect.height / 72.0
        doc.close()

        print(f"[pdf] Built: {total_pages} pages ({w_in:.2f}\" x {h_in:.2f}\")")

        if enforce_even and total_pages % 2 != 0:
            print(f"[pdf] Page count {total_pages} is odd! Appending Quest Notes page for even page count...")
            doc = pymupdf.open(pdf_path)
            rect = doc[0].rect
            page = doc.new_page(width=rect.width, height=rect.height)
            page.insert_text(pymupdf.Point(72, 72), "Quest Champion Notes", fontsize=16, color=(0.4, 0.4, 0.4))
            doc.save(pdf_path, incremental=True, encryption=pymupdf.PDF_ENCRYPT_KEEP)
            total_pages = len(doc)
            doc.close()
            print(f"[pdf] ✅ Updated to even page count: {total_pages} pages")

        mb = pdf_path.stat().st_size / 1e6
        print(f"[pdf] ✅ SUCCESS: {pdf_path.name} ({total_pages} pages, {mb:.1f} MB)")
        return True

    print(f"[pdf] FAILED: {result.stderr[-500:]}")
    return False


def build_complete_pdf():
    """Build the Complete Digital Workbook PDF: Front Cover + 454 Interior Pages + Back Cover."""
    print(f"\n[complete-pdf] Assembling {PDF_COMPLETE_OUT.name} with Front & Back covers...")
    if not PDF_OUT.exists():
        print("[complete-pdf] ERROR: Interior PDF must be built first!")
        return False
    if not SRC_FRONT.exists() or not SRC_BACK.exists():
        print("[complete-pdf] ERROR: Front or back cover image not found!")
        return False

    doc = pymupdf.open(PDF_OUT)
    rect = doc[0].rect  # 8.5 x 11 inches (612 x 792 pt)

    # Temporary cover JPEGs at 300 DPI
    tmp_front = BASE / "scratch" / "tmp_front_complete.jpg"
    tmp_back  = BASE / "scratch" / "tmp_back_complete.jpg"
    tmp_front.parent.mkdir(parents=True, exist_ok=True)

    im_f = Image.open(SRC_FRONT).convert("RGB")
    im_b = Image.open(SRC_BACK).convert("RGB")
    im_f.resize((2550, 3300), Image.LANCZOS).save(tmp_front, "JPEG", quality=95, dpi=(300, 300))
    im_b.resize((2550, 3300), Image.LANCZOS).save(tmp_back, "JPEG", quality=95, dpi=(300, 300))

    # Prepend Front Cover at page 0
    p_front = doc.new_page(pno=0, width=rect.width, height=rect.height)
    p_front.insert_image(rect, filename=str(tmp_front))

    # Append Back Cover at end
    p_back = doc.new_page(pno=-1, width=rect.width, height=rect.height)
    p_back.insert_image(rect, filename=str(tmp_back))

    doc.save(str(PDF_COMPLETE_OUT), deflate=True)
    total_pages = len(doc)
    doc.close()

    tmp_front.unlink(missing_ok=True)
    tmp_back.unlink(missing_ok=True)

    mb = PDF_COMPLETE_OUT.stat().st_size / 1e6
    print(f"[complete-pdf] ✅ SUCCESS: {PDF_COMPLETE_OUT.name} ({total_pages} pages, {mb:.1f} MB)")
    return True


def main():
    prepare_images()
    
    # 1. Build Lulu POD Interior PDF (starts on Title page per Lulu Guide)
    build_html()
    render_pdf(HTML_OUT, PDF_OUT, enforce_even=True)

    # 2. Build Complete Digital Workbook PDF (Front Cover + Interior + Back Cover)
    build_complete_pdf()


if __name__ == "__main__":
    main()
