#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOE Rhythm Quest: The Rhythm Ready Workbook — Generator & Packager
================================================================
Generates all XHTML activity pages from workbook_content.json,
syncs dictionary images from the existing ebook, updates content.opf,
and packages the final EPUB 3 archive.

Usage:
    python generate_workbook.py               # Build all weeks + package
    python generate_workbook.py --week 1      # Build only Week 1
    python generate_workbook.py --week all    # Build all weeks (default)
    python generate_workbook.py --package     # Re-package existing XHTML only
    python generate_workbook.py --no-package  # Generate XHTML but skip zip

Requirements: Python 3.8+  (no external libraries needed)
"""

import sys
import os
import re
import json
import shutil
import zipfile
import pathlib
import argparse
from xml.sax.saxutils import escape
from datetime import datetime, timezone

# Windows console encoding fix
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ─────────────────────────────────────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────────────────────────────────────
BASE_DIR       = pathlib.Path(__file__).parent.resolve()
CONTENT_FILE   = BASE_DIR / "workbook_content.json"
TEMPLATE_FILE  = BASE_DIR / "templates" / "activity_template.xhtml"
PAGES_DIR      = BASE_DIR / "OEBPS" / "pages"
STYLES_DIR     = BASE_DIR / "OEBPS" / "styles"
OPF_FILE       = BASE_DIR / "OEBPS" / "content.opf"
DICT_IMG_DEST  = BASE_DIR / "OEBPS" / "images" / "dictionary"
CHAR_IMG_DEST  = BASE_DIR / "OEBPS" / "images" / "characters"

# Source dictionary images from the existing SOE picture dictionary ebook
DICT_IMG_SRC   = BASE_DIR.parent / "ebook" / "OEBPS" / "images"

EPUB_OUT       = BASE_DIR / "SOE_RhythmReady_Workbook.epub"
MIMETYPE_FILE  = BASE_DIR / "mimetype"
META_INF_FILE  = BASE_DIR / "META-INF" / "container.xml"

# ─────────────────────────────────────────────────────────────────────────────
# DESIGN CONSTANTS (match workbook.css tokens exactly)
# ─────────────────────────────────────────────────────────────────────────────
LAND_COLORS = {
    1: "#d4a843",  # Harmonia  — Reading & Phonics
    2: "#7fb685",  # Numeria   — Math
    3: "#5fb685",  # Terrasol  — Science
    4: "#5ba4c9",  # Aquaria   — Geography
    5: "#c4785a",  # Vitalis   — Fitness
    6: "#d4897a",  # Luminosity — Civics
    7: "#9678c4",  # Celestia  — Reflection
}


# ─────────────────────────────────────────────────────────────────────────────
# TEMPLATE RENDERER
# ─────────────────────────────────────────────────────────────────────────────
def render_day(week_num: int, day_data: dict, template: str) -> str:
    """
    Replace all {{ TOKEN }} placeholders in the XHTML template
    with values from day_data. Returns the rendered XHTML string.
    """
    tpl = template
    dd  = day_data
    b   = dd.get("blocks", {})

    primary_land  = dd.get("primary_land", 1)
    primary_color = dd.get("primary_land_color", LAND_COLORS.get(primary_land, "#d4a843"))

    land_hero_imgs = {
        1: "land1_harmonia_hero.jpg",
        2: "land2_numeria_hero.jpg",
        3: "land3_terrasol_hero.jpg",
        4: "land4_aquaria_hero.jpg",
        5: "land5_vitalis_hero.jpg",
        6: "land6_luminosity_hero.jpg",
        7: "land7_celestia_hero.jpg",
        8: "land8_grandquest_hero.jpg",
    }
    land_names = {
        1: "Harmonia",
        2: "Numeria",
        3: "Terrasol",
        4: "Aquaria",
        5: "Vitalis",
        6: "Luminosity",
        7: "Celestia",
        8: "The Grand Quest",
    }

    # ── Header ──────────────────────────────────────────────────────────────
    substitutions = {
        "WEEK_NUM":            str(week_num),
        "DAY_NUM":             str(dd.get("day", 1)),
        "DAY_LABEL":           dd.get("day_label", ""),
        "DAY_TITLE":           dd.get("day_title", ""),
        "PRIMARY_LAND_COLOR":  primary_color,
        "PRIMARY_CHAR_IMG":    dd.get("primary_char_img", "placeholder_avatar.png").lower(),
        "PRIMARY_CHAR_NAMES":  dd.get("primary_char_names", ""),
        "LAND_HERO_IMG":       land_hero_imgs.get(week_num, "land1_harmonia_hero.jpg"),
        "LAND_NAME":           land_names.get(week_num, "Harmonia"),
    }

    day_num = int(dd.get("day", 1))
    land_hero_img = land_hero_imgs.get(week_num, "land1_harmonia_hero.jpg")
    land_name = land_names.get(week_num, "Harmonia")
    primary_chars = dd.get("primary_char_names", "")
    day_title = dd.get("day_title", "")

    if day_num == 1:
        launchpad_html = f'''  <figure class="day-hero-scene">
    <img src="../../images/lands/{land_hero_img}"
         alt="{_safe_xml(day_title)} — {_safe_xml(primary_chars)}" />
    <figcaption class="hero-caption">🌟 Week {week_num} Expedition Launchpad: Explore {land_name} with {_safe_xml(primary_chars)}!</figcaption>
  </figure>'''
    else:
        launchpad_html = f'''  <div class="day-quest-banner">
    <p class="hero-caption">🌟 Today's Quest: Explore {land_name} with {_safe_xml(primary_chars)}!</p>
  </div>'''

    substitutions["HERO_LAUNCHPAD_HTML"] = launchpad_html

    # ── Activity blocks A–D ─────────────────────────────────────────────────
    for slot, num in [("A", "1"), ("B", "2"), ("C", "3"), ("D", "4"), ("G", "6"), ("H", "7"), ("I", "8")]:
        blk = b.get(slot, {})
        substitutions[f"ACT{num}_TITLE"]      = blk.get("title", "")
        substitutions[f"ACT{num}_TIME"]        = str(blk.get("time", 3))
        substitutions[f"ACT{num}_IMG"]         = blk.get("img", "placeholder.png")
        substitutions[f"ACT{num}_IMG_ALT"]     = blk.get("img_alt", "")
        substitutions[f"ACT{num}_IMG_SOURCE"]  = blk.get("img_source", "")
        substitutions[f"ACT{num}_PHONETIC"]    = blk.get("phonetic", "")
        substitutions[f"ACT{num}_INSTRUCTIONS"] = blk.get("instructions", "")
        substitutions[f"ACT{num}_TIP"]         = blk.get("tip", "")
        # Spelling word: use explicit field or derive from first phonetic token
        raw_phonetic = blk.get("phonetic", "")
        spell_word   = blk.get("spell_word") or (raw_phonetic.split("|")[0].strip() if raw_phonetic else blk.get("title", "").split(":")[-1].strip())
        substitutions[f"ACT{num}_SPELL_WORD"]  = spell_word

    # ── Block E (rotating subject) ───────────────────────────────────────────
    e = b.get("E", {})
    e_land = e.get("land", 4)
    substitutions["ACT5_TITLE"]       = e.get("title", "")
    substitutions["ACT5_TIME"]        = str(e.get("time", 3))
    substitutions["ACT5_IMG"]         = e.get("img", "placeholder.png")
    substitutions["ACT5_IMG_ALT"]     = e.get("img_alt", "")
    substitutions["ACT5_IMG_SOURCE"]  = e.get("img_source", "")
    substitutions["ACT5_PHONETIC"]    = e.get("phonetic", "")
    substitutions["ACT5_INSTRUCTIONS"] = e.get("instructions", "")
    substitutions["ACT5_TIP"]         = e.get("tip", "")
    substitutions["ACT5_LAND_CLASS"]  = e.get("land_class", f"land{e_land}")
    substitutions["ACT5_LAND_NUM"]    = str(e_land)
    substitutions["ACT5_LAND_NAME"]   = e.get("land_name", "")
    substitutions["ACT5_ICON"]        = e.get("icon", "📚")
    substitutions["ACT5_SUBJECT"]     = e.get("subject", "")
    substitutions["ACT5_CHAR_IMG"]    = e.get("char_img", "placeholder_avatar.png").lower()
    substitutions["ACT5_CHAR_NAMES"]  = e.get("char_names", "")

    # Block J (Hero Quest Moment — rotates through all 15 heroes)
    j = b.get("J", {})
    substitutions["ACT9_TITLE"]           = j.get("title", "")
    substitutions["ACT9_TIME"]            = str(j.get("time", 5))
    substitutions["ACT9_IMG"]             = j.get("img", "placeholder.png")
    substitutions["ACT9_IMG_ALT"]         = j.get("img_alt", "")
    substitutions["ACT9_IMG_SOURCE"]      = j.get("img_source", "")
    substitutions["ACT9_HERO_NAME"]       = j.get("hero_name", "")
    substitutions["ACT9_HERO_LAND"]       = j.get("hero_land", "")
    substitutions["ACT9_STORY"]           = j.get("story_snippet", "")
    substitutions["ACT9_REFLECTION_Q"]    = j.get("reflection_question", "")
    substitutions["ACT9_TIP"]             = j.get("tip", "")
    substitutions["ACT9_CHAR_IMG"]        = j.get("char_img", "placeholder_avatar.png").lower()

    #── Reflection block F ──────────────────────────────────────────────────
    f_blk = b.get("F", {})
    substitutions["REFLECTION_PROMPT"] = f_blk.get("reflection_prompt", "")

    # ── Apply all substitutions ─────────────────────────────────────────────
    for token, value in substitutions.items():
        if token == "HERO_LAUNCHPAD_HTML":
            tpl = tpl.replace(f"{{{{ {token} }}}}", value)
        else:
            tpl = tpl.replace(f"{{{{ {token} }}}}", _safe_xml(value))

    return tpl


def _safe_xml(text: str) -> str:
    """Escape characters that would break XHTML, preserving intentional emoji."""
    return (text
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            # Re-restore our explicit HTML entities that were already escaped
            .replace("&amp;amp;", "&amp;")
            )


# ─────────────────────────────────────────────────────────────────────────────
# IMAGE SYNC
# ─────────────────────────────────────────────────────────────────────────────
def _resolve_dict_image(img_ref: str) -> tuple[pathlib.Path | None, str]:
    """
    Resolve a workbook image reference (e.g. 'land1_greetings-introductions.jpg')
    to an actual file in the SOE dictionary ebook OEBPS/images directory.

    The workbook JSON uses the convention:  land{N}_{scene-slug}.jpg
    The dictionary ebook uses the convention: land{N}-{scene-slug}.jpg

    Strategy:
     1. Try the exact filename first.
     2. Normalise: replace first underscore (after landN) with a hyphen → try again.
     3. Try both .jpg and .png extensions.
    """
    # Build candidate filenames to try
    candidates_names = [img_ref]
    # Replace land{N}_ with land{N}- (only first underscore)
    normalised = re.sub(r'^(land\d+)_', r'\1-', img_ref)
    if normalised != img_ref:
        candidates_names.append(normalised)

    # Also try swapping extension
    extra = []
    for c in candidates_names:
        if c.endswith(".png"):
            extra.append(c[:-4] + ".jpg")
        elif c.endswith(".jpg"):
            extra.append(c[:-4] + ".png")
    candidates_names.extend(extra)

    for cname in candidates_names:
        matches = list(DICT_IMG_SRC.rglob(cname))
        if matches:
            return matches[0], cname   # (source_path, canonical_name)
    return None, img_ref


def sync_dictionary_images(all_weeks: list) -> int:
    """
    Copy referenced SOE Picture Dictionary scene images into the workbook.
    NOTE: Character portrait images (SILAS.jpg, VESTA.jpg, etc.) are NOT synced—
    those had OiiOii watermarks and are replaced by emoji icons in the template.
    Returns the number of images copied.
    """
    DICT_IMG_DEST.mkdir(parents=True, exist_ok=True)
    needed = set()

    for week in all_weeks:
        for day in week.get("days", []):
            for bid, blk in day.get("blocks", {}).items():
                if isinstance(blk, dict):
                    img = blk.get("img")
                    if img:
                        needed.add(img)

    copied = 0
    not_found = []
    for img_ref in sorted(needed):
        src_path, canonical = _resolve_dict_image(img_ref)
        if src_path is None:
            not_found.append(img_ref)
            continue
        dest = DICT_IMG_DEST / img_ref   # keep workbook reference name
        if not dest.exists():
            shutil.copy2(src_path, dest)
            copied += 1
            print(f"  [img] {img_ref}  ←  {canonical}")

    if not_found:
        print(f"\n  [WARN] {len(not_found)} images not found in dictionary source:")
        for nf in not_found:
            print(f"         {nf}")

    print(f"[sync] {copied} new images copied ({len(needed)} total referenced).")
    return copied


# ─────────────────────────────────────────────────────────────────────────────
# CONTENT.OPF GENERATOR
# ─────────────────────────────────────────────────────────────────────────────
def generate_opf(page_refs: list[str], title: str = "SOE Rhythm Quest: Rhythm Ready Workbook"):
    """Dynamically build content.opf with a full manifest and spine matching Lulu & W3C/EAA standards."""

    # Static pages (always present in logical front-to-back reading order)
    static = [
        "cover.xhtml",
        "title_page.xhtml",
        "copyright.xhtml",
        "nav.xhtml",
        "frontmatter.xhtml",
        "weekly_overview.xhtml"
    ]
    backmatter = [
        "bm_achievement.xhtml",
        "bm_glossary.xhtml",
        "bm_parent_guide.xhtml"
    ]

    manifest_lines = [
        '    <!-- Core Stylesheet & Dual Navigation -->',
        '    <item id="css-workbook" href="styles/workbook.css" media-type="text/css"/>',
        '    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
        '    <!-- Official Cover Image (Lulu Ebook Spec: 612x792 @ 150 DPI) -->',
        '    <item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>',
    ]
    spine_lines = []

    def add_page(ref: str, extra_props: str = ""):
        pid = ref.replace("/", "_").replace(".xhtml", "").replace("-", "_")
        props = f' properties="{extra_props}"' if extra_props else ""
        manifest_lines.append(
            f'    <item id="{pid}" href="pages/{ref}" media-type="application/xhtml+xml"{props}/>'
        )
        spine_lines.append(f'    <itemref idref="{pid}"/>')

    for sp in static:
        props = "nav" if sp == "nav.xhtml" else ""
        add_page(sp, props)

    for ref in sorted(page_refs):
        add_page(ref)

    for bm in backmatter:
        add_page(bm)

    # Add all dictionary scene images (.jpg and .png) to manifest
    manifest_lines.append('    <!-- 125 Picture Dictionary Scenes -->')
    for img_path in sorted(DICT_IMG_DEST.glob("*.*")):
        if img_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
            mtype = "image/png" if img_path.suffix.lower() == ".png" else "image/jpeg"
            img_id = "dict_" + img_path.stem.replace("-", "_").replace(".", "_")
            manifest_lines.append(
                f'    <item id="{img_id}" href="images/dictionary/{img_path.name}" media-type="{mtype}"/>'
            )

    # Add all character avatar images to manifest
    manifest_lines.append('    <!-- 14 Hero Character Avatars -->')
    for img_path in sorted(CHAR_IMG_DEST.glob("*.*")):
        if img_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
            mtype = "image/png" if img_path.suffix.lower() == ".png" else "image/jpeg"
            img_id = "char_" + img_path.stem.replace("-", "_").replace(".", "_")
            manifest_lines.append(
                f'    <item id="{img_id}" href="images/characters/{img_path.name}" media-type="{mtype}"/>'
            )

    # Add 8 Master Land Hero Artworks to manifest
    manifest_lines.append('    <!-- 8 Master Land Hero Artworks -->')
    lands_dir = BASE_DIR / "OEBPS" / "images" / "lands"
    if lands_dir.exists():
        for img_path in sorted(lands_dir.glob("*.*")):
            if img_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
                mtype = "image/png" if img_path.suffix.lower() == ".png" else "image/jpeg"
                img_id = "land_hero_" + img_path.stem.replace("-", "_").replace(".", "_")
                manifest_lines.append(
                    f'    <item id="{img_id}" href="images/lands/{img_path.name}" media-type="{mtype}"/>'
                )

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    opf_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
         version="3.0"
         unique-identifier="uid"
         xml:lang="en">

  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">soe-rhythmready-workbook-2026</dc:identifier>
    <dc:title>{_safe_xml(title)}</dc:title>
    <dc:creator>The Sound of Essentials Team</dc:creator>
    <dc:language>en</dc:language>
    <dc:subject>Education; School Readiness; Foundation; Early Childhood; Elementary; Homeschool</dc:subject>
    <dc:description>A neuro-affirming, bilingual-ready 8-week Rhythm Ready workbook set in the 7 Lands of the SOE universe. About 30 minutes of daily cross-curricular activities across 10 short activity blocks, for ages 2–7 (Pre-K to Grade 2).</dc:description>
    <dc:rights>Copyright © 2026 The Sound of Essentials. All rights reserved.</dc:rights>
    <meta property="dcterms:modified">{date_str}</meta>
    <meta name="cover" content="cover-image"/>

    <!-- W3C EPUB Accessibility 1.1 / EAA Compliance (Lulu Guide Page 11) -->
    <meta property="schema:accessMode">textual</meta>
    <meta property="schema:accessMode">visual</meta>
    <meta property="schema:accessModeSufficient">textual</meta>
    <meta property="schema:accessibilityFeature">structuralNavigation</meta>
    <meta property="schema:accessibilityFeature">alternativeText</meta>
    <meta property="schema:accessibilityFeature">readingOrder</meta>
    <meta property="schema:accessibilityFeature">tableOfContents</meta>
    <meta property="schema:accessibilityHazard">none</meta>
    <meta property="schema:accessibilitySummary">A neuro-affirming early learning workbook featuring structured navigation, alternative text on all 125 illustrations and 14 hero cards, clear heading hierarchy, and accessible color contrast.</meta>
  </metadata>

  <manifest>
{chr(10).join(manifest_lines)}
  </manifest>

  <spine toc="ncx" page-progression-direction="ltr">
{chr(10).join(spine_lines)}
  </spine>

</package>
"""
    OPF_FILE.write_text(opf_content, encoding="utf-8")
    print(f"[opf] content.opf written with {len(page_refs)} activity pages and full manifest.")


# ─────────────────────────────────────────────────────────────────────────────
# EPUB PACKAGER
# ─────────────────────────────────────────────────────────────────────────────
def build_epub():
    """Package the workbook directory into a valid EPUB 3 archive."""
    # Ensure mimetype exists (ASCII, no newline)
    if not MIMETYPE_FILE.exists():
        MIMETYPE_FILE.write_bytes(b"application/epub+zip")

    print(f"\n[build] Packaging → {EPUB_OUT.name}")
    with zipfile.ZipFile(EPUB_OUT, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        # CRITICAL: mimetype must be the FIRST entry and UNCOMPRESSED
        zf.write(MIMETYPE_FILE, "mimetype", compress_type=zipfile.ZIP_STORED)

        # META-INF/container.xml
        if META_INF_FILE.exists():
            zf.write(META_INF_FILE, "META-INF/container.xml")

        # All OEBPS content (excluding temporary backups)
        oebps_dir = BASE_DIR / "OEBPS"
        for fpath in sorted(oebps_dir.rglob("*")):
            if fpath.is_file() and "images_fullres_backup" not in fpath.parts and "images_print" not in fpath.parts:
                arcname = fpath.relative_to(BASE_DIR).as_posix()
                zf.write(fpath, arcname)

    size_mb = EPUB_OUT.stat().st_size / (1024 * 1024)
    print(f"[build] ✅ {EPUB_OUT.name}  ({size_mb:.1f} MB)")


# ─────────────────────────────────────────────────────────────────────────────
# NAV.XHTML & TOC.NCX GENERATOR
# ─────────────────────────────────────────────────────────────────────────────
def generate_nav(all_weeks: list, page_refs: list[str]):
    """Create the EPUB 3 navigation document (nav.xhtml) and EPUB 2 toc.ncx."""
    import generate_nav_and_ncx
    generate_nav_and_ncx.generate()
    print(f"[nav] nav.xhtml & toc.ncx synchronized successfully.")


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="SOE Rhythm Ready Workbook — EPUB Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_workbook.py                Build all 8 weeks + package EPUB
  python generate_workbook.py --week 1       Build only Week 1 + package
  python generate_workbook.py --no-package   Build XHTML but skip EPUB zip
  python generate_workbook.py --package      Only re-zip existing files
        """
    )
    parser.add_argument("--week",       default="all",  help="Week number (1–8) or 'all'")
    parser.add_argument("--package",    action="store_true", help="Package only (skip generation)")
    parser.add_argument("--no-package", action="store_true", help="Generate only (skip packaging)")
    args = parser.parse_args()

    # ── Load content ─────────────────────────────────────────────────────────
    if not CONTENT_FILE.exists():
        print(f"[ERROR] Content file not found: {CONTENT_FILE}")
        sys.exit(1)

    with open(CONTENT_FILE, encoding="utf-8-sig") as f:
        content = json.load(f)

    all_weeks = content.get("weeks", [])
    title     = content.get("title", "SOE Rhythm Quest: Rhythm Ready Workbook")

    # ── Select weeks to build ─────────────────────────────────────────────────
    if args.week == "all":
        weeks_to_build = all_weeks
    else:
        try:
            target = int(args.week)
            weeks_to_build = [w for w in all_weeks if w.get("week") == target]
        except ValueError:
            print(f"[ERROR] Invalid --week value: {args.week}")
            sys.exit(1)

    if not args.package:
        # ── Load template ─────────────────────────────────────────────────────
        if not TEMPLATE_FILE.exists():
            print(f"[ERROR] Template not found: {TEMPLATE_FILE}")
            sys.exit(1)
        template = TEMPLATE_FILE.read_text(encoding="utf-8")

        # ── Generate day pages ─────────────────────────────────────────────────
        all_page_refs = []
        PAGES_DIR.mkdir(parents=True, exist_ok=True)

        for week in weeks_to_build:
            wn = week.get("week", 0)
            if not week.get("days"):
                print(f"[skip] Week {wn} — no days defined yet.")
                continue

            week_dir = PAGES_DIR / f"week{wn}"
            week_dir.mkdir(parents=True, exist_ok=True)

            for day_data in week["days"]:
                dn = day_data.get("day", 1)
                xhtml = render_day(wn, day_data, template)
                filename = f"week{wn}/day{dn}.xhtml"
                out_path = PAGES_DIR / f"week{wn}" / f"day{dn}.xhtml"
                out_path.write_text(xhtml, encoding="utf-8")
                all_page_refs.append(filename)
                print(f"[gen] Week {wn} · Day {dn} ({day_data.get('day_label','')}) → {filename}")

        # Sync images and update the manifest
        sync_dictionary_images(all_weeks)
        generate_nav(all_weeks, all_page_refs)
        generate_opf(all_page_refs, title)

    # -------------------------------- Package --------------------------------
    if not args.no_package:
        build_epub()

    print("\n✅ SOE Rhythm Ready Workbook — build complete!")
    print(f"   Output: {EPUB_OUT}")


if __name__ == "__main__":
    main()
