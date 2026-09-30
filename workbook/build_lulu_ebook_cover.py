#!/usr/bin/env python3
"""
Generate the standalone Lulu Ebook Cover file per Lulu Ebook Creation Guide (Page 12).
Target: 612 x 792 pixels @ 150 DPI.
Source: rhythm-ready-workbook-cover.png
"""
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).parent.resolve()
SRC_COVER = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\rhythm-ready-workbook-cover.png")
OUT_LULU_COVER = BASE_DIR / "SOE_RhythmReady_Workbook_Ebook_Cover_612x792.jpg"
OUT_EPUB_COVER = BASE_DIR / "OEBPS" / "images" / "cover.jpg"

def build_cover():
    print(f"Loading source cover: {SRC_COVER.name} ...")
    im = Image.open(SRC_COVER).convert("RGB")
    target_w, target_h = 612, 792
    
    # Calculate fit while preserving aspect ratio
    # Source is 1104 x 1425 (ratio 0.7747). Target is 612 x 792 (ratio 0.7727).
    # Resize with LANCZOS to 612 x 792
    cover_resized = im.resize((target_w, target_h), Image.LANCZOS)
    
    # Save standalone Lulu upload file
    cover_resized.save(OUT_LULU_COVER, "JPEG", quality=95, dpi=(150, 150), optimize=True)
    print(f"Generated standalone Lulu Ebook Cover: {OUT_LULU_COVER.name} ({target_w}x{target_h}, 150 DPI)")
    
    # Save embedded EPUB cover
    OUT_EPUB_COVER.parent.mkdir(parents=True, exist_ok=True)
    cover_resized.save(OUT_EPUB_COVER, "JPEG", quality=95, dpi=(150, 150), optimize=True)
    print(f"Generated embedded EPUB cover: {OUT_EPUB_COVER.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    build_cover()
