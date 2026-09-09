"""
batch_assemble_recipe.py
SOE Rhythm Quest - ECE Viral Social Video Batch Assembler
Automates the creation of 9:16 (1080x1920) vertical short-form videos for
The Sound of Essentials: Rhythm Quest, combining:
  1. 0:00-0:04.5 - Visual Hook Card (Stop shouting / Circle time ritual)
  2. 0:03-0:24.0 - Acoustic Bilateral Movement + Kinetic VideoCaptioner Subtitles
  3. 0:24-0:33.0 - Seriphia Sovereign Wisdom End Card + Save Loop CTA
  4. Generates Shotcut MLT project XML for GUI editing or Shotcut CLI
  5. Exports broadcast-ready H.264 MP4 with burned ASS subtitles
"""

import os
import sys
import argparse
import subprocess
from PIL import Image, ImageDraw, ImageFont

# Default track presets
SOE_TRACK_PRESETS = {
    "drill_time": {
        "title": "Drill Time",
        "tag": "SOE CIRCLE-TIME RITUAL",
        "hook_h1": "Stop shouting during transitions.",
        "hook_h2": "Use this 30-second acoustic focus march instead 🥁",
        "quote_line1": "“When the body marches in rhythm,",
        "quote_line2": " the developing mind focuses in peace.”",
        "author": "— Seriphia, The Sound of Essentials",
        "cta_text": "📌 HIT SAVE FOR CIRCLE TIME",
        "duration": 33.0,
        "transition_point": 24.0,
    },
    "lets_stretch": {
        "title": "Let's Stretch",
        "tag": "SOE SOMATIC REGULATION",
        "hook_h1": "Before circle time, reset the nervous system.",
        "hook_h2": "Try this 30-second somatic morning stretch 🌱",
        "quote_line1": "“Stretch high like the canopy,",
        "quote_line2": " root deep into your calm.”",
        "author": "— Seriphia, The Sound of Essentials",
        "cta_text": "📌 HIT SAVE FOR MORNING MEETING",
        "duration": 33.0,
        "transition_point": 24.0,
    }
}

def create_hook_card(tag: str, h1: str, h2: str, output_path: str):
    img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        font_bold = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 42)
        font_sub = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 32)
        font_tag = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 26)
    except Exception:
        font_bold = ImageFont.load_default()
        font_sub = font_bold
        font_tag = font_bold

    box_top, box_bottom = 180, 380
    draw.rounded_rectangle([60, box_top, 1020, box_bottom], radius=24, fill=(20, 20, 30, 215), outline=(255, 215, 0, 240), width=3)
    draw.rounded_rectangle([90, box_top + 20, 500, box_top + 65], radius=12, fill=(79, 70, 229, 255))
    draw.text((105, box_top + 27), tag, font=font_tag, fill=(255, 255, 255))
    draw.text((90, box_top + 80), h1, font=font_bold, fill=(255, 235, 59))
    draw.text((90, box_top + 135), h2, font=font_sub, fill=(240, 240, 250))

    img.save(output_path)
    return output_path

def create_seriphia_wisdom_card(seriphia_photo: str, q1: str, q2: str, author: str, cta: str, output_path: str):
    card = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    ser_raw = Image.open(seriphia_photo).convert("RGBA")
    w, h = ser_raw.size
    target_ratio = 1080 / 1920
    if w / h > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        ser_crop = ser_raw.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        ser_crop = ser_raw.crop((0, top, w, top + new_h))

    ser_crop = ser_crop.resize((1080, 1920), Image.Resampling.LANCZOS)
    card.paste(ser_crop, (0, 0))

    # Dark gradient banner for wisdom
    overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    ov_draw.rectangle([0, 1050, 1080, 1920], fill=(15, 12, 41, 235))
    card = Image.alpha_composite(card, overlay)
    draw = ImageDraw.Draw(card)

    try:
        font_quote = ImageFont.truetype(r"C:\Windows\Fonts\georgia.ttf", 36)
        font_author = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 30)
        font_cta = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 36)
    except Exception:
        font_quote = ImageFont.load_default()
        font_author = font_quote
        font_cta = font_quote

    draw.text((80, 1140), q1, font=font_quote, fill=(255, 255, 255))
    draw.text((80, 1195), q2, font=font_quote, fill=(255, 235, 59))
    draw.text((80, 1270), author, font=font_author, fill=(167, 139, 250))

    # Green Save Pill
    draw.rounded_rectangle([70, 1420, 1010, 1550], radius=24, fill=(34, 197, 94, 255), outline=(255, 255, 255, 255), width=3)
    draw.text((110, 1460), cta, font=font_cta, fill=(255, 255, 255))

    card.save(output_path)
    return output_path

def generate_shotcut_mlt(audio_path, cover_path, seriphia_card_path, hook_card_path, mlt_path, duration=33.0, transition_point=24.0):
    audio_path_esc = audio_path.replace("\\", "/")
    cover_path_esc = cover_path.replace("\\", "/")
    seriphia_path_esc = seriphia_card_path.replace("\\", "/")
    hook_path_esc = hook_card_path.replace("\\", "/")

    sec_dur = int(duration)
    ms_dur = f"{sec_dur:02d}.000"
    trans_sec = int(transition_point)
    trans_dur = f"{trans_sec:02d}.000"
    outro_dur = f"{int(duration - transition_point):02d}.000"

    mlt = f"""<?xml version="1.0" standalone="no"?>
<mlt LC_NUMERIC="C" version="7.24.0" title="SOE ECE Video Recipe" producer="main_bin">
  <profile description="Vertical 9:16 (1080x1920 30fps)" width="1080" height="1920" progressive="1" sample_aspect_num="1" sample_aspect_den="1" display_aspect_num="9" display_aspect_den="16" frame_rate_num="30" frame_rate_den="1" colorspace="709"/>

  <producer id="producer_audio" in="00:00:00.000" out="00:00:{ms_dur}">
    <property name="resource">{audio_path_esc}</property>
    <property name="mlt_service">avformat-novalidate</property>
    <property name="audio_index">0</property>
    <property name="video_index">-1</property>
  </producer>

  <producer id="producer_cover" in="00:00:00.000" out="00:00:{trans_dur}">
    <property name="resource">{cover_path_esc}</property>
    <property name="mlt_service">qimage</property>
    <property name="ttl">25</property>
    <property name="aspect_ratio">1</property>
    <filter id="zoom_cover">
      <property name="mlt_service">affine</property>
      <property name="background">color:0x00000000</property>
      <property name="transition.fill">1</property>
      <property name="transition.distort">0</property>
      <property name="transition.geometry">0=0,0:1080x1920:100;{int(transition_point * 30)}=-20,-35:1120x1990:100</property>
    </filter>
  </producer>

  <producer id="producer_seriphia" in="00:00:00.000" out="00:00:{outro_dur}">
    <property name="resource">{seriphia_path_esc}</property>
    <property name="mlt_service">qimage</property>
    <property name="ttl">25</property>
    <property name="aspect_ratio">1</property>
    <filter id="fadein_seriphia">
      <property name="mlt_service">brightness</property>
      <property name="start">0</property>
      <property name="end">1</property>
      <property name="in">0</property>
      <property name="out">30</property>
    </filter>
  </producer>

  <producer id="producer_hook" in="00:00:00.000" out="00:00:04.500">
    <property name="resource">{hook_path_esc}</property>
    <property name="mlt_service">qimage</property>
    <property name="ttl">25</property>
    <filter id="fadeout_hook">
      <property name="mlt_service">brightness</property>
      <property name="start">1</property>
      <property name="end">0</property>
      <property name="in">105</property>
      <property name="out">135</property>
    </filter>
  </producer>

  <playlist id="playlist_bg">
    <entry producer="producer_cover" in="00:00:00.000" out="00:00:{trans_dur}"/>
    <entry producer="producer_seriphia" in="00:00:00.000" out="00:00:{outro_dur}"/>
  </playlist>

  <playlist id="playlist_overlay">
    <entry producer="producer_hook" in="00:00:00.000" out="00:00:04.500"/>
    <blank length="00:00:{int(duration - 4.5):02d}.500"/>
  </playlist>

  <playlist id="playlist_audio">
    <entry producer="producer_audio" in="00:00:00.000" out="00:00:{ms_dur}"/>
  </playlist>

  <tractor id="tractor_main" in="00:00:00.000" out="00:00:{ms_dur}">
    <multitrack>
      <track producer="playlist_bg"/>
      <track producer="playlist_overlay"/>
      <track producer="playlist_audio" hide="video"/>
    </multitrack>
    <transition id="transition_composite">
      <property name="mlt_service">composite</property>
      <property name="a_track">0</property>
      <property name="b_track">1</property>
      <property name="geometry">0,0:1080x1920:100</property>
      <property name="halign">center</property>
      <property name="valign">middle</property>
    </transition>
  </tractor>

  <playlist id="main_bin">
    <property name="xml_retain">1</property>
    <entry producer="tractor_main"/>
  </playlist>
</mlt>
"""
    with open(mlt_path, "w", encoding="utf-8") as f:
        f.write(mlt)
    return mlt_path

def render_ffmpeg(cover_path, seriphia_card_path, hook_card_path, audio_path, ass_path, output_mp4, duration=33.0, transition_point=24.0):
    ass_escaped = ass_path.replace("\\", "/").replace(":", "\\:")
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-t", str(transition_point + 1.0), "-i", cover_path,
        "-loop", "1", "-t", str(duration - transition_point), "-i", seriphia_card_path,
        "-loop", "1", "-t", "5.0", "-i", hook_card_path,
        "-i", audio_path,
        "-filter_complex",
        "[0:v]scale=1920:1920,crop=1080:1920:420:0,zoompan=z='min(zoom+0.0005,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=750:s=1080x1920:fps=30[v0];"
        "[v0][2:v]overlay=0:0:enable='between(t,0,4.5)'[v_hook];"
        "[1:v]fps=30,scale=1080:1920[v_ser];"
        f"[v_hook][v_ser]xfade=transition=fade:duration=1.0:offset={transition_point}[v_main];"
        f"[v_main]ass='{ass_escaped}'[v_final]",
        "-map", "[v_final]",
        "-map", "3:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "fast", "-crf", "22",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(duration),
        output_mp4
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg error: {res.stderr[-800:]}")
    return output_mp4

def main():
    parser = argparse.ArgumentParser(description="SOE Rhythm Quest Batch Video Recipe Assembler")
    parser.add_argument("--preset", default="drill_time", choices=["drill_time", "lets_stretch"])
    parser.add_argument("--output-dir", default=r"C:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\web\public\assets\videos")
    args = parser.parse_args()

    cfg = SOE_TRACK_PRESETS[args.preset]
    scratch_dir = r"C:\Users\ldmur\.gemini\antigravity-ide\brain\a54da94e-b5db-462c-ac66-67f7ca400f9d\scratch"
    os.makedirs(args.output_dir, exist_ok=True)

    hook_png = os.path.join(scratch_dir, f"{args.preset}_hook.png")
    wisdom_png = os.path.join(scratch_dir, f"{args.preset}_wisdom.png")
    seriphia_photo = r"C:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\Site Photos\Seriphia selfie.png"
    drill_photo = r"C:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\Site Photos\Drill Time.png"
    audio_path = os.path.join(scratch_dir, "drill_time_33s.mp3")
    ass_path = os.path.join(scratch_dir, "drill_time_captions.ass")

    print(f"[1/4] Building visual Hook Card for {cfg['title']}...")
    create_hook_card(cfg["tag"], cfg["hook_h1"], cfg["hook_h2"], hook_png)

    print(f"[2/4] Building Seriphia Wisdom End Card...")
    create_seriphia_wisdom_card(seriphia_photo, cfg["quote_line1"], cfg["quote_line2"], cfg["author"], cfg["cta_text"], wisdom_png)

    mlt_out = os.path.join(args.output_dir, f"{args.preset}_shotcut.mlt")
    print(f"[3/4] Generating Shotcut MLT project XML at {mlt_out}...")
    generate_shotcut_mlt(audio_path, drill_photo, wisdom_png, hook_png, mlt_out, cfg["duration"], cfg["transition_point"])

    mp4_out = os.path.join(args.output_dir, f"{args.preset}_ece_viral_recipe.mp4")
    print(f"[4/4] Rendering broadcast MP4 with VideoCaptioner subtitles to {mp4_out}...")
    render_ffmpeg(drill_photo, wisdom_png, hook_png, audio_path, ass_path, mp4_out, cfg["duration"], cfg["transition_point"])
    print(f"DONE! Rendered successfully: {mp4_out} ({os.path.getsize(mp4_out):,} bytes)")

if __name__ == "__main__":
    main()
