import json
from pathlib import Path
import shutil

char_dir = Path("OEBPS/images/characters")
print("Existing files in char_dir:")
for f in char_dir.glob("*.png"):
    # ensure both lowercase and uppercase exist if needed
    lower_f = char_dir / f.name.lower()
    if not lower_f.exists():
        shutil.copy2(f, lower_f)
        print(f"Created lowercase copy: {lower_f.name}")

# Also update workbook_content.json so all char images are explicitly lowercase
content_path = Path("workbook_content.json")
data = json.loads(content_path.read_text(encoding="utf-8"))

def fix_dict(d):
    if isinstance(d, dict):
        for k, v in d.items():
            if k in ("primary_char_img", "char_img") and isinstance(v, str) and v.endswith(".png"):
                d[k] = v.lower()
            elif isinstance(v, (dict, list)):
                fix_dict(v)
    elif isinstance(d, list):
        for item in d:
            fix_dict(item)

fix_dict(data)
content_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
print("Updated workbook_content.json character image references to lowercase.")
