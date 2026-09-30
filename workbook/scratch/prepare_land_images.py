from pathlib import Path
from PIL import Image
import shutil

ASSET_DIR = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets")
WB_DIR = Path(r"c:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\workbook")

EPUB_LANDS = WB_DIR / "OEBPS" / "images" / "lands"
PRINT_LANDS = WB_DIR / "OEBPS" / "images_print" / "lands"
BACKUP_LANDS = WB_DIR / "OEBPS" / "images_fullres_backup" / "lands"

for d in (EPUB_LANDS, PRINT_LANDS, BACKUP_LANDS):
    d.mkdir(parents=True, exist_ok=True)

LAND_MAPPING = {
    1: ("Dance Harmonia Vitalis.png", "land1_harmonia_hero.jpg", "Harmonia"),
    2: ("Kwame Counting.png", "land2_numeria_hero.jpg", "Numeria"),
    3: ("Animals Terrasol.png", "land3_terrasol_hero.jpg", "Terrasol"),
    4: ("Aquaria Shore.png", "land4_aquaria_hero.jpg", "Aquaria"),
    5: ("Living Food.png", "land5_vitalis_hero.jpg", "Vitalis"),
    6: ("March Luminosity.png", "land6_luminosity_hero.jpg", "Luminosity"),
    7: ("Time Celestia.png", "land7_celestia_hero.jpg", "Celestia"),
    8: ("Quest Congrats.png", "land8_grandquest_hero.jpg", "The Grand Quest"),
}

for week, (src_name, dest_name, land_name) in LAND_MAPPING.items():
    src_file = ASSET_DIR / src_name
    if not src_file.exists():
        print(f"ERROR: {src_name} not found!")
        continue

    # Backup master full-res copy
    shutil.copy2(src_file, BACKUP_LANDS / src_name)

    im = Image.open(src_file).convert("RGB")
    
    # 1. Print PDF high-res (max 1800 px wide, 300 DPI, 92 quality)
    print_im = im.copy()
    if print_im.width > 1800:
        ratio = 1800 / print_im.width
        print_im = print_im.resize((1800, round(print_im.height * ratio)), Image.LANCZOS)
    print_im.save(PRINT_LANDS / dest_name, "JPEG", quality=92, dpi=(300, 300), optimize=True)

    # 2. EPUB optimized (max 1000 px wide, 150 DPI, 82 quality)
    epub_im = im.copy()
    if epub_im.width > 1000:
        ratio = 1000 / epub_im.width
        epub_im = epub_im.resize((1000, round(epub_im.height * ratio)), Image.LANCZOS)
    epub_im.save(EPUB_LANDS / dest_name, "JPEG", quality=82, dpi=(150, 150), optimize=True)

    print(f"Week {week} ({land_name}): {src_name} -> {dest_name} (Print & EPUB ready)")

print("✅ All 8 Land Hero Artworks prepared successfully!")
