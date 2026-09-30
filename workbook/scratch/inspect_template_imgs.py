from pathlib import Path
import re

txt = Path("templates/activity_template.xhtml").read_text(encoding="utf-8")
matches = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', txt)
print(f"Total img tags in template: {len(matches)}")
for tag in matches:
    print(" ", tag)
