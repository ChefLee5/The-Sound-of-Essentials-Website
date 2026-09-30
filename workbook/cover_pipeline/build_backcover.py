#!/usr/bin/env python3
"""Summer Stretch back cover -- 2550x3300 (8.5x11in @ 300dpi).

Renders with Edge --screenshot, NOT --print-to-pdf: verified 2026-07-30 that
Edge's print pipeline ignores @font-face entirely while the screenshot path
honours it. That is why the fonts are embedded here and still come out as
Fredoka and Inter.

ART: owner-supplied `back_cover_SS.png` -- Seriphia walking the golden path with
the Seven Lands on the horizon. Purpose-drawn for this cover.

prepare_plate() does three things the raw art needs:
  1. crops away the art's OWN gold frame so it doesn't fight the page frame
  2. upscales 1024 -> 2550 wide
  3. extends the sky upward, since a square cannot be cropped into a portrait

NOTE ON RESOLUTION: the source is 1024px, about 120dpi across 8.5in. Upscaled it
is nominally 300dpi but the detail is not really there. Fine on screen and for
Shopify; regenerate the art larger before a real print run.
"""
import base64, io, subprocess, tempfile
from datetime import datetime
from pathlib import Path
import numpy as np
from PIL import Image

HERE = Path(__file__).parent
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
SRC  = Path(r"C:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\back_cover_SS.png")
W, H = 2550, 3300
# Timestamped: reading a preview at a filename already opened this session returns the
# PREVIOUS render (logged 2026-07-30 and again 2026-08-03). Never reuse a filename.
OUT  = HERE / f"backcover_2550_{datetime.now():%Y%m%d-%H%M%S}.png"


def prepare_plate():
    im = Image.open(SRC).convert("RGB")
    w0 = im.width
    inset = int(w0 * 0.055)                       # inside the art's own gold frame
    im = im.crop((inset, inset, w0 - inset, w0 - inset))
    im = im.resize((W, int(im.height * W / im.width)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    need = H - im.height
    if need <= 0:
        return im
    # sample CLEAN sky from the left and right edges only -- the rainbow reaches
    # the top edge in the centre and would smear upward if averaged in.
    edge = np.concatenate([a[:30, :int(W * .18)], a[:30, int(W * .82):]], axis=1)
    sky = np.repeat(np.clip(
        edge.reshape(-1, 3).mean(axis=0)[None, None, :]
        * np.linspace(1.05, 1.0, need)[:, None, None], 0, 255), W, axis=1)
    blend = 220                                   # ease into the real artwork
    t = np.linspace(0, 1, blend)[:, None, None]
    sky[-blend:] = sky[-blend:] * (1 - t) + a[:blend] * t
    return Image.fromarray(np.concatenate([sky, a], axis=0).astype(np.uint8))


def b64_bytes(b):
    return base64.b64encode(b).decode()


def plate_b64():
    buf = io.BytesIO()
    prepare_plate().save(buf, "JPEG", quality=93, optimize=True)
    return b64_bytes(buf.getvalue())


FONTS = [("Fredoka", "Fredoka.ttf"), ("Inter", "Inter.ttf")]

# Fail loud. This used to `if ... .exists()` and silently skip, which meant a missing
# fonts/ dir rendered the whole cover in Arial and still exited 0. Recovered 2026-08-16
# by extracting the base64 faces back out of a previously rendered backcover.html.
_missing = [f for _, f in FONTS if not (HERE / "fonts" / f).exists()]
if _missing:
    raise SystemExit(
        f"MISSING FONTS: {', '.join(_missing)} in {HERE/'fonts'}\n"
        "Refusing to render -- output would silently fall back to Arial.\n"
        "Recover them from any prior backcover.html (the faces are embedded base64).")

FACES = "".join(
    f"@font-face{{font-family:'{fam}';src:url(data:font/ttf;base64,"
    f"{b64_bytes((HERE/'fonts'/f).read_bytes())}) format('truetype');font-display:block;}}"
    for fam, f in FONTS)

BULLETS = [
    "<b>400 activities across 8 weeks</b>, ten blocks a day",
    "Language and vocabulary, phonics and sight words",
    "Math and logic, counting, patterns, early geometry",
    "Science and nature, movement and health",
    "Geography and civics",
    "Handwriting and cursive practice pages",
    "Rhythm and sound, built on the free 19 track album",
    "Hero Quest moments rotating all 15 heroes",
    "Daily reflection, with a Quest Map and Quest Stars",
    'Caregiver guide with "Serve and Return" prompts',
]

HTML = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
{FACES}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{W}px;height:{H}px}}
body{{position:relative;overflow:hidden;font-family:'Inter',Segoe UI,Arial,sans-serif}}
.art{{position:absolute;inset:0;background:url(data:image/jpeg;base64,{plate_b64()})
  no-repeat center/cover}}
.frame{{position:absolute;inset:56px;border:9px solid #D4A843;border-radius:12px;
  box-shadow:0 0 0 5px rgba(255,255,255,.5) inset;pointer-events:none}}
.card{{position:absolute;left:150px;right:150px;top:150px;
  background:rgba(255,248,240,.94);border-radius:26px;padding:86px 92px 78px;
  box-shadow:0 26px 70px rgba(40,60,30,.26)}}
h1{{font-family:'Fredoka',sans-serif;font-weight:700;font-size:128px;line-height:1.03;
  color:#1E3A5F;letter-spacing:-.022em;max-width:20ch}}
.body{{margin-top:34px;font-size:48px;line-height:1.44;color:#2B2016;max-width:44ch}}
.body em{{font-style:italic;font-weight:600}}
h2{{font-family:'Fredoka',sans-serif;font-weight:600;font-size:66px;color:#C97A16;
  margin:46px 0 24px}}
ul{{list-style:none;display:flex;flex-direction:column;gap:13px}}
li{{position:relative;padding-left:62px;font-size:41px;line-height:1.28;color:#2B2016}}
li::before{{content:"";position:absolute;left:0;top:5px;width:36px;height:36px;
  border-radius:8px;background:#4CAF50}}
li::after{{content:"";position:absolute;left:10px;top:16px;width:16px;height:8px;
  border-left:5px solid #fff;border-bottom:5px solid #fff;transform:rotate(-45deg)}}
li b{{font-weight:700}}
.lower{{position:absolute;left:150px;right:150px;bottom:300px;
  display:flex;flex-direction:column;gap:56px}}
.tag{{font-family:'Fredoka',sans-serif;font-weight:600;font-size:68px;color:#fff;
  text-align:center;text-shadow:0 5px 20px rgba(30,50,25,.85),0 0 54px rgba(30,50,25,.7)}}
.row{{display:flex;align-items:flex-end;justify-content:space-between;gap:60px}}
/* height pinned to 186px to stay flush with the ISBN box in .row (align-items:flex-end).
   The old two-line badge hit 186 by padding arithmetic; single-line centres instead. */
.badge{{background:#F5C43A;border:7px solid #fff;border-radius:32px;padding:0 72px;
  height:186px;display:flex;align-items:center;justify-content:center;
  box-shadow:0 14px 38px rgba(0,0,0,.32)}}
.badge .a{{font-family:'Fredoka',sans-serif;font-weight:700;font-size:96px;color:#2B2016;
  line-height:1}}
.isbn{{width:480px;height:186px;border:5px dashed #fff;border-radius:12px;display:flex;
  align-items:center;justify-content:center;text-align:center;font-size:29px;color:#4A3A22;
  background:rgba(255,255,255,.9);line-height:1.35;padding:14px;font-weight:600}}
.foot{{position:absolute;left:65px;right:65px;bottom:65px;height:180px;background:#E8B33C;
  border-radius:0 0 6px 6px;display:flex;align-items:center;justify-content:space-between;
  padding:0 96px}}
.foot .d{{font-family:'Fredoka',sans-serif;font-weight:600;font-size:57px;color:#fff}}
.foot .p{{font-size:31px;letter-spacing:.15em;color:#7A5C10;font-weight:600}}
</style></head><body>
<div class="art"></div>
<div class="card">
  <h1>Summer, without falling behind.</h1>
  <p class="body">The Summer Stretch Workbook is your family's screen-free
  <em>"Analog Anchor."</em> It is research informed, and built to keep young minds sharp
  between school years. Seriphia guides your child through the 7 Lands of the Rhythm Quest,
  stretching literacy, numeracy, science and emotional growth, all through play.</p>
  <h2>What's Inside</h2>
  <ul>{"".join(f"<li>{b}</li>" for b in BULLETS)}</ul>
</div>
<div class="lower">
  <div class="tag">Staying on the path. Always learning.</div>
  <div class="row">
    <div class="isbn">ISBN barcode<br>to be placed before print</div>
    <div class="badge"><div class="a">Ages 2&ndash;7</div></div>
  </div>
</div>
<div class="foot"><div class="d">soelearn.com</div>
  <div class="p">A SOUND OF ESSENTIALS PRODUCTION</div></div>
<div class="frame"></div>
</body></html>"""

src = HERE / "backcover.html"
src.write_text(HTML, encoding="utf-8")
prof = tempfile.mkdtemp(prefix="edge_bc_")
subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-first-run",
                f"--user-data-dir={prof}", f"--window-size={W},{H}",
                "--force-device-scale-factor=1", "--hide-scrollbars",
                f"--screenshot={OUT}", src.resolve().as_uri()],
               capture_output=True, timeout=300)
if OUT.exists():
    im = Image.open(OUT)
    print(f"out: {OUT.name}  {im.size}  {OUT.stat().st_size/1048576:.2f} MB")
else:
    print("FAILED")
