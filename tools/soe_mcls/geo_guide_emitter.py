"""
SOE-MCLS Pillar 1 -> Organic GEO/AEO 4th Emitter (`geo_guide_emitter.py`)

Compiles verified MCLS Pulse Briefs (`The Vault/Marketing/MCLS_Pulse_YYYY-MM-DD.md`)
into sovereign, prerender-ready GEO/AEO Guides in `web/src/data/geoGuides.json`.

Enforces:
  1. SOE Helix Gate 1 Canon Invariants (strict Ages 2-7, zero retired entities,
     zero prohibited live-instrumentation claims, zero Shopify, "reserve your copy").
  2. SOE 9,249-Study SEO/AEO Execution Blueprint:
     - B1: Long, synonym-dense <title> tags
     - B2: Zero product pricing in SERP <title> or <meta description>
     - B3: Zero emojis in SERP <title> or <meta description>
     - C1: Paragraph 1 Direct Answer (+280% AI citations)
     - C2: Discrete Subject-Predicate-Object fact bullets (5x AI citations)
     - C3: Inline parenthetical ECE/neuro citations (+40% citations)
     - C4: Explicit Author Byline (+113% citations)
     - D1: Brand Icon CTA block below description (+80% CVR)
     - D3: Deterministic internal links to Land, Hero, Album Track, Workbook, Dictionary
  3. Canonical Visual Lock: Only verified `/assets/characters/*.webp` hero assets.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple


DEFAULT_AUTHOR = {
    "name": "Seriphia & The Sound of Essentials Early Childhood Research Council",
    "jobTitle": "Early Learning Specialists & Pediatric Sound Neuro-Affirming Team",
}

LAND_CANON: Dict[str, Dict[str, Any]] = {
    "harmonia": {
        "land": "Harmonia",
        "landColor": "#d4a843",
        "hero": "Kenji & Aiko",
        "heroTitle": "Mentors of Harmonia",
        "heroImg": "/assets/characters/KENJI.webp",
        "quote": "\"Every word carries a melody. When we train the ear with steady rhythm before flashcards, blending sounds becomes joyful instead of a battle.\"",
        "trackTitle": "Alphabet Song Remix",
        "trackNumber": "Track 03",
        "trackAudio": "03. Alphabet Song Remix.mp3",
        "trackFocus": "Continuous Sound Blending, Phonemic Awareness & Auditory Decoding",
        "relatedSolution": "/solutions/speech-delay-music-activities",
        "relatedGuide": "/guides/acoustic-phonics-vs-rote-worksheets",
        "citations": [
            "Continuous sound blending reduces working-memory overload in beginning readers by connecting phonemes without artificial stop-gaps (Journal of Educational Psychology, 2021).",
            "Rhythmic auditory training directly strengthens neural temporal processing networks required for phonological awareness in ages 2 to 7 (Nature Scientific Reports, 2023).",
            "Short 10 to 15 minute multi-sensory acoustic sessions paired with tactile print rituals outperform passive screen flashcards on long-term word decoding retention (Harvard Center on the Developing Child, 2022).",
            "The Sound of Essentials: Rhythm Quest targets children ages 2 to 7 (Pre-K through Grade 2) with 19 studio-recorded acoustic tracks and ~400 tactile activities across 7 Learning Lands.",
        ],
    },
    "aquaria": {
        "land": "Aquaria",
        "landColor": "#5ba4c9",
        "hero": "Nerissa & Ronan",
        "heroTitle": "Guardians of Aquaria",
        "heroImg": "/assets/characters/NERISSA.webp",
        "quote": "\"Calm focus is never forced through a glowing screen. Steady acoustic rhythm invites a child's nervous system back into safe, unhurried curiosity.\"",
        "trackTitle": "Feelings & Calm Flow",
        "trackNumber": "Track 11",
        "trackAudio": "11. Feelings.mp3",
        "trackFocus": "Sensory Co-Regulation, Print Readiness & Post-Screen Nervous System Reset",
        "relatedSolution": "/solutions/sensory-meltdown-calming",
        "relatedGuide": "/guides/calm-circle-time-transitions",
        "citations": [
            "Rapidly paced tablet apps with variable-reward chimes elevate cortisol and shorten patience for physical print books in preschool-aged children (American Academy of Pediatrics, 2023).",
            "Low-stimulation acoustic music in steady resting tempos (60 to 80 BPM) supports parasympathetic co-regulation and reduces transition meltdowns in ages 2 to 7 (Harvard Center on the Developing Child, 2022).",
            "Tactile book handling, page turning, and pencil-grip routines build fine-motor spatial schemas that touch-screen swiping fails to activate (NAEYC Early Literacy Position Statement, 2022).",
            "The Sound of Essentials pairs 19 screen-free studio-recorded tracks with physical heirlooms including the 8-week Rhythm Ready Workbook and the 4,000+ word Essential Picture Dictionary.",
        ],
    },
    "terrasol": {
        "land": "Terrasol",
        "landColor": "#5fb685",
        "hero": "Vesta & Silas",
        "heroTitle": "Stewards of Terrasol",
        "heroImg": "/assets/characters/VESTA.webp",
        "quote": "\"Real childhood readiness grows like a garden: unhurried rhythm, tactile pages, and human voice rooted in daily sanctuary rituals.\"",
        "trackTitle": "Nature & Seasons Quest",
        "trackNumber": "Track 08",
        "trackAudio": "08. Seasons.mp3",
        "trackFocus": "Screen-Free Sanctuary Habits, Tactile Discovery & Kindergarten Readiness",
        "relatedSolution": "/solutions/screen-free-sensory-learning",
        "relatedGuide": "/guides/calm-circle-time-transitions",
        "citations": [
            "Replacing passive screen routines with 10 to 15 minutes of daily parent-child tactile print and song builds receptive vocabulary and sustained attention (Journal of Developmental & Behavioral Pediatrics, 2022).",
            "Physical picture books foster richer conversational turn-taking between caregivers and children ages 2 to 7 than interactive tablet e-books (Pediatrics, 2021).",
            "Head Start ELOF and NAEYC guidelines prioritize whole-body, multi-sensory discovery across Language, Cognitive, Physical, Science, and Social-Emotional domains.",
            "The Sound of Essentials: Rhythm Quest delivers a 100% screen-free early learning ecosystem anchored by 19 studio-recorded tracks and physical heirloom books.",
        ],
    },
}

HELIX_BANNED_PATTERNS: List[Tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bMarcus\b", re.IGNORECASE), "Retired character Marcus"),
    (re.compile(r"\bElena\b", re.IGNORECASE), "Retired character Elena"),
    (re.compile(r"\bGeometria\b", re.IGNORECASE), "Retired land Geometria"),
    (re.compile(r"\bSophia\b", re.IGNORECASE), "Retired land Sophia"),
    (re.compile(r"\bAges?\s*2\s*[-–—]\s*8\b", re.IGNORECASE), "Age creep (must be strictly Ages 2–7)"),
    (re.compile(r"\bGrade\s*3\b", re.IGNORECASE), "Grade 3 ceiling breach (max Grade 2)"),
    (
        re.compile(r"\blive\s+(instrumentation|instruments?|acoustic\s+instruments?|orchestra|music)\b", re.IGNORECASE),
        "Prohibited live instrumentation/music claim",
    ),
    (re.compile(r"\blive\s+acoustic\b", re.IGNORECASE), "Prohibited live acoustic claim"),
    (re.compile(r"\blive\s+organic\b", re.IGNORECASE), "Prohibited live organic claim"),
    (re.compile(r"\bShopify\b", re.IGNORECASE), "Retired platform Shopify"),
    (re.compile(r"\b4,?232\b"), "Deprecated word count 4,232 (use 4,000+ words)"),
]

EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001F9FF"
    "\U0001FA00-\U0001FAFF"
    "\U00002600-\U000027BF"
    "\uFE0F"
    "]+",
    flags=re.UNICODE,
)

PRICE_PATTERN = re.compile(r"\$\d+(?:\.\d{2})?(?:/\$\d+)?")


def strip_emojis(text: str) -> str:
    return re.sub(r"\s{2,}", " ", EMOJI_PATTERN.sub("", text or "")).strip()


def sanitize_serp_text(text: str) -> str:
    """Enforce Blueprint Rules B2 (zero prices) and B3 (zero emojis) on SERP metadata."""
    cleaned = strip_emojis(text)
    cleaned = PRICE_PATTERN.sub("", cleaned)
    cleaned = re.sub(r"\(\s*(?:digital|print|/|\s)+\s*\)", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip(" -–—|,;:")
    return cleaned


def slugify(text: str) -> str:
    s = strip_emojis(text).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    parts = [p for p in s.split("-") if p]
    return "-".join(parts[:8])


def clean_markdown_inline(text: str) -> str:
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def enforce_canon_guards(payload: Dict[str, Any]) -> None:
    """Raise ValueError if any Helix Gate 1 or SERP Blueprint invariant is breached."""
    serialized = json.dumps(payload, ensure_ascii=False)
    for pattern, reason in HELIX_BANNED_PATTERNS:
        if pattern.search(serialized):
            raise ValueError(f"Helix Gate 1 violation in GEO guide '{payload.get('slug')}': {reason}")

    if re.search(r"\bpre-?sale\b", serialized, flags=re.IGNORECASE):
        raise ValueError(
            f"Canon copy violation in GEO guide '{payload.get('slug')}': use 'reserve your copy' instead of 'pre-sale'"
        )

    for serp_field in ("metaTitle", "metaDescription"):
        val = str(payload.get(serp_field, ""))
        if EMOJI_PATTERN.search(val):
            raise ValueError(f"SERP Rule B3 violation: emoji found in {serp_field}")
        if PRICE_PATTERN.search(val):
            raise ValueError(f"SERP Rule B2 violation: price found in {serp_field}")

    hero_img = str(payload.get("heroImg", ""))
    if not hero_img.startswith("/assets/characters/") or not hero_img.endswith(".webp"):
        raise ValueError(f"Canonical Visual Lock violation: invalid heroImg '{hero_img}'")


def _detect_land_key(topic_text: str) -> str:
    low = topic_text.lower()
    if any(k in low for k in ("harmonia", "phonics", "cvc", "blending", "kenji", "aiko", "guessing", "segmenting")):
        return "harmonia"
    if any(k in low for k in ("aquaria", "meltdown", "dopamine", "tantrum", "nerissa", "ronan", "swipe", "tablet")):
        return "aquaria"
    return "terrasol"


def _extract_delta_label(topic_text: str) -> str:
    match = re.search(r"(Δ[1-5]\s+[A-Za-z][A-Za-z\s.&/-]+?)(?:\*\*|\n|$)", topic_text)
    if match:
        return clean_markdown_inline(match.group(1)).strip(" •*—-")
    low = topic_text.lower()
    if "phonics" in low or "blending" in low or "testing" in low:
        return "Δ2 Testing vs. Arts"
    return "Δ1 Screen vs. Sensory"


def parse_pulse_brief(markdown_text: str, source_filename: str = "MCLS_Pulse.md") -> Dict[str, Any]:
    """Extract date and structured Topic blocks from an MCLS Pulse Brief markdown file."""
    date_match = re.search(r"(\d{4}-\d{2}-\d{2})", source_filename) or re.search(
        r"(\d{4}-\d{2}-\d{2})", markdown_text
    )
    pulse_date = date_match.group(1) if date_match else "2026-11-20"

    topic_splits = re.split(r"(?=^##\s+Topic\s+\d+\s*:)", markdown_text, flags=re.MULTILINE)
    topics: List[Dict[str, Any]] = []

    for chunk in topic_splits[1:]:
        header_match = re.match(r"^##\s+Topic\s+(\d+)\s*:\s*(.+)$", chunk, flags=re.MULTILINE)
        if not header_match:
            continue
        topic_num = int(header_match.group(1))
        raw_title = clean_markdown_inline(header_match.group(2))

        signal_match = re.search(
            r"\*\s+\*\*(?:Live\s+(?:Community|News|Educator|Receipt)[^*]*?):\*\*\s*(.+)",
            chunk,
            flags=re.IGNORECASE,
        )
        signal_text = clean_markdown_inline(signal_match.group(1)) if signal_match else ""

        hook_match = re.search(r"\*\*Wave\s+\d+[^*]*Hook:\*\*\s*(.+)", chunk, flags=re.IGNORECASE)
        hook_text = clean_markdown_inline(hook_match.group(1)) if hook_match else ""

        headline_match = re.search(r"\*\*Headline:\*\*\s*(.+)", chunk, flags=re.IGNORECASE)
        headline_text = clean_markdown_inline(headline_match.group(1)) if headline_match else raw_title

        # Extract 3-Layer Primary Text blockquotes
        layer_section_match = re.search(
            r"\*\*Primary Text \(3-Layer Rule\):\*\*([\s\S]*?)(?=\n###|\n---|\Z)",
            chunk,
            flags=re.IGNORECASE,
        )
        layer_paragraphs: List[str] = []
        if layer_section_match:
            raw_quotes = [
                clean_markdown_inline(ln.strip().lstrip(">").strip())
                for ln in layer_section_match.group(1).splitlines()
                if ln.strip().startswith(">")
            ]
            layer_paragraphs = [p for p in raw_quotes if p]

        email_subject_match = re.search(r"\*\*Subject Line:\*\*\s*(.+)", chunk, flags=re.IGNORECASE)
        email_subject = clean_markdown_inline(email_subject_match.group(1)) if email_subject_match else ""

        topics.append(
            {
                "topic_num": topic_num,
                "raw_title": raw_title,
                "signal": signal_text,
                "hook": hook_text,
                "headline": headline_text,
                "layers": layer_paragraphs,
                "email_subject": email_subject,
                "delta": _extract_delta_label(chunk),
                "land_key": _detect_land_key(chunk),
            }
        )

    return {
        "source_pulse": source_filename,
        "pulse_date": pulse_date,
        "topics": topics,
    }


def _build_internal_links(land_cfg: Dict[str, Any]) -> List[Dict[str, str]]:
    return [
        {
            "label": f"Stream {land_cfg['trackTitle']} ({land_cfg['trackNumber']}) Free on /listen",
            "url": "/listen?unlocked=true",
            "category": "Free 19-Track Album",
        },
        {
            "label": f"Meet {land_cfg['hero']} & the 7 Learning Lands",
            "url": "/heroes",
            "category": f"Land of {land_cfg['land']}",
        },
        {
            "label": "Explore the 8-Week Rhythm Ready Workbook (40 Days, ~400 Quests)",
            "url": "/rhythm-ready",
            "category": "Tactile Readiness Workbook",
        },
        {
            "label": "Reserve Your Copy of the 4,000+ Word Essential Picture Dictionary",
            "url": "/workbook",
            "category": "Heirloom Reference",
        },
        {
            "label": "Read the Sound-Before-Symbol Neuroscience & Dalcroze Foundations",
            "url": "/science",
            "category": "Pedagogy & Research",
        },
        {
            "label": "Related SOE Early Learning Framework",
            "url": land_cfg["relatedSolution"],
            "category": "Curriculum Solution",
        },
    ]


def compile_pulse_topic_to_geo_guide(
    topic: Dict[str, Any],
    pulse_date: str,
    source_pulse: str,
) -> Dict[str, Any]:
    """Transform a parsed MCLS Pulse topic into a Blueprint-compliant Sovereign GEO Guide."""
    land_cfg = LAND_CANON[topic["land_key"]]
    clean_title = strip_emojis(topic["raw_title"]).replace('"', "").strip()
    slug = slugify(clean_title)
    layers = topic.get("layers") or []

    layer1_problem = (
        layers[0]
        if len(layers) >= 1
        else topic.get("signal")
        or "Young children ages 2 to 7 struggle when passive screens or choppy flashcard drills replace calm auditory rhythm."
    )
    layer2_solution = (
        layers[1]
        if len(layers) >= 2
        else (
            f"Crafted by a father's heart and a mother's love for ages 2–7 (Pre-K to Grade 2), "
            f"The Sound of Essentials: Rhythm Quest pairs 19 studio-recorded acoustic tracks with "
            f"400 tactile quests and a 4,000+ word Essential Picture Dictionary inside the Land of {land_cfg['land']}."
        )
    )
    # Remove any explicit pricing from solution prose when used in meta fields; keep body factual
    meta_title = sanitize_serp_text(
        f"{topic['headline']} | Screen-Free Phonics, Sensory Music & Early Literacy Guide (Ages 2–7) | The Sound of Essentials"
    )
    meta_description = sanitize_serp_text(
        f"{topic['hook'] or topic['headline']} Discover how 10 to 15 minutes of screen-free acoustic rhythm and tactile quests support children ages 2–7 in the Land of {land_cfg['land']}."
    )

    direct_answer = (
        f"{clean_title} is best solved for children ages 2 to 7 by training the auditory ear before heavy print or glowing screens. "
        f"{topic['hook'] + ' ' if topic.get('hook') else ''}"
        f"The Sound of Essentials: Rhythm Quest uses 19 studio-recorded acoustic tracks (60 to 80 BPM) paired with 10 to 15 minute daily tactile print rituals "
        f"guided by {land_cfg['hero']} in the Land of {land_cfg['land']} to build phonemic awareness, calm focus, and genuine print readiness without tablet dependency."
    )

    guide: Dict[str, Any] = {
        "slug": slug,
        "type": "guide",
        "source": "mcls-pulse",
        "sourcePulse": source_pulse,
        "datePublished": pulse_date,
        "dateModified": pulse_date,
        "author": DEFAULT_AUTHOR,
        "badge": f"MCLS Research Field Guide · {land_cfg['land']}",
        "h1": f"{topic['headline']}: {clean_title} (Ages 2–7)",
        "metaTitle": meta_title,
        "metaDescription": meta_description,
        "directAnswer": direct_answer,
        "factBullets": land_cfg["citations"],
        "communitySignal": topic.get("signal") or layer1_problem,
        "delta": topic["delta"],
        "deltaSummary": {
            "problem": layer1_problem,
            "counterTruth": land_cfg["citations"][0],
            "soeSolution": re.sub(r"\bpre-?sale\b", "reserve your copy", layer2_solution, flags=re.IGNORECASE),
        },
        "hero": land_cfg["hero"],
        "heroTitle": land_cfg["heroTitle"],
        "heroImg": land_cfg["heroImg"],
        "land": land_cfg["land"],
        "landColor": land_cfg["landColor"],
        "quote": land_cfg["quote"],
        "trackTitle": land_cfg["trackTitle"],
        "trackNumber": land_cfg["trackNumber"],
        "trackAudio": land_cfg["trackAudio"],
        "trackFocus": land_cfg["trackFocus"],
        "benefits": [
            {
                "title": "10–15 Minute Calm Daily Ritual",
                "desc": "Replaces stressful flashcard battles and post-screen meltdowns with an unhurried kitchen-table or circle-time acoustic routine.",
            },
            {
                "title": "Sound-Before-Symbol Phonemic Architecture",
                "desc": "Wires continuous rhythmic phrasing and syllable awareness before demanding heavy sight-word memorization.",
            },
            {
                "title": "Tactile Physical Heirlooms",
                "desc": "Anchors auditory learning to physical page turning, pencil grip, and 400 hands-on quests across 7 thematic Lands.",
            },
            {
                "title": "Strictly Engineered for Ages 2–7",
                "desc": "Aligned with Toddler, Pre-K, Kindergarten, Grade 1, and Grade 2 milestones alongside Head Start ELOF and NAEYC domains.",
            },
        ],
        "features": [
            "19 Original Studio-Recorded Acoustic Tracks (Zero Subscription Paywall)",
            "40-Day Rhythm Ready Tactile Workbook (~400 Hands-On Activities)",
            "4,000+ Word Essential Picture Dictionary Across 125 Illustrated Scenes (Reserve Your Copy)",
            "Turnkey 10–15 Minute Home & Preschool Circle-Time Ritual Cards",
        ],
        "internalLinks": _build_internal_links(land_cfg),
        "ctaBlock": {
            "eyebrow": "Living Proof Before Any Pitch · Ages 2–7",
            "heading": "Unlock the Complete 19-Track Rhythm Quest Sanctuary Free",
            "body": f"Hear how {land_cfg['hero']} and our 19 studio-recorded acoustic tracks transform 10 daily minutes into calm phonics and print readiness—zero glowing screens required.",
            "buttonText": "Unlock Free 19-Track Album →",
            "buttonUrl": "/listen?unlocked=true",
        },
        "faqs": [
            {
                "q": f"How does The Sound of Essentials address {clean_title.lower()}?",
                "a": direct_answer,
            },
            {
                "q": "What ages is this screen-free rhythm approach designed for?",
                "a": "The Sound of Essentials: Rhythm Quest is strictly designed for children ages 2 to 7 (Toddler, Pre-K, Kindergarten, Grade 1, and Grade 2).",
            },
            {
                "q": "How many minutes a day does a family or preschool need?",
                "a": "Just 10 to 15 calm, screen-free minutes a day pairing one acoustic track with a tactile page or movement prompt is enough to build lasting phonemic and self-regulation habits.",
            },
            {
                "q": "Can parents or educators test the music before ordering physical books?",
                "a": "Yes. All 19 studio-recorded acoustic tracks and our printable First 10 Minutes Tactile Ritual Card are available free at soelearn.com/listen.",
            },
        ],
        "primaryCta": {
            "text": "Unlock Free 19-Track Album",
            "url": "/listen?unlocked=true",
        },
        "secondaryCta": {
            "text": "Explore Rhythm Ready Workbook",
            "url": "/rhythm-ready",
        },
    }

    enforce_canon_guards(guide)
    return guide


def upsert_geo_guides(output_path: Path, new_guides: Sequence[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Idempotently upsert compiled GEO guides by slug, preserving newest-first order."""
    existing: List[Dict[str, Any]] = []
    if output_path.exists():
        raw = output_path.read_text(encoding="utf-8").strip()
        if raw:
            existing = json.loads(raw)

    by_slug: Dict[str, Dict[str, Any]] = {g["slug"]: g for g in existing}
    for guide in new_guides:
        enforce_canon_guards(guide)
        by_slug[guide["slug"]] = guide

    merged = sorted(
        by_slug.values(),
        key=lambda g: (g.get("datePublished", ""), g.get("slug", "")),
        reverse=True,
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(merged, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return merged


def emit_guides_from_pulse_file(pulse_path: Path, output_path: Path) -> List[Dict[str, Any]]:
    """Parse a Pulse markdown brief, compile every valid Topic, and upsert into geoGuides.json."""
    markdown_text = pulse_path.read_text(encoding="utf-8")
    parsed = parse_pulse_brief(markdown_text, source_filename=pulse_path.name)
    if not parsed["topics"]:
        raise ValueError(f"No '## Topic N:' sections found in {pulse_path}")

    compiled = [
        compile_pulse_topic_to_geo_guide(
            topic=t,
            pulse_date=parsed["pulse_date"],
            source_pulse=parsed["source_pulse"],
        )
        for t in parsed["topics"]
    ]
    return upsert_geo_guides(output_path, compiled)


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="SOE-MCLS 4th Emitter: Compile MCLS Pulse Briefs into Sovereign GEO Guides."
    )
    parser.add_argument(
        "--pulse",
        required=True,
        help="Path to an MCLS_Pulse_YYYY-MM-DD.md brief file.",
    )
    parser.add_argument(
        "--out",
        default=str(
            Path(__file__).resolve().parents[2] / "web" / "src" / "data" / "geoGuides.json"
        ),
        help="Destination path for geoGuides.json.",
    )
    args = parser.parse_args(argv)

    pulse_path = Path(args.pulse)
    out_path = Path(args.out)
    guides = emit_guides_from_pulse_file(pulse_path, out_path)
    print(f"✔ Emitted/synced {len(guides)} sovereign GEO guide(s) into {out_path}")
    for g in guides:
        print(f"  - /guides/{g['slug']} ({g['datePublished']} · {g['land']})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
