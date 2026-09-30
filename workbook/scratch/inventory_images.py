import json
from pathlib import Path

wb_dir = Path("c:/Users/ldmur/Downloads/The-Sound-of-Essentials-Website/workbook")
content_path = wb_dir / "workbook_content.json"
with open(content_path, encoding="utf-8") as f:
    data = json.load(f)

needed_dict_imgs = set()
needed_char_imgs = set()

weeks = data.get("weeks", [])
if isinstance(weeks, dict):
    weeks = weeks.values()

for week in weeks:
    for day in week.get("days", []):
        if "primary_char_img" in day:
            needed_char_imgs.add(day["primary_char_img"])
        for block_key, block in day.get("blocks", {}).items():
            if "img" in block:
                needed_dict_imgs.add(block["img"])

print(f"Needed dictionary images: {len(needed_dict_imgs)}")
print(f"Needed character images: {len(needed_char_imgs)}")

img_dirs = {
    "wb_images_dict": wb_dir / "OEBPS/images/dictionary",
    "wb_images_char": wb_dir / "OEBPS/images/characters",
    "wb_print_dict": wb_dir / "OEBPS/images_print/dictionary",
    "wb_print_char": wb_dir / "OEBPS/images_print/characters",
    "wb_fullres_dict": wb_dir / "OEBPS/images_fullres_backup/dictionary",
    "ebook_images": Path("c:/Users/ldmur/Downloads/The-Sound-of-Essentials-Website/ebook/OEBPS/images"),
    "asset_folder": Path("c:/Users/ldmur/Downloads/The Sound of Essentials Image Assets"),
}

for name, p in img_dirs.items():
    if p.exists():
        files = list(p.glob("*.*"))
        print(f"{name}: {len(files)} files ({p})")
    else:
        print(f"{name}: DOES NOT EXIST")

missing_dict = [
    img for img in needed_dict_imgs 
    if not (wb_dir / "OEBPS/images/dictionary" / img).exists()
    and not (wb_dir / "OEBPS/images/dictionary" / (Path(img).stem + ".jpg")).exists()
    and not (wb_dir / "OEBPS/images/dictionary" / (Path(img).stem + ".png")).exists()
]
print(f"\nMissing dict images in wb_images_dict: {len(missing_dict)}")
if missing_dict:
    print("  Missing dict images:", missing_dict)

missing_char = [
    img for img in needed_char_imgs
    if not (wb_dir / "OEBPS/images/characters" / img).exists()
]
print(f"Missing char images in wb_images_char: {len(missing_char)}")
if missing_char:
    print("  Missing char images:", missing_char)
