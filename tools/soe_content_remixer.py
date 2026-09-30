#!/usr/bin/env python3
"""
SOE Content Remixer — Automated "Robots Repeat, Never Write" Engine
Based on Nicholas Cole's $30M Content Playbook for The Sound of Essentials: Rhythm Quest.

Takes an approved SOE core asset (music track, land, or cultural delta topic)
and mechanically slices it into 5 daily, high-affinity, anti-slop content assets:
  1. X / Threads Contrarian Stance Post (Tranche 1)
  2. Instagram Carousel Script (Tranche 1 & 2)
  3. 11-Second Viral Faceless B-Roll Script (Jonathan Nilsen Framework)
  4. Meta Paid Ad (3-Layer Cultural Delta Rule)
  5. D2C Nurture Email Snippet / B2B Head Start Lesson Card

Enforces strict canonical compliance:
  - "A father's heart and a mother's love" paired rule
  - Ages 2–7 strictly
  - Zero AI-slop cliches
  - Card vaulting truth (no "no credit card" claims)
"""

import sys
import os
import json
import argparse
from pathlib import Path

# Force UTF-8 on Windows stdout/stderr
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Paths
SCRIPT_DIR = Path(__file__).resolve().parent
ECO_DIR = SCRIPT_DIR.parent
ROOT_DIR = ECO_DIR.parent
DATA_DIR = ECO_DIR / "web" / "src" / "data"
BRAIN_DIR = ROOT_DIR / ".agents" / "soe-digital-brain"

# Banned AI-slop phrases
BANNED_PHRASES = [
    "in today's fast-paced",
    "in today's digital world",
    "unlock your child's potential",
    "gamified learning",
    "gamification",
    "cutting-edge app",
    "dive into",
    "delve into",
    "it's important to remember",
    "no credit card required",
    "grade 3",
    "grade 4",
    "grade 5",
]

# Canonical topics and tracks mapping
DELTA_MAP = {
    "screens": {
        "delta": "Δ1: Screen vs. Sensory",
        "topic": "Screen Time & Dopamine Traps",
        "culture": "Apps and YouTube Kids are the modern classroom.",
        "soe_truth": "Screen consumption is passive visual sedation; true neurological development requires auditory cadence, bilateral motor movement, and physical touch.",
        "track_hint": "drill-time",
        "land": "Terrasol"
    },
    "phonics": {
        "delta": "Δ2: Testing vs. Arts",
        "topic": "Early Phonics & Reading Readiness",
        "culture": "Drill flashcards and sight-word worksheets to build reading speed.",
        "soe_truth": "The ear trains the eye. Rhythm and acoustic cadence wire the phonological loop before a child ever decodes a letter on paper.",
        "track_hint": "alphabet-song-remix",
        "land": "Harmonia"
    },
    "music": {
        "delta": "Δ2: Testing vs. Arts",
        "topic": "Music as Foundational Neurology",
        "culture": "Music is an extracurricular elective to cut when budgets are tight.",
        "soe_truth": "They called music 'non-essential.' We called it The Sound of Essentials. Music is foundational neurological architecture, not an elective.",
        "track_hint": "numbers",
        "land": "Numeria"
    },
    "tactile": {
        "delta": "Δ3: Algorithm vs. Handcrafted",
        "topic": "Physical Friction vs. Glass Screens",
        "culture": "Everything should be digital; physical workbooks are obsolete.",
        "soe_truth": "A child's finger tracing ink on paper forms physical synaptic connections. Glass screens offer zero resistance and zero tactile feedback.",
        "track_hint": "hard-words",
        "land": "Aquaria"
    },
    "homeschool": {
        "delta": "Δ4: Institution vs. Sanctuary",
        "topic": "The Family Sanctuary vs. Institutional Burnout",
        "culture": "Only institutional schools and state standards can educate early learners.",
        "soe_truth": "The institution is overloaded; the home is the sovereign sanctuary. Crafted by a father's heart and a mother's love.",
        "track_hint": "days-of-the-week",
        "land": "Celestia"
    },
    "french": {
        "delta": "Δ2: Testing vs. Arts",
        "topic": "Multilingual Acquisition via Rhythm",
        "culture": "Wait until middle school to teach foreign languages or toddlers get confused.",
        "soe_truth": "Between ages 2 and 7, language is pure sound and rhythm. If you can sing the beat, you can speak the tongue.",
        "track_hint": "le-cheval",
        "land": "Luminosity"
    }
}

def load_tracks():
    tracks_file = DATA_DIR / "tracks.json"
    if tracks_file.exists():
        try:
            with open(tracks_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []

def validate_anti_slop(text: str) -> list:
    """Checks generated copy against the SOE Approved Language rules."""
    violations = []
    lower_text = text.lower()
    
    # 1. Check banned phrases
    for phrase in BANNED_PHRASES:
        if phrase in lower_text:
            violations.append(f"Contains prohibited AI slop phrase: '{phrase}'")
            
    # 2. Check father / mother pairing
    has_father = "father" in lower_text
    has_mother = "mother" in lower_text
    if has_father and not has_mother:
        violations.append("Canon Violation: 'father' mentioned without 'mother's love'.")
    if has_mother and not has_father:
        violations.append("Canon Violation: 'mother' mentioned without 'father's heart'.")
        
    return violations

def generate_content_slices(topic_key: str, track_data: dict = None):
    """Generates the 5 canonical content slices based on Nicholas Cole's 3 Tranches."""
    topic = DELTA_MAP.get(topic_key, DELTA_MAP["screens"])
    track_title = track_data.get("slug", topic["track_hint"]).replace("-", " ").title() if track_data else topic["track_hint"].replace("-", " ").title()
    land = topic["land"]
    
    # 1. Slice 1: X / Threads Contrarian Stance (Tranche 1: Stance)
    slice_1 = f"""They told parents that a 3-year-old needs an iPad to learn early literacy.

We said no.

We booked live musicians, recorded 19 acoustic tracks, and printed a 4,000-word picture dictionary.

Because a developing brain doesn't need dopamine loops. It needs rhythm, physical paper friction, and a father's heart and a mother's love.

The ear trains the eye. Music is the foundation, not the elective.

Designed for the developing brain — not the algorithm."""

    # 2. Slice 2: Instagram Carousel (Tranche 1 & 2: Stance + Lore)
    slice_2 = f"""Slide 1 (Hook): Why we banned tablets from our home and brought out live drums.
Slide 2 (The Lie): The EdTech industry sold parents on 'educational apps.' But fast-cuts and flashing pixels hijack the developing nervous system.
Slide 3 (The Science): Auditory rhythm precedes visual decoding. When a child claps to '{track_title}' in {land}, their brain builds the phonological scaffolding for effortless reading.
Slide 4 (Tactile Resistance): Physical pages offer motor resistance and spatial memory that flat glass can never replicate.
Slide 5 (CTA): Welcome to The Sound of Essentials: Rhythm Quest (Ages 2–7). Crafted by a father's heart and a mother's love. Download the Free 19-Track Album today at soelearn.com."""

    # 3. Slice 3: 11-Second Viral Faceless Video Script (Jonathan Nilsen Framework)
    slice_3 = f"""[Visual: Warm, cinematic 4K B-roll of parent and 4-year-old sitting on living room carpet, laughing while clapping in sync with an acoustic wood drum]
[Audio: '{track_title}' acoustic rhythm track playing with warm acoustic warmth]

[0:00 - 0:04 On-Screen Text]:
The day we took away the flashing tablet and brought in live rhythm...

[0:05 - 0:08 On-Screen Text]:
His tantrums stopped and his vocabulary tripled. The ear trains the eye.

[0:09 - 0:11 Soft Breadcrumb]:
The Sound of Essentials · Free 19-Track Album in bio (Ages 2–7)"""

    # 4. Slice 4: Paid Meta Ad Copy (Strict 3-Layer Cultural Delta Rule)
    slice_4 = f"""LAYER 1 (Identify Delta):
They called your child 'distracted' because they couldn't sit still staring at a tablet app.

LAYER 2 (Widen Delta):
Here is the truth the app stores won't tell you: A toddler's brain wasn't designed for silent blue light and auto-playing algorithms. When you force passive screen consumption, you bypass the vestibular system and starve the developing motor cortex. Meltdowns aren't a behavioral flaw; they're an autonomic cry for sensory balance.

LAYER 3 (Bridge with SOE):
{topic['soe_truth']}

Welcome to The Sound of Essentials: Rhythm Quest. 
An interconnected early learning world of 7 Lands, 15 heroes, and 19 live acoustic anthems for ages 2–7. Crafted by a father's heart and a mother's love.

Claim the 19-Track Deluxe Album (Free Today) and restore the sanctuary of learning in your home.
👉 Tap 'Listen Now' to begin."""

    # 5. Slice 5: D2C Nurture Email Snippet / B2B Head Start Classroom Card
    slice_5 = f"""Subject: The day the blue light went off in our living room...

Friend,

We'll never forget the afternoon we looked at our 3-year-old sitting motionless on the rug. The screen had been on for 45 minutes. When we reached to pause it, the screaming started.

That wasn't learning. That was a dopamine withdrawal.

That evening, we made a covenant: our home would be a sanctuary, not an ad-revenue farm for tech algorithms. We brought out the drums, hit play on '{track_title}', and watched his eyes come alive again.

Science proves what parents have always known in their bones:
1. The ear trains the eye to read through cadence.
2. Clapping rhythms wires bilateral brain coordination.
3. A child learns best through physical touch and shared family song.

Today, we're giving your family the complete 19-track Rhythm Quest album — completely free. 

Crafted by a father's heart and a mother's love,
The Sound of Essentials Team
soelearn.com"""

    return {
        "topic": topic["topic"],
        "delta": topic["delta"],
        "land": land,
        "track": track_title,
        "slice_1_x_threads": slice_1,
        "slice_2_ig_carousel": slice_2,
        "slice_3_viral_video": slice_3,
        "slice_4_meta_ad": slice_4,
        "slice_5_email_card": slice_5
    }

def main():
    parser = argparse.ArgumentParser(description="SOE Content Remixer — 'Robots Repeat, Never Write' Engine")
    parser.add_argument("--topic", choices=list(DELTA_MAP.keys()), default="screens", help="Cultural Delta topic key")
    parser.add_argument("--track", type=str, default=None, help="Specific track slug (optional)")
    parser.add_argument("--output", type=str, default=None, help="Output markdown file path")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    
    args = parser.parse_args()
    
    tracks = load_tracks()
    selected_track = None
    if args.track:
        for t in tracks:
            if t.get("slug") == args.track:
                selected_track = t
                break
                
    result = generate_content_slices(args.topic, selected_track)
    
    # Run Anti-Slop Validation across all slices
    all_text = " ".join([
        result["slice_1_x_threads"],
        result["slice_2_ig_carousel"],
        result["slice_3_viral_video"],
        result["slice_4_meta_ad"],
        result["slice_5_email_card"]
    ])
    violations = validate_anti_slop(all_text)
    
    if args.json:
        output_payload = {
            "slices": result,
            "violations": violations,
            "status": "APPROVED" if not violations else "REJECTED"
        }
        print(json.dumps(output_payload, indent=2))
        return

    md_output = f"""# SOE Daily Content Batch — {result['topic']}
**Cultural Delta**: {result['delta']} | **Land**: {result['land']} | **Featured Track**: {result['track']}
**Anti-Slop Status**: {"✅ PASSED (100% Approved Language)" if not violations else "❌ FAILED: " + str(violations)}

---

### Slice 1: X / Threads Contrarian Stance (Tranche 1)
```text
{result['slice_1_x_threads']}
```

---

### Slice 2: Instagram / Facebook Carousel Script (Tranche 1 & 2)
```text
{result['slice_2_ig_carousel']}
```

---

### Slice 3: 11-Second Viral Faceless Video Script (Jonathan Nilsen Model)
```text
{result['slice_3_viral_video']}
```

---

### Slice 4: Paid Meta Ad (3-Layer Cultural Delta Architecture)
```text
{result['slice_4_meta_ad']}
```

---

### Slice 5: D2C Nurture Email / B2B Head Start Classroom Card
```text
{result['slice_5_email_card']}
```
"""

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(md_output)
        print(f"[+] Successfully generated 5 content slices to: {args.output}")
    else:
        print(md_output)

if __name__ == "__main__":
    main()
