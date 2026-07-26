#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate text-free poster scenes via the Higgsfield CLI (nano_banana_pro).

For every posters.json record with curated words and status "pending":
build a no-text scene prompt (poster style + land heroes + object list),
attach 2 style refs + the land's 2 hero refs, create the job, wait, download
the PNG into scenes/, and mark status "generated".

Prompt rules inherited from generate_workbook_art.py (learned the hard way):
- never name the land (the model paints the word on walls)
- accent color as a NAME, never hex
- "exactly TWO children ... exactly once" to stop hero duplication
- hard no-text clause

Usage:  py generate_scenes.py --limit 5        # pilot
        py generate_scenes.py                  # all curated pending
        py generate_scenes.py --only land3_the-barnyard.jpg
"""
import argparse
import io
import json
import subprocess
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
POSTERS = BASE / "posters.json"
REFS = BASE / "refs.json"
SCENES = BASE / "scenes"
REF_DIR = Path(r"C:\Users\ldmur\Downloads\The Sound of Essentials Image Assets")
REF_NAME_OVERRIDES = {"Selene": "Celene Ref.jpeg", "Silas": "Silas.jpeg"}

# Uploaded style references: two picture-dictionary originals + the approved
# pilot classroom scene (locks character rendering / animation style).
STYLE_REF_IDS = [
    "e1f71136-9860-4062-ac4e-57081d97323b",  # land3-the-garden.png
    "d47f7723-3534-40b5-804c-571cac8c407d",  # land1-music-instruments.png
    "e1f01cf3-623f-4d2e-b29d-467ceee0616a",  # scenes/land1_the-classroom.png (approved)
]

GENDER = {
    "Kenji": "boy", "Kwame": "boy", "Silas": "boy", "Ronan": "boy",
    "Felix": "boy", "Ezra": "boy", "Elias": "boy",
    "Aiko": "girl", "Octavia": "girl", "Vesta": "girl", "Nerissa": "girl",
    "Amara": "girl", "Athena": "girl", "Selene": "girl",
}

PROMPT = (
    "STRICT RULE, HIGHEST PRIORITY: match the exact art and character animation style "
    "of the reference scene images - same linework, same soft palette, same character "
    "proportions and face style. "
    "SECOND STRICT RULE: this image contains ZERO readable characters - no "
    "text, words, letters, numbers, digits, signs, labels, tags, logos or writing of "
    "any kind, anywhere, in any language. Never label an object, stall, shelf or area "
    "with its name. Awnings, banners, chalkboards, price tags, papers, lists, "
    "receipts, books and screens are blank or show only wavy squiggle lines and "
    "simple shapes. Areas are recognizable purely by the goods and objects in them, "
    "never by signage. "
    "Children's picture-dictionary scene illustration in the exact painterly storybook "
    "style of the first two reference images: warm hand-drawn linework, soft colors, a "
    "rich detailed environment filling the square frame edge to edge. Scene: {scene}, "
    "set in {setting}. {people} "
    "The scene must clearly contain, well separated from each other and each "
    "fully visible and easy to point at: {objects}. Keep the very top of the image as "
    "calm open background (sky, wall or foliage) so a title banner can be added later. "
    "Color palette anchored on {accent}. Square composition, high detail."
)


def run(args):
    r = subprocess.run(["higgsfield"] + args, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", shell=True)
    if r.returncode != 0:
        raise RuntimeError(f"higgsfield {' '.join(args)} failed:\n{r.stdout}\n{r.stderr}")
    return r.stdout.strip()


def hero_ref_id(hero, refs):
    if hero in refs:
        return refs[hero]
    path = REF_DIR / REF_NAME_OVERRIDES.get(hero, f"{hero} Ref.jpeg")
    if not path.exists():
        raise FileNotFoundError(path)
    upload_id = run(["upload", "create", str(path)]).splitlines()[-1].strip()
    refs[hero] = upload_id
    REFS.write_text(json.dumps(refs, indent=2), encoding="utf-8")
    print(f"  uploaded hero ref {hero} -> {upload_id}")
    return upload_id


def build_prompt(p):
    h1, h2 = p["heroes"]
    scene = p["alt"] or p["title"]
    # strip the land's proper noun; it gets painted onto walls
    for token in (p["land_name"] + "'s", p["land_name"]):
        scene = scene.replace(token, "the village")
    for stray in ("a the village", "an the village", "the the village"):
        scene = scene.replace(stray, "the village")
    # objects_desc maps word -> visual description; abstract words (store
    # sections etc.) are described by their GOODS so the model never needs a
    # painted sign to depict them. The footer still teaches the actual word.
    desc = p.get("objects_desc") or {}
    objects = ", ".join(desc.get(w) or
                        (f"a {w.lower()}" if not w.lower().endswith("s") else w.lower())
                        for w in p["words"])
    if p.get("scene_extra"):
        scene += ". " + p["scene_extra"]
    # people clause: strict two-hero default, or a per-poster override for
    # pages that NEED extra figures (family, emotions, gestures ...). The
    # override references the on-model hero clause via a {heroes} placeholder.
    heroes_clause = (
        f"the {GENDER[h1]} {h1} and the {GENDER[h2]} {h2} from the remaining "
        "reference photos, kept perfectly on-model (same faces, hairstyles, "
        "skin tones and outfits as their reference photos)")
    if p.get("people_rule"):
        people = (p["people_rule"].replace("{heroes}", heroes_clause)
                  .replace("{h1}", h1).replace("{h2}", h2))
    else:
        people = (f"Exactly TWO children and no other people anywhere: "
                  f"{heroes_clause}, each appearing exactly once, actively "
                  "doing something natural in the scene.")
    return PROMPT.format(scene=scene, setting=p["setting"],
                         people=people, objects=objects, accent=p["accent"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--only", default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    SCENES.mkdir(exist_ok=True)
    posters = json.load(io.open(POSTERS, encoding="utf-8"))
    refs = json.load(io.open(REFS, encoding="utf-8")) if REFS.exists() else {}

    todo = [p for p in posters
            if p["words"] and p["status"] == "pending"
            and (args.only is None or p["basename"] == args.only)]
    if args.limit:
        todo = todo[:args.limit]
    print(f"{len(todo)} scene(s) to generate")

    for p in todo:
        prompt = build_prompt(p)
        if args.dry_run:
            print(f"\n=== {p['basename']} ===\n{prompt}")
            continue
        ref_ids = STYLE_REF_IDS + [hero_ref_id(h, refs) for h in p["heroes"]]
        cmd = ["generate", "create", "nano_banana_pro", "--prompt", prompt,
               "--resolution", "2k", "--aspect_ratio", "1:1"]
        for rid in ref_ids:
            cmd += ["--image-references", rid]
        job_id = run(cmd).splitlines()[-1].strip()
        print(f"{p['basename']}: job {job_id} ... ", end="", flush=True)
        url = run(["generate", "wait", job_id]).splitlines()[-1].strip()
        out = SCENES / (p["basename"].rsplit(".", 1)[0] + ".png")
        urllib.request.urlretrieve(url, out)
        p.update(status="generated", job_id=job_id, scene_url=url)
        io.open(POSTERS, "w", encoding="utf-8").write(
            json.dumps(posters, indent=2, ensure_ascii=False))
        print(f"saved {out.name}")

    print("done")


if __name__ == "__main__":
    main()
