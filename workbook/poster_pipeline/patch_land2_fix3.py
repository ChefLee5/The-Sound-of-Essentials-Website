#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Round 3: reconstruct the money-card / cheque edges, fix the button-strip
floor color, soften the egg arcs, remove the dangling cherry stem."""
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

# ---------------- money-currency ----------------
im = Image.open(SC + "land2_money-currency.png").convert("RGB")
d = ImageDraw.Draw(im)

# card: table above edge, edge line, card band over letters
table = modal(im, (1585, 1565, 1615, 1600), "card-table")
d.polygon([(1618, 1558), (1720, 1558), (1720, 1596), (1618, 1620)], fill=table)
blue_l = modal(im, (1590, 1640, 1615, 1660), "card-blue-L")
blue_r = modal(im, (1712, 1608, 1740, 1635), "card-blue-R")
for x in range(1582, 1715):
    t = (x - 1582) / 133.0
    col = tuple(int(a + (b - a) * t) for a, b in zip(blue_l, blue_r))
    edge = 1626 - 0.214 * (x - 1580)
    d.line((x, edge + 2, x, edge + 55), fill=col)
dark = modal(im, (1585, 1621, 1600, 1630), "card-edge-dark")
d.line((1578, 1627, 1716, 1597), fill=dark, width=7)

# cheque: table above paper edge, edge line, paper below
ctable = modal(im, (1340, 1816, 1425, 1834), "chq-table")
d.polygon([(1314, 1886), (1448, 1839), (1448, 1834), (1314, 1850)], fill=ctable)
paper = modal(im, (1330, 1895, 1420, 1925), "chq-paper")
d.polygon([(1316, 1889), (1448, 1841), (1448, 1894), (1312, 1910)], fill=paper)
cdark = modal(im, (1283, 1893, 1300, 1903), "chq-edge-dark")
d.line((1279, 1899, 1448, 1837), fill=cdark, width=5)
im.save(SC + "land2_money-currency.png")
crop(im, (1560, 1540, 1780, 1700), 4, "x_bank.png")
crop(im, (1260, 1800, 1480, 1950), 4, "x_chq.png")

# ---------------- numbers-counting ----------------
im = Image.open(SC + "land2_numbers-counting.png").convert("RGB")
d = ImageDraw.Draw(im)

floor = modal(im, (300, 1645, 420, 1665), "floor-grey")
d.polygon([(348, 1668), (447, 1668), (447, 1682), (348, 1692)], fill=floor)
d.line((348, 1691, 447, 1681), fill=(72, 48, 30), width=3)

for bbox in ((1938, 918, 1992, 988), (1986, 922, 2038, 992)):
    d.arc(bbox, 180, 360, fill=(112, 78, 56), width=8)

cloth = modal(im, (1250, 1560, 1290, 1595), "cloth")
d.rectangle((1202, 1543, 1238, 1595), fill=cloth)
d.rectangle((1224, 1595, 1240, 1618), fill=cloth)
pink = modal(im, (1279, 1695, 1291, 1712), "stripe-pink")
d.rectangle((1279, 1626, 1291, 1684), fill=pink)
im.save(SC + "land2_numbers-counting.png")
crop(im, (0, 1620, 480, 1800), 2, "x_buttons.png")
crop(im, (1660, 800, 2048, 990), 2, "x_eggs.png")
crop(im, (1100, 1480, 1330, 1720), 2, "x_cherry.png")
print("round 3 done")
