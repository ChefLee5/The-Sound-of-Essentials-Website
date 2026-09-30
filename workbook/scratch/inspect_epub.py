import zipfile
import re
from pathlib import Path

epub_path = Path("SOE_RhythmReady_Workbook.epub")
if not epub_path.exists():
    print("EPUB does not exist!")
    exit()

with zipfile.ZipFile(epub_path, "r") as z:
    names = z.namelist()
    images = [n for n in names if n.startswith("OEBPS/images/")]
    pages = [n for n in names if n.startswith("OEBPS/pages/")]
    print(f"Total files in epub: {len(names)}")
    print(f"Images in epub: {len(images)}")
    print(f"Pages in epub: {len(pages)}")
    
    # Check day1.xhtml content inside epub
    day1_txt = z.read("OEBPS/pages/week1/day1.xhtml").decode("utf-8")
    imgs_in_day1 = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', day1_txt)
    print("Imgs in day1.xhtml inside epub:")
    for img in imgs_in_day1:
        print("  ", img)
        # Check if it resolves in the zip!
        # page is at OEBPS/pages/week1/day1.xhtml
        # if img is ../images/characters/AMARA.png
        # resolved in zip: OEBPS/pages/images/characters/AMARA.png
        resolved_bad = "OEBPS/pages/" + img[3:]
        resolved_good = "OEBPS/" + img[6:] if img.startswith("../../") else "OEBPS/" + img[3:]
        print(f"    in zip bad: {resolved_bad in names}")
        print(f"    in zip good: {'OEBPS/images/' + img.split('images/')[-1] in names}")
