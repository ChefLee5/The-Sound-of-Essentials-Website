import re
from pathlib import Path

tmpl_path = Path("templates/activity_template.xhtml")
content = tmpl_path.read_text(encoding="utf-8")

# Replace all src="../images/ with src="../../images/
updated = content.replace('src="../images/', 'src="../../images/')

# Count replacements
count_old = len(re.findall(r'src="\.\./images/', updated))
count_new = len(re.findall(r'src="\.\./\.\./images/', updated))

print(f"Old count remaining: {count_old}")
print(f"New count: {count_new}")

tmpl_path.write_text(updated, encoding="utf-8")
print("Updated templates/activity_template.xhtml successfully!")
