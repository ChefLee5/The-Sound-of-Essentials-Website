#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build posters.json for the workbook poster pipeline.

Merges WORKBOOK_ART_MANIFEST.md (125 workbook images: land, heroes, accent,
alt/brief) with the ebook vocab tables (ebook/OEBPS/pages/landN-<topic>.xhtml)
to produce one record per poster. Word curation (picking the 15-20 most
depictable words) happens afterwards by editing the "words" list per record;
this script fills "vocab_pool" with every word found so the curator chooses
from canon vocabulary only.

Usage:  py build_manifest.py            # writes posters.json next to this file
        py build_manifest.py --check    # report topics with no ebook page match
"""
import argparse
import io
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent           # workbook/poster_pipeline
WORKBOOK = BASE.parent                            # workbook/
REPO = WORKBOOK.parent                            # repo root
MANIFEST = WORKBOOK / "WORKBOOK_ART_MANIFEST.md"
EBOOK_PAGES = REPO / "ebook" / "OEBPS" / "pages"
OUT = BASE / "posters.json"

# Same canon as generate_workbook_art.py: land -> (name, heroes, accent color
# NAME (hex gets painted onto walls), setting phrase with no proper nouns).
LANDS = {
    1: ("Harmonia", ("Kenji", "Aiko"), "warm golden yellow",
        "a warm, music-filled village classroom world of song, greetings and friendship"),
    2: ("Numeria", ("Octavia", "Kwame"), "soft sage green",
        "a playful geometric world of numbers, counting games, coins and patterns"),
    3: ("Terrasol", ("Vesta", "Silas"), "fresh spring green",
        "a lush garden-and-farm world of plants, animals and nature discovery"),
    4: ("Aquaria", ("Nerissa", "Ronan"), "calm sky blue",
        "a bright coastal harbor world of water, boats, maps and travel"),
    5: ("Vitalis", ("Amara", "Felix"), "warm terracotta",
        "a sunny park-and-playground world of movement, health and good food"),
    6: ("Luminosity", ("Athena", "Ezra"), "soft coral",
        "a friendly town-square world of helpers, workshops, tools and community"),
    7: ("Celestia", ("Selene", "Elias"), "gentle violet",
        "a dreamy starlit observatory world of clocks, seasons and night sky"),
}

WORD_CELL = re.compile(r'<td class="col-word">([^<]+)</td>')
HEADING = re.compile(r'^## (land(\d)_[a-z0-9-]+)\.jpg\s*$')
ALT_LINE = re.compile(r'^\- \*\*Current alt text:\*\* (.+)$')


def slug_title(slug):
    words = slug.split("-")
    small = {"the", "and", "of", "in", "at", "to", "a", "an", "on", "for"}
    out = []
    for i, w in enumerate(words):
        out.append(w if (w in small and i > 0) else w.capitalize())
    return " ".join(out).replace("Asl", "ASL").replace("Gps", "GPS")


def vocab_pool(land, slug):
    page = EBOOK_PAGES / f"land{land}-{slug}.xhtml"
    if not page.exists():
        return None, str(page.name)
    html = io.open(page, encoding="utf-8").read()
    words = [w.strip() for w in WORD_CELL.findall(html)]
    seen, pool = set(), []
    for w in words:
        if w.lower() not in seen:
            seen.add(w.lower())
            pool.append(w)
    return pool, page.name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    text = io.open(MANIFEST, encoding="utf-8").read().splitlines()
    records, cur = [], None
    for line in text:
        m = HEADING.match(line)
        if m:
            basename, land = m.group(1), int(m.group(2))
            slug = basename.split("_", 1)[1]
            cur = {"basename": basename + ".jpg", "land": land, "slug": slug}
            records.append(cur)
            continue
        if cur is not None:
            a = ALT_LINE.match(line)
            if a:
                cur["alt"] = a.group(1).strip()

    posters, missing = [], []
    for r in records:
        land_name, heroes, accent, setting = LANDS[r["land"]]
        pool, page = vocab_pool(r["land"], r["slug"])
        if pool is None:
            missing.append(r["basename"])
        posters.append({
            "basename": r["basename"],
            "title": slug_title(r["slug"]),
            "land": r["land"],
            "land_name": land_name,
            "heroes": list(heroes),
            "accent": accent,
            "setting": setting,
            "alt": r.get("alt", ""),
            "vocab_source": page if pool else None,
            "vocab_pool": pool or [],
            "words": [],          # curated 15-20 depictable words (filled later)
            "scene_extra": "",    # optional per-poster scene guidance
            "status": "pending",  # pending -> generated -> anchored -> composed
            "job_id": None,
            "scene_url": None,
            "anchors": {},        # word -> [x, y] normalized 0-1
        })

    OUT.write_text(json.dumps(posters, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT.name}: {len(posters)} posters, "
          f"{sum(1 for p in posters if p['vocab_pool'])} with vocab pools, "
          f"{len(missing)} missing ebook pages")
    if args.check or missing:
        for b in missing:
            print(f"  no ebook vocab page: {b}")


if __name__ == "__main__":
    main()
