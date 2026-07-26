#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Round 4a: repair the numbers-counting egg corner + cloth stripe using
probed colours, and re-download a pristine money-currency for a clean
inside-the-object wipe (probe crops only this pass, no edits)."""
import io, json, urllib.request
from collections import Counter
from PIL import Image, ImageDraw

SP = r"C:\Users\ldmur\AppData\Local\Temp\claude\C--Users-ldmur--claude\ccb14fc2-40d8-431b-8da9-b1fc20741912\scratchpad"
SC = "scenes/"

def modal(img, box, tag):
    px = list(img.crop(box).getdata())
    c = Counter(px).most_common(1)[0][0]
    print(tag, c)
    return c

def crop(img, box, scale, name):
    w, h = box[2] - box[0], box[3] - box[1]
    img.crop(box).resize((int(w * scale), int(h * scale))).save(SP + "\\" + name)

# ---------------- numbers-counting: egg corner + stripe ----------------
im = Image.open(SC + "land2_numbers-counting.png").convert("RGB")
d = ImageDraw.Draw(im)

# 1. lid refill with the colour of the clean band directly above the patch
lid = modal(im, (1946, 858, 2040, 882), "lid")
d.rectangle((1946, 884, 2048, 922), fill=lid)
d.rectangle((2028, 902, 2040, 950), fill=lid)      # terracotta remnant

# 2. egg domes in true egg white from the intact back-row egg
eggwhite = modal(im, (1907, 900, 1922, 915), "eggwhite")
if 0.3 * eggwhite[0] + 0.59 * eggwhite[1] + 0.11 * eggwhite[2] < 200:
    print("eggwhite sample too dark, using fallback")
    eggwhite = (238, 231, 219)
for bbox in ((1938, 918, 1992, 988), (1986, 922, 2044, 992)):
    d.pieslice(bbox, 180, 360, fill=eggwhite)
    d.arc(bbox, 180, 360, fill=(78, 54, 40), width=5)

# 3. cloth artifacts: pale strip + dab repainted with local cloth colours
d.rectangle((1279, 1626, 1291, 1684), fill=(251, 229, 192))
dab = modal(im, (1244, 1596, 1262, 1616), "dab-cloth")
d.rectangle((1224, 1595, 1240, 1618), fill=dab)

# 4. bridge the severed pink double-stripe by stamping an intact slice
def stripe_center(x, y0, y1):
    ys = [y for y in range(y0, y1)
          if (lambda p: p[0] - p[1] > 40 and p[0] > 170)(im.getpixel((x, y)))]
    return (sum(ys) / len(ys), min(ys), max(ys)) if ys else None

right = stripe_center(1312, 1620, 1700)
left = stripe_center(1250, 1660, 1730)
print("stripe right", right, "left", left)
if right and left:
    cy_r, cy_l = right[0], left[0]
    src = [im.getpixel((1312, int(cy_r) + k)) for k in range(-16, 17)]
    for x in range(1272, 1307):
        cy = cy_r + (cy_l - cy_r) * (1312 - x) / 62.0
        for k in range(-16, 17):
            im.putpixel((x, int(round(cy)) + k), src[k + 16])
else:
    print("stripe scan failed - skipped bridge")

im.save(SC + "land2_numbers-counting.png")
crop(im, (1660, 800, 2048, 1010), 2, "y_eggs.png")
crop(im, (1200, 1560, 1340, 1740), 3, "y_stripe.png")

# ---------------- money-currency: pristine re-download + probes --------
posters = json.load(io.open("posters.json", encoding="utf-8"))
url = {p["basename"]: p.get("scene_url") for p in posters}
u = url["land2_money-currency.jpg"]
urllib.request.urlretrieve(u, SC + "land2_money-currency.png")
print("re-downloaded money-currency")
im = Image.open(SC + "land2_money-currency.png").convert("RGB")
crop(im, (1560, 1560, 1770, 1720), 4, "m_card.png")
crop(im, (1250, 1810, 1480, 1970), 4, "m_chq.png")
print("round 4a done")
