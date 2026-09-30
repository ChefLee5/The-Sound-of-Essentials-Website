# Cover pipeline — Summer Stretch back cover

`backcover.html` renders the corrected back cover at **2550x3300** (8.5x11in @ 300dpi).
Fonts and the Seriphia plate are embedded as data URIs, so it is fully self-contained.

## Render

    msedge --headless=new --disable-gpu --hide-scrollbars ^
      --window-size=2550,3300 --force-device-scale-factor=1 ^
      --screenshot=backcover.png file:///<abs-path>/backcover.html

NOTE: use `--screenshot`, NOT `--print-to-pdf`. Verified 2026-07-30: Edge's
print pipeline ignores @font-face entirely, but the screenshot path honours it.
That is why this file embeds fonts and still renders in brand type.

## What was wrong with the old draft back cover
1. "100+ activity pages across 7 learning domains" -- actually 400 activities, ten blocks/day
2. "soundofessentials.com" -- not a real SOE domain; canon is soelearn.com
3. Placeholder ISBN 978-0-0000-0000-0 printed as if real
4. "PRE-K THROUGH 2ND GRADE" -- canon is Pre-K through Grade 3
5. Rhetorical-question headline -- banned by brand voice
6. Two em dashes -- banned by brand voice
7. "research-backed" -- canon language is "research informed"
8. "7 learning domains" conflates the 5 Core Domains with the 7 Lands
9. Footer domain did not match the SOELearn.com watermark policy

Art: `plate-seriphia-terrasol.png`, an existing canon render. No new image
credits were spent -- those stay reserved for Lands 3-7 posters.

## Art change, 2026-07-30
The first pass used a Seriphia plate, but she already carries the FRONT cover, so
the back repeated her. Swapped to `poster_pipeline/scenes/land1_the-playground-recess.png`:
children playing outdoors, screen-free, with the brand's music notes in the sky.
It sells the promise ("Analog Anchor") instead of repeating the mascot.

`build_backcover.py` is now the build. Two knobs:
  SCENE  -- any 2048x2048 plate from workbook/poster_pipeline/scenes/ (41 available)
  FOCUS  -- 0..1 vertical crop of the art band. 0.50 keeps whole figures;
            0.60 clipped faces at the bottom edge.

    python build_backcover.py      # -> backcover_2550.png

## Final art, 2026-08-03
Owner supplied `back_cover_SS.png`, drawn for this cover: Seriphia walking the
golden path with the Seven Lands on the horizon. Now the art of record.
(The playground scene from 2026-07-30 was an interim pick and is retired.)

`prepare_plate()` in build_backcover.py handles three things the raw art needs:
  1. crops away the art's OWN gold frame so it does not fight the page frame
  2. upscales 1024 -> 2550 wide
  3. extends the sky UPWARD -- a square cannot be cropped into a portrait, and
     the grass at the bottom would streak if stretched. Sky is sampled from the
     left/right edges only, because the rainbow reaches the top edge in the
     centre and smears if averaged in.

## Age badge, 2026-08-16
Badge was `Ages 2-8` / `PRE-K THROUGH GRADE 3`. Canon narrowed to **ages 2-7** on
2026-08-07 and the same change **retires the "Pre-K-Grade 3 / K-3 (~4-9)" framing
outright** (see brand-voice-and-positioning). So both badge lines were stale, not
just the age. Now a single centred line: **`Ages 2-7`**.

Note this reverses README defect #4 above, which was fixed under the older 2-8
canon. #4 is kept as an accurate record of what was true then -- do not "re-fix" it.

Layout: the old badge hit 186px tall by padding arithmetic (14 border + 56 padding
+ 74 age + 10 margin + 32 grade) and that 186 is deliberate -- it matches the ISBN
box so `.row`'s `align-items:flex-end` renders them as a flush pair. Dropping a line
would have shrunk it, so the badge now pins `height:186px` and flex-centres a 96px
line. Verified: badge bottom y=2992, ISBN bottom y=2999 in BOTH renders.

## !! FONTS ARE NOT VENDORED -- recovered 2026-08-16
`fonts/` was **missing entirely** from this folder. `FACES` used to skip absent
fonts with `if ... .exists()`, so a render would silently fall back to Arial and
still exit 0. Recovered by extracting the embedded base64 faces back out of the
previously rendered `backcover.html` (Fredoka 155 KB, Inter 856 KB).

`build_backcover.py` now **raises SystemExit** if either font is missing. If you
ever see that error, pull the faces from any prior `backcover.html`.

Output is also timestamped now (`backcover_2550_<stamp>.png`) -- the stale-preview
trap logged on 2026-07-30 and 2026-08-03 is a filename-reuse problem.

### !! RESOLUTION WARNING
The source is 1024x1024 -- about 120 dpi across 8.5in. Upscaled 2.8x it is
nominally 300 dpi but that detail is interpolated, not real. Fine on screen and
for Shopify listings. Regenerate the art at 2550px or larger before a print run.
