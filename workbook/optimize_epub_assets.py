#!/usr/bin/env python3
"""
Optimize images specifically for the EPUB package per Lulu Ebook Guide (Page 8).
Target:
- Character avatars: 300x300 PNG with transparency, optimized.
- Dictionary scenes: max width 650px, 150 DPI JPEG quality 84.
Originals in OEBPS/images are backed up or preserved for high-res print.
"""
from pathlib import Path
from PIL import Image
import shutil

BASE_DIR = Path(__file__).parent.resolve()
IMAGES_DIR = BASE_DIR / "OEBPS" / "images"
BACKUP_DIR = BASE_DIR / "OEBPS" / "images_fullres_backup"

def optimize():
    # 1. First backup fullres originals if not already backed up
    if not BACKUP_DIR.exists():
        print(f"Creating backup of full-res images in {BACKUP_DIR.name} ...")
        shutil.copytree(IMAGES_DIR, BACKUP_DIR)
        print("Backup complete.")
    else:
        print(f"Full-res backup already exists in {BACKUP_DIR.name}.")

    char_dir = IMAGES_DIR / "characters"
    dict_dir = IMAGES_DIR / "dictionary"

    before_size = 0
    after_size = 0

    # Optimize character avatars
    print("\nOptimizing character avatars...")
    for p in char_dir.glob("*.png"):
        before_size += p.stat().st_size
        im = Image.open(p)
        if im.width > 300 or im.height > 300:
            ratio = min(300 / im.width, 300 / im.height)
            new_size = (round(im.width * ratio), round(im.height * ratio))
            im = im.resize(new_size, Image.LANCZOS)
        im.save(p, "PNG", optimize=True)
        after_size += p.stat().st_size

    # Optimize dictionary scenes
    print("Optimizing dictionary scenes...")
    for p in dict_dir.glob("*.jpg"):
        before_size += p.stat().st_size
        im = Image.open(p)
        if im.width > 650:
            ratio = 650 / im.width
            new_size = (650, round(im.height * ratio))
            im = im.resize(new_size, Image.LANCZOS)
        im.save(p, "JPEG", quality=84, dpi=(150, 150), optimize=True)
        after_size += p.stat().st_size

    print(f"\n[Epub Asset Optimization]")
    print(f"  Before: {before_size / 1e6:.1f} MB")
    print(f"  After:  {after_size / 1e6:.1f} MB")
    print(f"  Saved:  {(before_size - after_size) / 1e6:.1f} MB ({(1 - after_size/before_size)*100:.1f}% reduction)")

if __name__ == "__main__":
    optimize()
