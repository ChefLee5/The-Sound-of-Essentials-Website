#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-shot pixel patches for Land 2 QA (text leaks + count fixes).
Each block samples the local background colour and fills a pinned polygon.
Verify crops go to the scratchpad for eyeball checks at native scale."""
from PIL import Image, ImageDraw

SP = r"C:\Users\ldmur\AppData\Local\Temp\claude\C--Users-ldmur--claude\ccb14fc2-40d8-431b-8da9-b1fc20741912\scratchpad"
SC = "scenes/"

def crop(img, box, scale, name):
    w = box[2] - box[0]; h = box[3] - box[1]
    img.crop(box).resize((int(w * scale), int(h * scale))).save(SP + "\\" + name)

# --- cooking-measurements: wipe "Recipe card" title -------------------------
im = Image.open(SC + "land2_cooking-measurements.png").convert("RGB")
d = ImageDraw.Draw(im)
cream = im.getpixel((105, 1710))
d.polygon([(118, 1755), (112, 1700), (348, 1652), (360, 1712)], fill=cream)
im.save(SC + "land2_cooking-measurements.png")
crop(im, (60, 1560, 480, 1820), 2, "v_recipe.png")

# --- measurement-at-home: wipe MILK ------------------------------------------
im = Image.open(SC + "land2_measurement-at-home.png").convert("RGB")
d = ImageDraw.Draw(im)
blue = im.getpixel((297, 1310))
d.polygon([(303, 1345), (306, 1297), (383, 1290), (381, 1338)], fill=blue)
im.save(SC + "land2_measurement-at-home.png")
crop(im, (230, 1150, 430, 1420), 2, "v_milk.png")

# --- money-currency: wipe CHEQUE + BANK --------------------------------------
im = Image.open(SC + "land2_money-currency.png").convert("RGB")
d = ImageDraw.Draw(im)
white = im.getpixel((1380, 1830))
d.polygon([(1312, 1905), (1318, 1860), (1442, 1843), (1440, 1888)], fill=white)
b1 = im.getpixel((1660, 1650)); b2 = im.getpixel((1700, 1610))
blue = tuple((a + b) // 2 for a, b in zip(b1, b2))
d.polygon([(1626, 1642), (1634, 1600), (1712, 1596), (1706, 1638)], fill=blue)
im.save(SC + "land2_money-currency.png")
crop(im, (1250, 1540, 1760, 1960), 1.6, "v_money.png")

# --- problem-solving-logic: wipe 800 ------------------------------------------
im = Image.open(SC + "land2_problem-solving-logic.png").convert("RGB")
d = ImageDraw.Draw(im)
green = im.getpixel((712, 800))
d.rectangle((618, 784, 706, 834), fill=green)
im.save(SC + "land2_problem-solving-logic.png")
crop(im, (440, 680, 760, 900), 2.4, "v_logic.png")

# --- numbers-counting: tags digits, 2 buttons, 1 cherry, 2 eggs ---------------
im = Image.open(SC + "land2_numbers-counting.png").convert("RGB")
d = ImageDraw.Draw(im)
tagcream = im.getpixel((247, 850))
d.rectangle((256, 841, 278, 867), fill=tagcream)         # tag1 "2"
d.rectangle((498, 822, 529, 846), fill=tagcream)         # tag2 "22"
wood1 = im.getpixel((352, 1722)); wood2 = im.getpixel((443, 1712))
d.ellipse((291, 1699, 356, 1743), fill=wood1)            # purple button
d.ellipse((354, 1676, 441, 1738), fill=wood2)            # blue button
d.line((295, 1721, 438, 1703), fill=tuple(max(0, c - 18) for c in wood1), width=2)
cloth = im.getpixel((1290, 1630))
d.ellipse((1222, 1600, 1290, 1670), fill=cloth)          # cherry fruit
d.rectangle((1228, 1650, 1297, 1678), fill=cloth)        # its shadow
d.line((1218, 1549, 1252, 1608), fill=cloth, width=10)   # its stem
grey = im.getpixel((1960, 870))
d.rectangle((1948, 884, 2036, 922), fill=grey)           # 2 back-row eggs
d.polygon([(1978, 920), (2002, 920), (1992, 944)], fill=grey)  # gap dab
im.save(SC + "land2_numbers-counting.png")
crop(im, (210, 790, 560, 880), 3, "v_tags.png")
crop(im, (0, 1620, 480, 1800), 2, "v_buttons.png")
crop(im, (1100, 1480, 1330, 1720), 2, "v_cherry.png")
crop(im, (1660, 800, 2048, 990), 2, "v_eggs.png")
print("patched 5 scenes")
