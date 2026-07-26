#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Round 4b: wipe BANK + CHEQUE from the pristine money-currency scene with
letter-pixel masks healed from vertical neighbours — no geometry guessing,
the dark card rim and paper border are never touched."""
from PIL import Image

SP = r"C:\Users\ldmur\AppData\Local\Temp\claude\C--Users-ldmur--claude\ccb14fc2-40d8-431b-8da9-b1fc20741912\scratchpad"
SC = "scenes/"

im = Image.open(SC + "land2_money-currency.png").convert("RGB")
px = im.load()

def luma(p):
    return 0.3 * p[0] + 0.59 * p[1] + 0.11 * p[2]

def dilate(mask, r):
    out = set()
    for (x, y) in mask:
        for dx in range(-r, r + 1):
            for dy in range(-r, r + 1):
                out.add((x + dx, y + dy))
    return out

def heal(mask, ok):
    """Replace masked pixels with nearest unmasked vertical neighbour passing ok()."""
    holes = 0
    for (x, y) in sorted(mask):
        for step in range(1, 60):
            for yy in (y - step, y + step):
                if (x, yy) not in mask and ok(px[x, yy]):
                    px[x, y] = px[x, yy]
                    break
            else:
                continue
            break
        else:
            holes += 1
    print("unhealed", holes)

# ---- BANK: white letters on blue card -------------------------------------
mask = {(x, y) for x in range(1600, 1740) for y in range(1585, 1665)
        if px[x, y][0] > 195 and px[x, y][1] > 195 and px[x, y][2] > 195}
print("BANK letter px", len(mask))
mask = dilate(mask, 3)
heal(mask, lambda p: p[2] >= p[0] and 60 < luma(p) < 205)

# ---- CHEQUE: dark letters in a tilted band on cream paper ------------------
def in_band(x, y):
    cy = 1902 - 0.343 * (x - 1327)          # word centre line
    return abs(y - cy) < 21
mask = {(x, y) for x in range(1318, 1445) for y in range(1840, 1930)
        if luma(px[x, y]) < 110 and in_band(x, y)}
print("CHEQUE letter px", len(mask))
mask = dilate(mask, 3)
heal(mask, lambda p: luma(p) > 150)

im.save(SC + "land2_money-currency.png")

def crop(img, box, scale, name):
    w, h = box[2] - box[0], box[3] - box[1]
    img.crop(box).resize((int(w * scale), int(h * scale))).save(SP + "\\" + name)

crop(im, (1560, 1560, 1770, 1720), 4, "z_card.png")
crop(im, (1250, 1810, 1480, 1970), 4, "z_chq.png")
print("round 4b done")
