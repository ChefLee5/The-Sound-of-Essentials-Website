#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Round 2 of Land 2 patches. Re-downloads the scenes whose first patch used a
bad colour sample, then redoes every fill using the modal (most common) colour
of a pinned clean region — no more single-pixel guesses."""
import io, json, urllib.request
from collections import Counter
from PIL import Image, ImageDraw

SP = r"C:\Users\ldmur\AppData\Local\Temp\claude\C--Users-ldmur--claude\ccb14fc2-40d8-431b-8da9-b1fc20741912\scratchpad"
SC = "scenes/"

posters = json.load(io.open("posters.json", encoding="utf-8"))
url = {p["basename"]: p.get("scene_url") for p in posters}

def redownload(base):
    u = url[base + ".jpg"]
    urllib.request.urlretrieve(u, SC + base + ".png")
    print("re-downloaded", base)

def modal(img, box):
    """Most common colour in box — robust against stray lines crossing it."""
    px = list(img.crop(box).getdata())
    return Counter(px).most_common(1)[0][0]

def crop(img, box, scale, name):
    w, h = box[2] - box[0], box[3] - box[1]
    img.crop(box).resize((int(w * scale), int(h * scale))).save(SP + "\\" + name)

# --- cooking: re-download, wipe "Recipe card" with true card cream ------------
redownload("land2_cooking-measurements")
im = Image.open(SC + "land2_cooking-measurements.png").convert("RGB")
d = ImageDraw.Draw(im)
cream = modal(im, (378, 1700, 420, 1745))          # clear card area left of cake
d.polygon([(125, 1770), (115, 1722), (358, 1662), (370, 1742)], fill=cream)
im.save(SC + "land2_cooking-measurements.png")
crop(im, (60, 1560, 480, 1820), 2, "w_recipe.png")

# --- measurement: re-download, wipe MILK with true band blue -------------------
redownload("land2_measurement-at-home")
im = Image.open(SC + "land2_measurement-at-home.png").convert("RGB")
d = ImageDraw.Draw(im)
blue = modal(im, (315, 1342, 370, 1352))           # band strip below letters
d.polygon([(304, 1346), (307, 1294), (384, 1287), (382, 1340)], fill=blue)
im.save(SC + "land2_measurement-at-home.png")
crop(im, (230, 1150, 430, 1420), 2, "w_milk.png")

# --- money: re-download, wipe CHEQUE (paper white) + BANK (card blue lerp) ----
redownload("land2_money-currency")
im = Image.open(SC + "land2_money-currency.png").convert("RGB")
d = ImageDraw.Draw(im)
white = modal(im, (1470, 1855, 1640, 1900))        # cheque paper between lines
d.polygon([(1310, 1908), (1316, 1856), (1446, 1840), (1444, 1892)], fill=white)
c_l = modal(im, (1610, 1620, 1624, 1636))          # card blue left of B
c_r = modal(im, (1716, 1600, 1730, 1616))          # card blue right of K
for x in range(1624, 1715):
    t = (x - 1624) / 90.0
    col = tuple(int(a + (b - a) * t) for a, b in zip(c_l, c_r))
    y0 = 1644 - (x - 1624) * 46 // 90 - 2          # follow card tilt
    d.line((x, y0 - 40, x, y0), fill=col)
im.save(SC + "land2_money-currency.png")
crop(im, (1250, 1540, 1760, 1960), 1.6, "w_money.png")

# --- logic: repaint the brown slab with true board green ----------------------
im = Image.open(SC + "land2_problem-solving-logic.png").convert("RGB")
d = ImageDraw.Draw(im)
green = modal(im, (540, 830, 600, 870))            # clear board below squiggles
d.rectangle((616, 782, 708, 836), fill=green)
im.save(SC + "land2_problem-solving-logic.png")
crop(im, (440, 680, 760, 900), 2.4, "w_logic.png")

# --- numbers: fix tags, button spill, cherry hook, egg tops -------------------
im = Image.open(SC + "land2_numbers-counting.png").convert("RGB")
d = ImageDraw.Draw(im)
tagcream = modal(im, (280, 855, 312, 875))         # tag1 clear interior
d.rectangle((256, 841, 278, 867), fill=tagcream)
d.rectangle((498, 822, 529, 846), fill=tagcream)
wood = modal(im, (230, 1720, 275, 1740))           # plank between buttons
d.ellipse((291, 1699, 356, 1743), fill=wood)
d.ellipse((354, 1676, 441, 1738), fill=wood)
floor = modal(im, (455, 1640, 500, 1665))
d.polygon([(350, 1690), (445, 1680), (445, 1672), (350, 1672)], fill=floor)
dark = (72, 48, 30)
d.line((348, 1691, 447, 1681), fill=dark, width=3)  # redraw plank back edge
cloth = modal(im, (1255, 1570, 1300, 1600))
d.rectangle((1203, 1538, 1232, 1567), fill=cloth)   # leftover stem hook
d.rectangle((1226, 1648, 1299, 1680), fill=cloth)   # smooth old shadow ghost
grey = modal(im, (1880, 840, 1940, 875))            # carton lid interior
d.rectangle((1948, 884, 2036, 920), fill=grey)
eggcream = modal(im, (1950, 940, 1985, 960))
outline = (58, 40, 32)
for bbox in ((1938, 918, 1992, 988), (1986, 922, 2038, 992)):
    d.pieslice(bbox, 180, 360, fill=eggcream)
    d.arc(bbox, 180, 360, fill=outline, width=5)
im.save(SC + "land2_numbers-counting.png")
crop(im, (210, 790, 560, 880), 3, "w_tags.png")
crop(im, (0, 1620, 480, 1800), 2, "w_buttons.png")
crop(im, (1100, 1480, 1330, 1720), 2, "w_cherry.png")
crop(im, (1660, 800, 2048, 990), 2, "w_eggs.png")
print("round 2 done")
