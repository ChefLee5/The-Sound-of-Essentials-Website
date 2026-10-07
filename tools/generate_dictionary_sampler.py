"""
Generate SOE Picture Dictionary VIP Pre-Sale Sampler PDF
Creates an authentic, beautiful multi-scene sampler for pre-sale customers.
"""

import sys
from pathlib import Path
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\The-Sound-of-Essentials-Eco-System")
PUBLIC_DIR = ROOT_DIR / "web" / "public"
DICT_DIR = PUBLIC_DIR / "assets" / "dictionary"
OUT_PDF = PUBLIC_DIR / "downloads" / "SOE_Picture_Dictionary_Sampler.pdf"

scenes = [
    ("Celestia: Solar System & Cosmic Wonder", DICT_DIR / "land7-the-solar-system.png"),
    ("Harmonia: Musical Instruments & Acoustic Foundations", DICT_DIR / "land1-music-instruments.png"),
    ("Numeria: Shapes, Geometry & Patterns", DICT_DIR / "land2-shapes-geometry.png"),
    ("Numeria: Time, Clocks & Daily Cycles", DICT_DIR / "land2-time-clocks.png"),
    ("Terrasol: The Sensory Garden & Plant Life", DICT_DIR / "land3-the-garden.png"),
    ("Terrasol: Wildlife & Animal Habits", DICT_DIR / "land3-wild-animals.png"),
    ("Ventura: Compass Directions & Spatial Navigation", DICT_DIR / "land4-directions-navigation.png"),
    ("Ventura: Seasons & Natural Rhythms", DICT_DIR / "land4-seasons-nature-cycles.png"),
    ("Vitalis: Somatic Exercise & Body Coordination", DICT_DIR / "land5-exercise-movement.png"),
    ("Vitalis: Fresh Produce Market & Nutrition", DICT_DIR / "land5-the-produce-market.png"),
    ("Luminosity: Community Helpers & Public Services", DICT_DIR / "land6-community-helpers-services.png"),
    ("Luminosity: Civic Governance & Cooperation", DICT_DIR / "land6-government-civics.png"),
    ("Backmatter: American Sign Language (ASL) Alphabet", DICT_DIR / "back_asl_alphabet-asl-alphabet-am.png"),
    ("Parent/Teacher Guide: Classroom Language & Commands", DICT_DIR / "back_parent_teacher-classroom-language-commands.png"),
]

doc = pymupdf.open()

# Page dimensions: 11 x 8.5 landscape (792 x 612 pts)
PAGE_W, PAGE_H = 792, 612

# 1. Title / Cover Page
title_page = doc.new_page(width=PAGE_W, height=PAGE_H)
title_page.draw_rect(pymupdf.Rect(0, 0, PAGE_W, PAGE_H), color=None, fill=(0.99, 0.97, 0.94)) # Cream

# Title Text
title_page.insert_text(
    (54, 120),
    "THE SOUND OF ESSENTIALS",
    fontsize=18,
    color=(0.90, 0.45, 0.05), # Orange
)
title_page.insert_text(
    (54, 180),
    "Essential Picture Dictionary",
    fontsize=36,
    color=(0.12, 0.14, 0.18),
)
title_page.insert_text(
    (54, 220),
    "Official VIP Pre-Sale Curriculum Sampler (Ages 2–7 · Pre-K to Grade 2)",
    fontsize=16,
    color=(0.35, 0.38, 0.45),
)

desc_text = (
    "Welcome to your exclusive preview of the Sound of Essentials Essential Picture Dictionary!\n\n"
    "This sampler provides a curated preview of the upcoming 125-scene, 4,232-word visual\n"
    "encyclopedia across all Seven Lands of the SOE universe. Handcrafted specifically for the\n"
    "developing brain (Ages 2–7), each page pairs thematic scene vocabulary with sound-before-symbol\n"
    "phonetic scaffolding, multi-sensory co-regulation, and hero mentorship.\n\n"
    "What's Inside This VIP Sampler:\n"
    "  • Curated Illustrated Scenes spanning Celestia, Harmonia, Numeria, Terrasol, Ventura, Vitalis, and Luminosity\n"
    "  • Core Vocabulary Guides for classroom, home, nature, and community life\n"
    "  • American Sign Language (ASL) & Parent/Teacher Bilingual Implementation Guides\n\n"
    "Your full digital and print copies will be delivered automatically upon completion of the master edition.\n"
    "Staying on the path. Always learning."
)
title_page.insert_text((54, 270), desc_text, fontsize=12, color=(0.20, 0.22, 0.26))

# 2. Add each scene
for label, img_path in scenes:
    if img_path.exists():
        page = doc.new_page(width=PAGE_W, height=PAGE_H)
        page.draw_rect(pymupdf.Rect(0, 0, PAGE_W, PAGE_H), color=None, fill=(0.98, 0.98, 0.98))
        
        # Header banner
        page.draw_rect(pymupdf.Rect(0, 0, PAGE_W, 44), color=None, fill=(1.0, 0.44, 0.0)) # SOE Orange
        page.insert_text((30, 28), f"SOE PICTURE DICTIONARY SAMPLER — {label.upper()}", fontsize=11, color=(1, 1, 1))
        
        # Insert image centered in remaining space (y from 48 to 580)
        img_rect = pymupdf.Rect(30, 54, PAGE_W - 30, PAGE_H - 24)
        page.insert_image(img_rect, filename=str(img_path), keep_proportion=True)

# Save output
doc.save(str(OUT_PDF), garbage=4, deflate=True)
doc.close()

size_mb = OUT_PDF.stat().st_size / (1024 * 1024)
print(f"Generated {OUT_PDF.name}: {len(scenes) + 1} pages, {size_mb:.2f} MB")
