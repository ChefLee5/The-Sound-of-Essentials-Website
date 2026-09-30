import re
from pathlib import Path

pages_dir = Path("OEBPS/pages")
for f in pages_dir.glob("*.xhtml"):
    txt = f.read_text(encoding="utf-8")
    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', txt)
    if imgs:
        print(f"{f.name}:")
        for img in imgs:
            resolved = (f.parent / img).resolve()
            print(f"   src={img} -> exists={resolved.exists()}")
