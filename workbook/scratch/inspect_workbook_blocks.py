import json
from pathlib import Path

BASE = Path(r"C:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\workbook")
with open(BASE / "workbook_content.json", encoding="utf-8") as f:
    data = json.load(f)

for w in data["weeks"]:
    wn = w["week"]
    print(f"\n--- Week {wn}: {w['theme']} (Primary Land {w['primary_land']}) ---")
    for d in w["days"]:
        dn = d["day"]
        b = d["blocks"]
        a_img = b.get("A", {}).get("img")
        b_img = b.get("B", {}).get("img")
        c_img = b.get("C", {}).get("img")
        d_img = b.get("D", {}).get("img")
        e_img = b.get("E", {}).get("img")
        g_img = b.get("G", {}).get("img")
        h_img = b.get("H", {}).get("img")
        i_img = b.get("I", {}).get("img")
        j_img = b.get("J", {}).get("img")
        print(f"Day {dn}: A={a_img} | B={b_img} | C={c_img} | D={d_img} | E={e_img} | G={g_img} | H={h_img} | I={i_img} | J={j_img}")
