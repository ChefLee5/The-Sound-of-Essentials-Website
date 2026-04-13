#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOE Rhythm Quest: The Summer Stretch Workbook â€” Generator & Packager
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
from datetime import datetime, timezone

# Windows console encoding fix
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# PATHS
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

EPUB_OUT       = BASE_DIR / "SOE_The_Summer_Stretch_Workbook.epub"
MIMETYPE_FILE  = BASE_DIR / "mimetype"
META_INF_FILE  = BASE_DIR / "META-INF" / "container.xml"

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# DESIGN CONSTANTS (match workbook.css tokens exactly)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
LAND_COLORS = {
    1: "#d4a843",  # Harmonia  â€” Reading & Phonics
    2: "#7fb685",  # Numeria   â€” Math
    3: "#10B981",  # Terrasol  â€” Science
    4: "#2563EB",  # Aquaria   â€” Geography
    5: "#c4785a",  # Vitalis   â€” Fitness
    6: "#5ba4c9",  # Sophia    â€” Civics
    7: "#9678c4",  # Celestia  â€” Reflection
}


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# TEMPLATE RENDERER
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    # â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    substitutions = {
        "WEEK_NUM":            str(week_num),
        "DAY_NUM":             str(dd.get("day", 1)),
        "DAY_LABEL":           dd.get("day_label", ""),
        "DAY_TITLE":           dd.get("day_title", ""),
        "PRIMARY_LAND_COLOR":  primary_color,
        "PRIMARY_CHAR_IMG":    dd.get("primary_char_img", "placeholder_avatar.png"),
        "PRIMARY_CHAR_NAMES":  dd.get("primary_char_names", ""),
    }

    # â”€â”€ Activity blocks Aâ€“D â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    for slot, num in [("A", "1"), ("B", "2"), ("C", "3"), ("D", "4")]:
        blk = b.get(slot, {})
        substitutions[f"ACT{num}_TITLE"]      = blk.get("title", "")
        substitutions[f"ACT{num}_TIME"]        = str(blk.get("time", 3))
        substitutions[f"ACT{num}_IMG"]         = blk.get("img", "placeholder.png")
        substitutions[f"ACT{num}_IMG_ALT"]     = blk.get("img_alt", "")
        substitutions[f"ACT{num}_IMG_SOURCE"]  = blk.get("img_source", "SOE Picture Dictionary")
        substitutions[f"ACT{num}_PHONETIC"]    = blk.get("phonetic", "")
        substitutions[f"ACT{num}_INSTRUCTIONS"] = blk.get("instructions", "")
        substitutions[f"ACT{num}_TIP"]         = blk.get("tip", "")

    # â”€â”€ Block E (rotating subject) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    e = b.get("E", {})
    e_land = e.get("land", 4)
    substitutions["ACT5_TITLE"]       = e.get("title", "")
    substitutions["ACT5_TIME"]        = str(e.get("time", 3))
    substitutions["ACT5_IMG"]         = e.get("img", "placeholder.png")
    substitutions["ACT5_IMG_ALT"]     = e.get("img_alt", "")
    substitutions["ACT5_IMG_SOURCE"]  = e.get("img_source", "SOE Picture Dictionary")
    substitutions["ACT5_PHONETIC"]    = e.get("phonetic", "")
    substitutions["ACT5_INSTRUCTIONS"] = e.get("instructions", "")
    substitutions["ACT5_TIP"]         = e.get("tip", "")
    substitutions["ACT5_LAND_CLASS"]  = e.get("land_class", f"land{e_land}")
    substitutions["ACT5_LAND_NUM"]    = str(e_land)
    substitutions["ACT5_LAND_NAME"]   = e.get("land_name", "")
    substitutions["ACT5_ICON"]        = e.get("icon", "ðŸ“š")
    substitutions["ACT5_SUBJECT"]     = e.get("subject", "")
    substitutions["ACT5_CHAR_IMG"]    = e.get("char_img", "placeholder_avatar.png")
    substitutions["ACT5_CHAR_NAMES"]  = e.get("char_names", "")

    # â”€â”€ Reflection block F â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    f_blk = b.get("F", {})
    substitutions["REFLECTION_PROMPT"] = f_blk.get("reflection_prompt", "")

    # â”€â”€ Apply all substitutions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    for token, value in substitutions.items():
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


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# IMAGE SYNC
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def _resolve_dict_image(img_ref: str) -> tuple[pathlib.Path | None, str]:
    """
    Resolve a workbook image reference (e.g. 'land1_greetings-introductions.jpg')
    to an actual file in the SOE dictionary ebook OEBPS/images directory.

    The workbook JSON uses the convention:  land{N}_{scene-slug}.jpg
    The dictionary ebook uses the convention: land{N}-{scene-slug}.jpg

    Strategy:
     1. Try the exact filename first.
     2. Normalise: replace first underscore (after landN) with a hyphen â†’ try again.
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
            print(f"  [img] {img_ref}  â†  {canonical}")

    if not_found:
        print(f"\n  [WARN] {len(not_found)} images not found in dictionary source:")
        for nf in not_found:
            print(f"         {nf}")

    print(f"[sync] {copied} new images copied ({len(needed)} total referenced).")
    return copied


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# CONTENT.OPF GENERATOR
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def generate_opf(page_refs: list[str], title: str = "SOE Rhythm Quest: The Summer Stretch Workbook"):
    """Dynamically build content.opf with a full manifest and spine."""

    # Static pages (always present)
    static = ["nav.xhtml", "cover.xhtml", "frontmatter.xhtml", "weekly_overview.xhtml"]
    backmatter = ["backmatter/bm_achievement.xhtml",
                  "backmatter/bm_glossary.xhtml",
                  "backmatter/bm_parent_guide.xhtml"]

    manifest_lines = [
        '    <item id="css-workbook" href="styles/workbook.css" media-type="text/css"/>',
        '    <item id="cover-img" href="images/ui/cover_art.png" media-type="image/png" properties="cover-image"/>',
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

    # Add all dictionary images to manifest
    for img_path in sorted(DICT_IMG_DEST.glob("*.png")):
        img_id = "dict_" + img_path.stem.replace("-", "_")
        manifest_lines.append(
            f'    <item id="{img_id}" href="images/dictionary/{img_path.name}" media-type="image/png"/>'
        )

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    opf_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
         version="3.0"
         unique-identifier="uid"
         xml:lang="en">

  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">soe-summer-bridge-workbook-2025</dc:identifier>
    <dc:title>{_safe_xml(title)}</dc:title>
    <dc:creator>The Sound of Essentials Team</dc:creator>
    <dc:language>en</dc:language>
    <dc:subject>Education; Summer Learning; ESOL; Early Childhood; Elementary</dc:subject>
    <dc:description>A neuro-affirming, bilingual-ready 8-week The Summer Stretch workbook set in the 7 Lands of the SOE universe. 15 minutes of daily cross-curricular activities for grades Kâ€“3.</dc:description>
    <dc:rights>Copyright The Sound of Essentials Team. All rights reserved.</dc:rights>
    <meta property="dcterms:modified">{date_str}</meta>
    <meta name="cover" content="cover-img"/>
  </metadata>

  <manifest>
{chr(10).join(manifest_lines)}
  </manifest>

  <spine page-progression-direction="ltr">
{chr(10).join(spine_lines)}
  </spine>

</package>
"""
    OPF_FILE.write_text(opf_content, encoding="utf-8")
    print(f"[opf] content.opf written with {len(page_refs)} activity pages.")


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# EPUB PACKAGER
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def build_epub():
    """Package the workbook directory into a valid EPUB 3 archive."""
    # Ensure mimetype exists (ASCII, no newline)
    if not MIMETYPE_FILE.exists():
        MIMETYPE_FILE.write_bytes(b"application/epub+zip")

    print(f"\n[build] Packaging â†’ {EPUB_OUT.name}")
    with zipfile.ZipFile(EPUB_OUT, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        # CRITICAL: mimetype must be the FIRST entry and UNCOMPRESSED
        zf.write(MIMETYPE_FILE, "mimetype", compress_type=zipfile.ZIP_STORED)

        # META-INF/container.xml
        if META_INF_FILE.exists():
            zf.write(META_INF_FILE, "META-INF/container.xml")

        # All OEBPS content
        oebps_dir = BASE_DIR / "OEBPS"
        for fpath in sorted(oebps_dir.rglob("*")):
            if fpath.is_file():
                arcname = fpath.relative_to(BASE_DIR).as_posix()
                zf.write(fpath, arcname)

    size_mb = EPUB_OUT.stat().st_size / (1024 * 1024)
    print(f"[build] âœ… {EPUB_OUT.name}  ({size_mb:.1f} MB)")


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# NAV.XHTML GENERATOR
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def generate_nav(all_weeks: list, page_refs: list[str]):
    """Create the EPUB 3 navigation document (Table of Contents)."""
    toc_items = [
        '      <li><a href="cover.xhtml">Cover</a></li>',
        '      <li><a href="frontmatter.xhtml">How to Use This Workbook</a></li>',
        '      <li><a href="weekly_overview.xhtml">Summer Quest Calendar</a></li>',
    ]

    day_labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    for week in all_weeks:
        wn = week.get("week", 0)
        theme = week.get("theme", f"Week {wn}")
        day_list = "\n".join(
            f'          <li><a href="week{wn}/day{dn+1}.xhtml">'
            f'Day {dn+1} â€” {day_labels[dn]}</a></li>'
            for dn in range(5)
        )
        toc_items.append(
            f'      <li>\n        <a href="week{wn}/week{wn}_intro.xhtml">'
            f'Week {wn}: {theme}</a>\n        <ol>\n{day_list}\n        </ol>\n      </li>'
        )

    toc_items += [
        '      <li><a href="backmatter/bm_achievement.xhtml">Quest Achievement Chart</a></li>',
        '      <li><a href="backmatter/bm_glossary.xhtml">Workbook Glossary</a></li>',
        '      <li><a href="backmatter/bm_parent_guide.xhtml">Parent &amp; Educator Guide</a></li>',
    ]

    nav_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops"
      lang="en" xml:lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Table of Contents â€” SOE The Summer Stretch Workbook</title>
  <link rel="stylesheet" type="text/css" href="../styles/workbook.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc" aria-label="Table of Contents">
    <h1>Table of Contents</h1>
    <ol>
{chr(10).join(toc_items)}
    </ol>
  </nav>
</body>
</html>
"""
    nav_path = PAGES_DIR / "nav.xhtml"
    nav_path.write_text(nav_content, encoding="utf-8")
    print(f"[nav] nav.xhtml written with {len(all_weeks)} weeks.")


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# MAIN
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def main():
    parser = argparse.ArgumentParser(
        description="SOE The Summer Stretch Workbook â€” EPUB Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_workbook.py                Build all 8 weeks + package EPUB
  python generate_workbook.py --week 1       Build only Week 1 + package
  python generate_workbook.py --no-package   Build XHTML but skip EPUB zip
  python generate_workbook.py --package      Only re-zip existing files
        """
    )
    parser.add_argument("--week",       default="all",  help="Week number (1â€“8) or 'all'")
    parser.add_argument("--package",    action="store_true", help="Package only (skip generation)")
    parser.add_argument("--no-package", action="store_true", help="Generate only (skip packaging)")
    args = parser.parse_args()

    # â”€â”€ Load content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if not CONTENT_FILE.exists():
        print(f"[ERROR] Content file not found: {CONTENT_FILE}")
        sys.exit(1)

    with open(CONTENT_FILE, encoding="utf-8-sig") as f:
        content = json.load(f)

    all_weeks = content.get("weeks", [])
    title     = content.get("title", "SOE Rhythm Quest: The Summer Stretch Workbook")

    # â”€â”€ Select weeks to build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        # â”€â”€ Load template â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        if not TEMPLATE_FILE.exists():
            print(f"[ERROR] Template not found: {TEMPLATE_FILE}")
            sys.exit(1)
        template = TEMPLATE_FILE.read_text(encoding="utf-8")

        # â”€â”€ Generate day pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        all_page_refs = []
        PAGES_DIR.mkdir(parents=True, exist_ok=True)

        for week in weeks_to_build:
            wn = week.get("week", 0)
            if not week.get("days"):
                print(f"[skip] Week {wn} â€” no days defined yet.")
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
                print(f"[gen] Week {wn} Â· Day {dn} ({day_data.get('day_label','')}) â†’ {filename}")

        # Sync images and update the manifest
        sync_dictionary_images(all_weeks)
        generate_nav(all_weeks, all_page_refs)
        generate_opf(all_page_refs, title)

    # â”€â”€ Package â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if not args.no_package:
        build_epub()

    print("\nâœ… SOE The Summer Stretch Workbook â€” build complete!")
    print(f"   Output: {EPUB_OUT}")


if __name__ == "__main__":
    main()

