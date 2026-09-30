#!/usr/bin/env python3
"""
Generate Lulu Print-on-Demand Cover PDFs from user-provided covers.
Outputs:
1. SOE_RhythmReady_Workbook_Cover_Coil_Lulu.pdf (2 pages: Front & Back @ 8.75" x 11.25")
2. SOE_RhythmReady_Workbook_Cover_Paperback_Lulu.pdf (1-piece spread @ 18.254" x 11.25")
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import pymupdf

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).parent.resolve()
SRC_FRONT = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\rhythm-ready-workbook-cover.png")
SRC_BACK  = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\rhythm-ready-workbook-back cover1.png")

OUT_COIL_PDF = BASE_DIR / "SOE_RhythmReady_Workbook_Cover_Coil_Lulu.pdf"
OUT_PAPERBACK_PDF = BASE_DIR / "SOE_RhythmReady_Workbook_Cover_Paperback_Lulu.pdf"

DPI = 300
PAGE_COUNT = 454

# 8.5" x 11" trim + 0.125" bleed on all 4 sides = 8.75" x 11.25"
COVER_W_IN = 8.75
COVER_H_IN = 11.25
COVER_W_PX = round(COVER_W_IN * DPI)  # 2625 px
COVER_H_PX = round(COVER_H_IN * DPI)  # 3375 px

# Spine calculation: 446 pages * 0.002252" (60# paper) = 1.004392"
SPINE_W_IN = PAGE_COUNT * 0.002252
SPINE_W_PX = round(SPINE_W_IN * DPI)  # 301 px

# Total paperback spread width = bleed + 8.5" + spine + 8.5" + bleed = 17.25 + 1.004 = 18.254"
SPREAD_W_IN = 0.125 + 8.5 + SPINE_W_IN + 8.5 + 0.125
SPREAD_W_PX = round(SPREAD_W_IN * DPI)  # 5476 px
SPREAD_H_PX = COVER_H_PX               # 3375 px


def resize_to_bleed(im: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """Resize image to target bleed dimensions using high-quality Lanczos."""
    return im.resize((target_w, target_h), Image.LANCZOS)


def build_coil_cover():
    print(f"\n[Cover-Coil] Generating 2-page Coil Bound cover ({COVER_W_IN}\" x {COVER_H_IN}\" @ {DPI} DPI)...")
    im_front = Image.open(SRC_FRONT).convert("RGB")
    im_back  = Image.open(SRC_BACK).convert("RGB")

    front_bleed = resize_to_bleed(im_front, COVER_W_PX, COVER_H_PX)
    back_bleed  = resize_to_bleed(im_back, COVER_W_PX, COVER_H_PX)

    # Save as temporary JPEGs
    tmp_front = BASE_DIR / "scratch" / "tmp_front_coil.jpg"
    tmp_back  = BASE_DIR / "scratch" / "tmp_back_coil.jpg"
    tmp_front.parent.mkdir(parents=True, exist_ok=True)

    front_bleed.save(tmp_front, "JPEG", quality=95, dpi=(DPI, DPI), optimize=True)
    back_bleed.save(tmp_back, "JPEG", quality=95, dpi=(DPI, DPI), optimize=True)

    # Build 2-page PDF with PyMuPDF
    doc = pymupdf.open()
    
    # Page 1: Front Cover (630 x 810 pt)
    rect = pymupdf.Rect(0, 0, COVER_W_IN * 72, COVER_H_IN * 72)
    p1 = doc.new_page(width=rect.width, height=rect.height)
    p1.insert_image(rect, filename=str(tmp_front))

    # Page 2: Back Cover (630 x 810 pt)
    p2 = doc.new_page(width=rect.width, height=rect.height)
    p2.insert_image(rect, filename=str(tmp_back))

    doc.save(str(OUT_COIL_PDF), deflate=True)
    doc.close()
    
    # Clean up temp
    tmp_front.unlink(missing_ok=True)
    tmp_back.unlink(missing_ok=True)

    mb = OUT_COIL_PDF.stat().st_size / 1e6
    print(f"[Cover-Coil] ✅ Saved: {OUT_COIL_PDF.name} (2 pages, {COVER_W_IN}\" x {COVER_H_IN}\", {mb:.2f} MB)")


def build_paperback_cover():
    print(f"\n[Cover-Paperback] Generating 1-piece wrap spread ({SPREAD_W_IN:.3f}\" x {COVER_H_IN}\" @ {DPI} DPI)...")
    im_front = Image.open(SRC_FRONT).convert("RGB")
    im_back  = Image.open(SRC_BACK).convert("RGB")

    # Front panel width: 8.5" trim + 0.125" bleed = 8.625" -> 2588 px
    panel_w_px = round((8.5 + 0.125) * DPI)
    front_panel = im_front.resize((panel_w_px, SPREAD_H_PX), Image.LANCZOS)
    back_panel  = im_back.resize((panel_w_px, SPREAD_H_PX), Image.LANCZOS)

    # Create full canvas
    spread = Image.new("RGB", (SPREAD_W_PX, SPREAD_H_PX), color=(212, 168, 67)) # #d4a843 gold background

    # Paste Back cover on left
    spread.paste(back_panel, (0, 0))

    # Spine area: x = panel_w_px to panel_w_px + SPINE_W_PX
    spine_x0 = panel_w_px
    spine_x1 = spine_x0 + SPINE_W_PX
    spine_w  = SPINE_W_PX

    # Paste Front cover on right
    front_x0 = SPREAD_W_PX - panel_w_px
    spread.paste(front_panel, (front_x0, 0))

    # Draw spine
    # Create spine image: gradient from dark twilight (#1a1a2e) at top to gold (#d4a843) at bottom
    spine_img = Image.new("RGB", (spine_w, SPREAD_H_PX))
    draw_spine = ImageDraw.Draw(spine_img)
    for y in range(SPREAD_H_PX):
        t = y / SPREAD_H_PX
        # Interpolate between twilight #1a1a2e and gold #d4a843
        r = int((1-t)*0x1a + t*0xd4)
        g = int((1-t)*0x1a + t*0xa8)
        b = int((1-t)*0x2e + t*0x43)
        draw_spine.line([(0, y), (spine_w, y)], fill=(r, g, b))

    # Add vertical spine text using Fredoka font if available
    try:
        font_path = Path(r"C:\Users\ldmur\AppData\Local\Microsoft\Windows\Fonts\Fredoka.ttf")
        font_size = min(round(spine_w * 0.42), 120)
        spine_font = ImageFont.truetype(str(font_path), size=font_size)
    except Exception:
        spine_font = ImageFont.load_default()

    # Draw vertical text rotated 90 degrees clockwise (standard English spine convention: top-to-bottom)
    spine_txt = "SOE Rhythm Quest: Rhythm Ready Workbook"
    
    # Calculate text bounding box dynamically to ensure zero clipping
    dummy_draw = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    bbox = dummy_draw.textbbox((0, 0), spine_txt, font=spine_font)
    txt_w = bbox[2] - bbox[0]
    txt_h = bbox[3] - bbox[1]

    # Create text image with safe padding
    txt_layer = Image.new("RGBA", (txt_w + 40, spine_w), (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_layer)
    txt_draw.text((20, (spine_w - txt_h) // 2), spine_txt, fill=(255, 255, 255, 245), font=spine_font)
    
    # Rotate 270 deg (90 deg clockwise)
    rotated_txt = txt_layer.rotate(270, expand=True)
    # Center vertically along the spine height
    spine_y = (SPREAD_H_PX - rotated_txt.height) // 2
    spine_x = (spine_w - rotated_txt.width) // 2
    spine_img.paste(rotated_txt, (spine_x, spine_y), rotated_txt)

    # Paste spine into spread
    spread.paste(spine_img, (spine_x0, 0))

    # Save temporary JPEG
    tmp_pb = BASE_DIR / "scratch" / "tmp_paperback_spread.jpg"
    spread.save(tmp_pb, "JPEG", quality=95, dpi=(DPI, DPI), optimize=True)

    # Wrap in PDF with exact dimensions
    doc = pymupdf.open()
    rect = pymupdf.Rect(0, 0, SPREAD_W_IN * 72, COVER_H_IN * 72)
    p = doc.new_page(width=rect.width, height=rect.height)
    p.insert_image(rect, filename=str(tmp_pb))
    doc.save(str(OUT_PAPERBACK_PDF), deflate=True)
    doc.close()

    tmp_pb.unlink(missing_ok=True)

    mb = OUT_PAPERBACK_PDF.stat().st_size / 1e6
    print(f"[Cover-Paperback] ✅ Saved: {OUT_PAPERBACK_PDF.name} (1 spread, {SPREAD_W_IN:.3f}\" x {COVER_H_IN}\", {mb:.2f} MB)")


if __name__ == "__main__":
    build_coil_cover()
    build_paperback_cover()
