#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compose final posters: scene + title banner + numbered markers + footer legend.

Layout (owner notes 2026-07-09):
- The illustration carries small numbered circle markers ONLY (no word text).
- Numbers run in sequential READING ORDER (top-to-bottom bands, left-to-right).
- The words are listed in a cream footer legend keyed to the marker numbers.
- Each word marks exactly ONE object instance - never label duplicates.

Reads posters.json records with status "anchored" (anchors: word -> [x, y]
normalized 0-1 on the scene), writes final JPGs (square, 2048px) to
../OEBPS/images/dictionary/<basename> by default.

Usage:  py compose.py [--only <basename>] [--out-dir preview]
"""
import argparse
import io
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE = Path(__file__).resolve().parent
POSTERS = BASE / "posters.json"
SCENES = BASE / "scenes"
LIVE_OUT = BASE.parent / "OEBPS" / "images" / "dictionary"

SIZE = 2048
CREAM = (250, 240, 218, 244)
CREAM_SOLID = (250, 240, 218)
BROWN = (92, 62, 32, 255)
BORDER = (183, 158, 118, 255)
NUM_ORANGE = (196, 112, 36, 255)

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\comicbd.ttf",
    r"C:\Windows\Fonts\seguisb.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
]


def load_font(px):
    for cand in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(cand, px)
        except OSError:
            continue
    return ImageFont.load_default()


def text_size(draw, text, font):
    l, t, r, b = draw.textbbox((0, 0), text, font=font)
    return r - l, b - t


def reading_order(words, anchors, bands=6):
    """Sequential numbering: sort into horizontal bands top->bottom, then
    left->right inside each band, so numbers flow like reading a page."""
    def key(w):
        x, y = anchors[w]
        return (int(y * bands), x)
    return sorted(words, key=key)


def footer_metrics(n_words, draw, font, width, pad_x, col_gap, line_gap):
    cols = 3 if n_words > 8 else 2
    rows = -(-n_words // cols)
    line_h = text_size(draw, "Ag", font)[1] + line_gap
    height = rows * line_h + 70
    return cols, rows, line_h, height


def compose(p, out_dir, jpg_quality=90):
    scene_path = SCENES / (p["basename"].rsplit(".", 1)[0] + ".png")
    scene = Image.open(scene_path).convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)

    words = reading_order(p["words"], p["anchors"])

    # footer is APPENDED below the untouched square scene (never covers art)
    ffont = load_font(46)
    pad_x, col_gap, line_gap = 60, 40, 18
    probe = ImageDraw.Draw(scene)
    cols, rows, line_h, f_height = footer_metrics(len(words), probe, ffont,
                                                  SIZE, pad_x, col_gap, line_gap)
    H = SIZE + f_height
    canvas = Image.new("RGB", (SIZE, H), CREAM_SOLID)
    canvas.paste(scene, (0, 0))
    overlay = Image.new("RGBA", (SIZE, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.line((0, SIZE, SIZE, SIZE), fill=BORDER, width=6)

    # --- footer legend ---
    col_w = (SIZE - 2 * pad_x - (cols - 1) * col_gap) / cols
    for i, w in enumerate(words):
        c, r = divmod(i, rows)
        x = pad_x + c * (col_w + col_gap)
        y = SIZE + 40 + r * line_h
        num = f"{i + 1}."
        nw, _ = text_size(draw, num, ffont)
        draw.text((x, y), num, font=ffont, fill=NUM_ORANGE)
        draw.text((x + nw + 14, y), w, font=ffont, fill=BROWN)

    # --- title banner ---
    title = p["title"]
    tfont = load_font(104)
    tw, th = text_size(draw, title, tfont)
    pad_tx, pad_ty = 64, 26
    bx0 = (SIZE - (tw + 2 * pad_tx)) / 2
    banner = (bx0, 36, bx0 + tw + 2 * pad_tx, 36 + th + 2 * pad_ty)
    draw.rounded_rectangle(banner, radius=40, fill=CREAM, outline=BORDER, width=5)
    draw.text(((SIZE - tw) / 2, 36 + pad_ty - 6), title, font=tfont, fill=BROWN)

    # --- numbered circle markers, exactly on their anchors ---
    # translucent so they sit ON the art without eating it (owner note)
    M_FILL = (250, 240, 218, 132)
    M_EDGE = (183, 158, 118, 170)
    M_NUM = (140, 74, 18, 235)
    mfont = load_font(48)
    placed = []
    R = 44
    for i, w in enumerate(words):
        ax = p["anchors"][w][0] * SIZE
        ay = p["anchors"][w][1] * SIZE
        ax = min(max(ax, R + 12), SIZE - R - 12)
        ay = min(max(ay, R + 12), SIZE - R - 12)
        if banner[0] - R < ax < banner[2] + R and ay < banner[3] + R:
            ay = banner[3] + R + 6            # slide out from under the banner
        for _ in range(24):                    # nudge off other markers
            clash = next((q for q in placed
                          if (q[0] - ax) ** 2 + (q[1] - ay) ** 2 < (2 * R + 10) ** 2), None)
            if clash is None:
                break
            ay = ay - (2 * R + 12) if ay - (2 * R + 12) > R + 12 else ay + (2 * R + 12)
            if (clash[0] - ax) ** 2 + (clash[1] - ay) ** 2 < (2 * R + 10) ** 2:
                ax = min(max(ax + (2 * R + 12), R + 12), SIZE - R - 12)
        placed.append((ax, ay))
        draw.ellipse((ax - R, ay - R, ax + R, ay + R), fill=M_FILL,
                     outline=M_EDGE, width=4)
        num = str(i + 1)
        nw, nh = text_size(draw, num, mfont)
        draw.text((ax - nw / 2, ay - nh / 2 - 5), num, font=mfont, fill=M_NUM)

    final = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / p["basename"]
    final.save(out, "JPEG", quality=jpg_quality)
    p["ordered_words"] = words
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default=None)
    ap.add_argument("--out-dir", default=None)
    args = ap.parse_args()

    out_dir = (BASE / args.out_dir) if args.out_dir else LIVE_OUT
    posters = json.load(io.open(POSTERS, encoding="utf-8"))
    todo = [p for p in posters if p["status"] == "anchored" and p["anchors"]
            and (args.only is None or p["basename"] == args.only)]
    print(f"{len(todo)} poster(s) to compose -> {out_dir}")

    for p in todo:
        missing = [w for w in p["words"] if w not in p["anchors"]]
        if missing:
            print(f"  SKIP {p['basename']}: missing anchors for {missing}")
            continue
        out = compose(p, out_dir)
        p["status"] = "composed"
        print(f"  {out.name}")

    io.open(POSTERS, "w", encoding="utf-8").write(
        json.dumps(posters, indent=2, ensure_ascii=False))
    print("done")


if __name__ == "__main__":
    main()
