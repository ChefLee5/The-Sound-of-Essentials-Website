import re
from pathlib import Path

html_path = Path("SOE_RhythmReady_Workbook_Interior_Lulu.html")
if not html_path.exists():
    print("HTML does not exist!")
    exit()

txt = html_path.read_text(encoding="utf-8")
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', txt)
print(f"Total img tags in HTML: {len(imgs)}")

missing = 0
for img in imgs:
    # Resolve relative to html_path's parent
    p = (html_path.parent / img).resolve()
    if not p.exists():
        missing += 1
        if missing <= 10:
            print(f"Missing in HTML: {img} -> {p}")

print(f"Total missing in HTML: {missing}")

# Check CSS image styles
print("\n--- Image styles in CSS ---")
for line in txt.splitlines():
    if "dict-image-zone" in line or "character-badge" in line or "img {" in line:
        print(line[:120])
