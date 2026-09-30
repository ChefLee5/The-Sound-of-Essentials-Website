import json
from pathlib import Path
from collections import Counter

BASE = Path(r"C:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\workbook")
with open(BASE / "workbook_content.json", encoding="utf-8") as f:
    text = f.read()
    data = json.loads(text)

dict_refs = text.count("Picture Dictionary")
print(f"Picture Dictionary text occurrences: {dict_refs}")

same_day_dups = 0
weekly_dups = 0

for w in data["weeks"]:
    wn = w["week"]
    week_imgs = []
    for d in w["days"]:
        dn = d["day"]
        imgs = [v.get("img") for v in d["blocks"].values() if isinstance(v, dict) and "img" in v]
        week_imgs.extend(imgs)
        if len(imgs) != len(set(imgs)):
            same_day_dups += 1
            print(f"Duplicate on Week {wn} Day {dn}: {imgs}")
    
    # Check if any image is repeated within the same week
    counts = Counter(week_imgs)
    repeats = {k: v for k, v in counts.items() if v > 1}
    if repeats:
        weekly_dups += len(repeats)
        print(f"Week {wn} has repeated images: {repeats}")

print(f"Days with duplicate images on same day: {same_day_dups}")
print(f"Weeks with duplicate images in same week: {weekly_dups}")
