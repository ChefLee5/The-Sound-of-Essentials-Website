#!/usr/bin/env python3
"""Build SOE product images (2048x2048) from existing canon art. No image credits."""
import base64, os, subprocess, tempfile, sys
from pathlib import Path

HERE = Path(__file__).parent
PI   = HERE / "pi"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def b64(p):
    return base64.b64encode(Path(p).read_bytes()).decode()

def img(name):
    p = PI / name
    ext = "png" if p.suffix.lower() == ".png" else "jpeg"
    return f"data:image/{ext};base64,{b64(p)}"

FACES = "".join(
    f"@font-face{{font-family:'{fam}';src:url(data:font/ttf;base64,{b64(HERE/'fonts'/f)}) "
    f"format('truetype');font-display:block;}}"
    for fam, f in [("Fredoka", "Fredoka.ttf"), ("Inter", "Inter.ttf")]
    if (HERE / "fonts" / f).exists())

BASE = """
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:2048px;height:2048px}
body{font-family:'Inter',Segoe UI,Arial,sans-serif;background:#FFF8F0;
  position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:
  radial-gradient(120% 90% at 50% 0%,#FFFDF8 0%,#FDF2E2 52%,#F7E4CB 100%)}
.rule{position:absolute;left:0;right:0;top:0;height:14px;
  background:linear-gradient(90deg,#d4a843,#7fb685,#c4785a,#d4897a,#5ba4c9,#5fb685,#9678c4)}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;
  align-items:center;padding:104px 96px 78px}
.eyebrow{font-family:'Fredoka',sans-serif;font-weight:600;font-size:40px;letter-spacing:.20em;
  text-transform:uppercase;color:#C97A16}
h1{font-family:'Fredoka',sans-serif;font-weight:700;color:#1E3A5F;letter-spacing:-.022em;
  text-align:center;line-height:1.02;margin-top:22px}
.sub{font-size:48px;color:#5A4A3A;text-align:center;margin-top:26px;max-width:26ch;line-height:1.35}
.stage{flex:1;display:flex;align-items:center;justify-content:center;width:100%;position:relative}
.price{position:absolute;right:96px;top:96px;background:#FF6F00;color:#fff;border-radius:999px;
  font-family:'Fredoka',sans-serif;font-weight:700;font-size:74px;padding:26px 60px;
  box-shadow:0 16px 40px rgba(255,111,0,.32);z-index:5;white-space:nowrap}
.price small{font-size:34px;font-weight:600;opacity:.9}
.foot{font-family:'Fredoka',sans-serif;font-weight:600;font-size:40px;color:#8A7860;
  letter-spacing:.13em;text-transform:uppercase}
.card{border-radius:22px;box-shadow:0 34px 76px rgba(60,40,15,.30);border:10px solid #fff;
  background:#fff;object-fit:cover}
.pill{display:inline-flex;align-items:center;gap:16px;background:#fff;border:4px solid #F0E4D3;
  border-radius:999px;padding:20px 42px;font-size:40px;color:#2B2016;font-weight:600;
  box-shadow:0 10px 26px rgba(60,40,15,.10)}
.pills{display:flex;gap:26px;flex-wrap:wrap;justify-content:center;margin-top:8px}
.dot{width:26px;height:26px;border-radius:50%}
"""

def render(name, body_html, extra_css=""):
    html = (f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>{FACES}{BASE}{extra_css}"
            f"</style></head><body><div class='bg'></div><div class='rule'></div>{body_html}</body></html>")
    src = HERE / f"_pi_{name}.html"
    src.write_text(html, encoding="utf-8")
    out = HERE / f"product_{name}.png"
    prof = tempfile.mkdtemp(prefix="edge_pi_")
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-first-run",
                    f"--user-data-dir={prof}", "--window-size=2048,2048",
                    "--force-device-scale-factor=1", "--hide-scrollbars",
                    f"--screenshot={out}", src.resolve().as_uri()],
                   capture_output=True, timeout=240)
    ok = out.exists()
    print(f"  {'OK ' if ok else 'FAIL'} product_{name}.png"
          f"{'  %.2f MB' % (out.stat().st_size/1048576) if ok else ''}")
    return ok

# ---------------------------------------------------------------- Starter Pack
render("starter_pack", f"""
<div class='price'>$7</div>
<div class='wrap'>
  <div class='eyebrow'>Start the Quest</div>
  <h1 style='font-size:132px'>The Quest Starter Pack</h1>
  <div class='sub'>One week of the workbook, plus 38 vocabulary posters for the wall.</div>
  <div class='stage'>
    <img class='card' src='{img("p2.jpg")}' style='width:700px;height:850px;
      transform:rotate(-13deg) translate(-330px,34px);position:absolute;z-index:1'>
    <img class='card' src='{img("p3.jpg")}' style='width:700px;height:850px;
      transform:rotate(13deg) translate(330px,34px);position:absolute;z-index:2'>
    <img class='card' src='{img("p1.jpg")}' style='width:770px;height:940px;position:absolute;z-index:3'>
  </div>
  <div class='pills'>
    <span class='pill'><i class='dot' style='background:#d4a843'></i>50 activities</span>
    <span class='pill'><i class='dot' style='background:#7fb685'></i>38 posters</span>
    <span class='pill'>Ages 2&ndash;8</span>
  </div>
</div>""")

# ------------------------------------------------------------ Complete Quest Pack
render("quest_pack", f"""
<div class='price'>$49</div>
<div class='wrap'>
  <div class='eyebrow'>Everything for the whole Quest</div>
  <h1 style='font-size:126px'>The Complete Quest Pack</h1>
  <div class='sub'>The storybook, the workbook in digital and print, and the full album.</div>
  <div class='stage'>
    <img class='card' src='{img("rq.jpg")}' style='width:710px;height:950px;
      transform:rotate(-7deg) translate(-280px,-26px);position:absolute;z-index:2'>
    <img class='card' src='{img("wb.png")}' style='width:710px;height:950px;
      transform:rotate(7deg) translate(280px,-26px);position:absolute;z-index:1'>
    <div style='position:absolute;z-index:4;bottom:-24px;background:#fff;border:6px solid #F0E4D3;
      border-radius:999px;padding:22px 54px;font-family:Fredoka,sans-serif;font-weight:700;
      font-size:46px;color:#1E3A5F;box-shadow:0 16px 40px rgba(60,40,15,.20)'>
      19 tracks included, free forever</div>
  </div>
  <div class='pills'>
    <span class='pill'><i class='dot' style='background:#c4785a'></i>400 activities</span>
    <span class='pill'><i class='dot' style='background:#5ba4c9'></i>66 page storybook</span>
    <span class='pill' style='border-color:#FF6F00;color:#C4560A'>Worth $75</span>
  </div>
</div>""")

# ---------------------------------------------------------------- Rhythm Pass
render("rhythm_pass", f"""
<div class='price'>$14.99<small>/mo</small></div>
<div class='wrap'>
  <div class='eyebrow'>Membership</div>
  <h1 style='font-size:140px'>The Rhythm Pass</h1>
  <div class='sub'>A new printable pack every month. One Land at a time.</div>
  <div class='stage'>
    <div style='position:relative;line-height:0'>
      <img src='{img("harm.png")}' style='width:1610px;height:920px;object-fit:cover;
        border-radius:30px;border:12px solid #fff;box-shadow:0 34px 76px rgba(60,40,15,.30)'>
      <div style='position:absolute;left:46px;bottom:46px;display:flex;gap:18px;z-index:4;line-height:1'>
        <span class='pill' style='font-size:36px;padding:16px 34px'>Posters</span>
        <span class='pill' style='font-size:36px;padding:16px 34px'>Hero story</span>
        <span class='pill' style='font-size:36px;padding:16px 34px'>Featured track</span>
      </div>
    </div>
  </div>
  <div class='pills'>
    <span class='pill'><i class='dot' style='background:#9678c4'></i>Early access to Lil G</span>
    <span class='pill'>Cancel any time</span>
  </div>
</div>""")
