#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Probe exact colours before round 4: carton-lid grey, egg cream, and the
real pink of the tablecloth stripe (scan for pinkish runs instead of guessing
a box)."""
from collections import Counter
from PIL import Image

SP = r"C:\Users\ldmur\AppData\Local\Temp\claude\C--Users-ldmur--claude\ccb14fc2-40d8-431b-8da9-b1fc20741912\scratchpad"
SC = "scenes/"

def modal(img, box, tag):
    px = list(img.crop(box).getdata())
    c = Counter(px).most_common(1)[0][0]
    print(tag, c, "luma", int(0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]))
    return c

im = Image.open(SC + "land2_numbers-counting.png").convert("RGB")

# candidate carton-lid greys (left of the botched rect) and egg creams
modal(im, (1760, 840, 1820, 868), "lid-A")
modal(im, (1850, 845, 1900, 868), "lid-B")
modal(im, (1900, 888, 1938, 912), "lid-C-nearpatch")
modal(im, (1800, 930, 1840, 958), "egg-A")
modal(im, (1740, 922, 1780, 950), "egg-B")

# stripe: scan rows above and below the wiped gap for pinkish pixels (R-G big)
for y in (1610, 1618, 1695, 1700, 1710):
    runs = []
    start = None
    for x in range(1240, 1340):
        r, g, b = im.getpixel((x, y))
        pinkish = (r - g) > 18 and r > 150
        if pinkish and start is None:
            start = x
        if not pinkish and start is not None:
            runs.append((start, x - 1))
            start = None
    if start is not None:
        runs.append((start, 1339))
    samples = [im.getpixel(((a + b) // 2, y)) for a, b in runs]
    print("row", y, "pink runs", runs, samples)

# zoomed grid-free crops for eyeballing
def crop(img, box, scale, name):
    w, h = box[2] - box[0], box[3] - box[1]
    img.crop(box).resize((int(w * scale), int(h * scale))).save(SP + "\\" + name)

crop(im, (1900, 850, 2048, 1010), 4, "p_eggcorner.png")
crop(im, (1240, 1590, 1340, 1740), 5, "p_stripe.png")
print("probe done")
