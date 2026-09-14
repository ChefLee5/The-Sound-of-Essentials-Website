#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
 SOE RHYTHM QUEST: ESSENTIAL PICTURE DICTIONARY
 Markdown → XHTML Page Generator (Usborne Elevation Suite)
 
 Features:
   • Vertical 7-Land Edge Navigation Ribbon ("Thumb Tabs")
   • Part-of-Speech (POS) Visual Badging ([n.], [v.], [adj.], [prep.], [expr.])
   • "Scan & Sing" Audio Integration linking to soelearn.com/listen
   • "Sound Spotlight" Phonics / Syllable Rhythm Callout
   • "Quest Spot-It Challenge" Visual Search-and-Find Game
   • Full ASL and Bilingual Field Retention
═══════════════════════════════════════════════════════════════
"""

import os
import sys
import re
import html
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

EBOOK_DIR = Path(__file__).parent
CONTENT_DIR = EBOOK_DIR / "content"
PAGES_DIR = EBOOK_DIR / "OEBPS" / "pages"

# ─── Land Configuration ──────────────────────────────────────

LANDS = {
    1: {
        "name": "Harmonia",
        "icon": "🎵",
        "color": "#d4a843",
        "characters": "Kenji &amp; Aiko",
        "char_desc": '<strong>Kenji</strong> the Rhythm Keeper &amp; <strong>Aiko</strong> the Melody Weaver',
    },
    2: {
        "name": "Numeria",
        "icon": "🔢",
        "color": "#7fb685",
        "characters": "Kwame &amp; Octavia",
        "char_desc": '<strong>Kwame</strong> the Pattern Master &amp; <strong>Octavia</strong> the Data Dancer',
    },
    3: {
        "name": "Terrasol",
        "icon": "🌿",
        "color": "#10B981",
        "characters": "Silas &amp; Vesta",
        "char_desc": '<strong>Silas</strong> the Shape Finder &amp; <strong>Vesta</strong> the Space Navigator',
    },
    4: {
        "name": "Aquaria",
        "icon": "🌊",
        "color": "#2563EB",
        "characters": "Ronan &amp; Nerissa",
        "char_desc": '<strong>Ronan</strong> the Wave Rider &amp; <strong>Nerissa</strong> the Deep Diver',
    },
    5: {
        "name": "Vitalis",
        "icon": "❤️",
        "color": "#c4785a",
        "characters": "Felix &amp; Amara",
        "char_desc": '<strong>Felix</strong> the Body Guardian &amp; <strong>Amara</strong> the Wellness Guide',
    },
    6: {
        "name": "Sophia",
        "icon": "⚖️",
        "color": "#5ba4c9",
        "characters": "Ezra &amp; Athena",
        "char_desc": '<strong>Ezra</strong> the Builder &amp; <strong>Athena</strong> the Wise',
    },
    7: {
        "name": "Celestia",
        "icon": "🔭",
        "color": "#9678c4",
        "characters": "Elias &amp; Selene",
        "char_desc": '<strong>Elias</strong> the Star Gazer &amp; <strong>Selene</strong> the Time Keeper',
    },
}

BACK_MATTER = {
    "back_sight_words": {
        "name": "Sight Words & High-Frequency Words",
        "icon": "📖",
        "color": "#e67e22",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
    "back_action_verbs": {
        "name": "Action Verbs Gallery",
        "icon": "💪",
        "color": "#e74c3c",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
    "back_adjectives": {
        "name": "Descriptive Words (Adjectives)",
        "icon": "🎨",
        "color": "#9b59b6",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
    "back_az_index": {
        "name": "A–Z Word Index",
        "icon": "🔤",
        "color": "#2c3e50",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
    "back_visual_glossary": {
        "name": "Visual Glossary",
        "icon": "👁️",
        "color": "#16a085",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
    "back_parent_teacher": {
        "name": "Parent & Teacher Guide",
        "icon": "🍎",
        "color": "#c0392b",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
    "back_asl_alphabet": {
        "name": "ASL Alphabet & Numbers",
        "icon": "🤟",
        "color": "#8B5CF6",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
    "back_asl_essential": {
        "name": "100 Essential ASL Signs",
        "icon": "🤟",
        "color": "#7C3AED",
        "characters": "All Rhythm Quest Heroes",
        "char_desc": '<strong>All Rhythm Quest Heroes</strong>',
        "prefix": "back",
    },
}

# ─── Land Default Spotlights & Spot-It Challenges ────────────

LAND_DEFAULTS = {
    1: {
        "spotlight": "🎵 Syllable Rhythm: Tap your foot or clap your hands to the beat of each syllable in this scene's words! Count the rhythm.",
        "spot_it": "🔍 Quest Challenge: Can you spot where Kenji's rhythm drum or Aiko's melody ribbon is in this scene?"
    },
    2: {
        "spotlight": "🔢 Number Cadence: Count the letters in your favorite word. Is it an odd or an even number?",
        "spot_it": "🔍 Kwame's Quest: Point and count every numbered item in this picture from 1 to 10 as fast as you can!"
    },
    3: {
        "spotlight": "🌿 Sensory Sound: Whisper the word softly like leaves in the wind, then say it strong and clear like singing birds!",
        "spot_it": "🔍 Silas's Shape Hunt: Find 3 things in this illustration that have circles, squares, or natural curves."
    },
    4: {
        "spotlight": "🌊 Ocean Flow: Stretch out the vowel sounds smoothly, rolling like gentle ocean waves on the shore.",
        "spot_it": "🔍 Ronan's Watch: Look closely at the picture—can you find 2 things that travel or move through water or air?"
    },
    5: {
        "spotlight": "❤️ Pulse & Breath: Place your hand on your heart. Take a slow, calm breath in, then say each word on the exhale.",
        "spot_it": "🔍 Felix's Health Check: Spot an item in this scene that keeps your mind, muscles, teeth, or body energized!"
    },
    6: {
        "spotlight": "⚖️ Confident Voice: Stand tall and speak each word with Athena's clear, steady speaking voice.",
        "spot_it": "🔍 Athena's Helper Hunt: Find a helper or a helpful tool in this illustration. What problem are they solving?"
    },
    7: {
        "spotlight": "🔭 Cosmic Echo: Say the word once aloud, then whisper it twice like an echo traveling across the stars.",
        "spot_it": "🔍 Selene's Time Travel: Look at the light and shadows. What time of day is this scene taking place?"
    },
    0: {
        "spotlight": "📖 Word Mastery: Say the word, spell its letters with your fingers, then say the word once more with power!",
        "spot_it": "🔍 Quick Match: Find a word on this page that starts with the same letter as your first name!"
    }
}

# ─── Part of Speech Heuristic Dictionaries ───────────────────

COMMON_VERBS = {
    'say', 'said', 'wave', 'waves', 'bow', 'bows', 'hug', 'hugs', 'smile', 'smiles',
    'walk', 'walks', 'run', 'runs', 'jump', 'jumps', 'skip', 'skips', 'hop', 'hops',
    'eat', 'eats', 'drink', 'drinks', 'sleep', 'sleeps', 'wake', 'wakes', 'wash', 'washes',
    'brush', 'brushes', 'comb', 'combs', 'wear', 'wears', 'dress', 'put', 'take',
    'read', 'reads', 'write', 'writes', 'draw', 'draws', 'paint', 'paints', 'sing', 'sings',
    'dance', 'dances', 'play', 'plays', 'listen', 'listens', 'hear', 'hears', 'look', 'looks',
    'see', 'sees', 'watch', 'watches', 'touch', 'touches', 'feel', 'feels', 'smell', 'smells',
    'taste', 'tastes', 'cook', 'cooks', 'bake', 'bakes', 'cut', 'cuts', 'mix', 'mixes',
    'stir', 'stirs', 'pour', 'pours', 'clean', 'cleans', 'sweep', 'sweeps', 'mop', 'mops',
    'count', 'counts', 'add', 'adds', 'subtract', 'measure', 'measures', 'weigh', 'weighs',
    'build', 'builds', 'fix', 'fixes', 'repair', 'plant', 'plants', 'water', 'waters',
    'grow', 'grows', 'harvest', 'harvests', 'climb', 'climbs', 'swim', 'swims', 'fly', 'flies',
    'drive', 'drives', 'ride', 'rides', 'sail', 'sails', 'stop', 'stops', 'go', 'goes',
    'help', 'helps', 'share', 'shares', 'care', 'cares', 'love', 'loves', 'like', 'likes',
    'learn', 'learns', 'teach', 'teaches', 'study', 'studies', 'work', 'works', 'rest', 'rests',
    'stretch', 'stretches', 'bend', 'bends', 'breathe', 'breathes', 'exercise', 'exercises',
    'open', 'opens', 'close', 'closes', 'push', 'pushes', 'pull', 'pulls', 'lift', 'lifts',
    'carry', 'carries', 'drop', 'drops', 'catch', 'catches', 'throw', 'throws', 'kick', 'kicks',
    'introduce', 'meet', 'greet', 'welcome', 'respect'
}

COMMON_ADJECTIVES = {
    'big', 'small', 'little', 'large', 'tiny', 'huge', 'tall', 'short', 'long',
    'hot', 'cold', 'warm', 'cool', 'sunny', 'rainy', 'windy', 'cloudy', 'stormy',
    'happy', 'sad', 'angry', 'excited', 'calm', 'proud', 'brave', 'kind', 'friendly',
    'polite', 'helpful', 'caring', 'gentle', 'patient', 'curious', 'smart', 'wise',
    'fast', 'slow', 'quick', 'loud', 'quiet', 'silent', 'bright', 'dark', 'shiny',
    'clean', 'dirty', 'fresh', 'sweet', 'sour', 'salty', 'bitter', 'crisp', 'soft',
    'hard', 'rough', 'smooth', 'heavy', 'light', 'strong', 'weak', 'healthy', 'safe',
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
    'gray', 'gold', 'silver', 'first', 'last', 'next', 'new', 'old', 'young', 'fine'
}

COMMON_EXPRESSIONS = {
    'hello', 'goodbye', 'good morning', 'good afternoon', 'good evening', 'good night',
    'please', 'thank you', "you're welcome", 'excuse me', "i'm sorry", 'yes', 'no',
    'welcome', 'nice to meet you', 'how are you?', 'hi', 'see you later'
}

COMMON_PREPOSITIONS = {
    'in', 'on', 'at', 'by', 'for', 'with', 'about', 'above', 'below', 'under', 'over',
    'inside', 'outside', 'between', 'through', 'near', 'far', 'behind', 'in front of',
    'up', 'down', 'across', 'around', 'into', 'onto', 'off', 'out of'
}


def classify_pos(word_str, prefix=None):
    """Classify part of speech with explicit bracket overrides or smart fallback."""
    clean = word_str.strip()
    
    # Check explicit tag in brackets: e.g. "Bow [v]" or "Address [n]"
    tag_match = re.search(r'\[([a-zA-Z]+)\]$', clean)
    if tag_match:
        tag = tag_match.group(1).lower()
        clean_word = clean[:tag_match.start()].strip()
        tag_map = {
            'n': ('n', 'n.'),
            'noun': ('n', 'n.'),
            'v': ('v', 'v.'),
            'verb': ('v', 'v.'),
            'adj': ('adj', 'adj.'),
            'adjective': ('adj', 'adj.'),
            'adv': ('adv', 'adv.'),
            'adverb': ('adv', 'adv.'),
            'prep': ('prep', 'prep.'),
            'preposition': ('prep', 'prep.'),
            'interj': ('expr', 'interj.'),
            'expr': ('expr', 'expr.')
        }
        code, label = tag_map.get(tag, ('n', 'n.'))
        return clean_word, code, label

    # Check back matter prefixes
    if prefix == 'back_action_verbs':
        return clean, 'v', 'v.'
    if prefix == 'back_adjectives':
        return clean, 'adj', 'adj.'

    lower_word = clean.lower().rstrip('?!. ')
    
    if lower_word in COMMON_EXPRESSIONS:
        return clean, 'expr', 'expr.'
    if lower_word in COMMON_PREPOSITIONS:
        return clean, 'prep', 'prep.'
    if lower_word in COMMON_VERBS:
        return clean, 'v', 'v.'
    if lower_word in COMMON_ADJECTIVES:
        return clean, 'adj', 'adj.'
    
    # Common suffix heuristics
    if lower_word.endswith('ly') and len(lower_word) > 4:
        return clean, 'adv', 'adv.'
    if (lower_word.endswith('ful') or lower_word.endswith('less') or lower_word.endswith('ous')) and len(lower_word) > 5:
        return clean, 'adj', 'adj.'

    # Default is noun (primary class for picture dictionaries)
    return clean, 'n', 'n.'


def slugify(text):
    """Convert scene title to a URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s]+', '-', text.strip())
    text = re.sub(r'-+', '-', text)
    return text


def escape_xml(text):
    """Escape text for safe XML embedding."""
    return html.escape(text, quote=True).replace("'", "&#39;")


def parse_markdown(filepath, land_num=0, prefix=None):
    """
    Parse a land markdown file into structured data.
    Returns a list of scenes with words (including POS), tips, Sound Spotlight, and Spot-It challenge.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    scenes = []
    # Split on scene headers: ## Scene N: Title
    scene_blocks = re.split(r'^## Scene \d+:', content, flags=re.MULTILINE)

    for i, block in enumerate(scene_blocks):
        if i == 0:
            continue  # Skip the header before first scene

        lines = block.strip().split('\n')
        scene_title = lines[0].strip()
        scene_number = i

        # Extract description (italic text after title)
        description = ""
        for line in lines[1:]:
            stripped = line.strip()
            if stripped.startswith('*') and stripped.endswith('*'):
                description = stripped.strip('*').strip()
                break

        # Extract vocabulary rows from the table
        words = []
        for line in lines:
            # Match table rows: | num | word | phonetic | context | asl | translation |
            match6 = re.match(
                r'^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*.*\|',
                line.strip()
            )
            match5 = re.match(
                r'^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*.*\|',
                line.strip()
            )
            if match6:
                raw_word = match6.group(2).strip()
                clean_word, pos_code, pos_label = classify_pos(raw_word, prefix)
                words.append({
                    'num': match6.group(1).strip(),
                    'word': raw_word,
                    'clean_word': clean_word,
                    'pos_code': pos_code,
                    'pos_label': pos_label,
                    'phonetic': match6.group(3).strip(),
                    'context': match6.group(4).strip(),
                    'asl': match6.group(5).strip(),
                })
            elif match5:
                raw_word = match5.group(2).strip()
                clean_word, pos_code, pos_label = classify_pos(raw_word, prefix)
                words.append({
                    'num': match5.group(1).strip(),
                    'word': raw_word,
                    'clean_word': clean_word,
                    'pos_code': pos_code,
                    'pos_label': pos_label,
                    'phonetic': match5.group(3).strip(),
                    'context': match5.group(4).strip(),
                    'asl': '',
                })

        # Extract character tip
        tip_text = ""
        tip_character = ""
        tip_icon = "💡"
        for line in lines:
            stripped = line.strip()
            tip_match = re.match(
                r'^>\s*\*\*(.+?)\s+(.+?)[\u2019\']s\s+(?:Final\s+)?Tip:?\*\*\s*\*[\u201c\u201d"\']*(.+?)[\u201c\u201d"\']*\*',
                stripped
            )
            if tip_match:
                tip_icon = tip_match.group(1).strip()
                tip_character = tip_match.group(2).strip() + "'s Tip:"
                tip_text = tip_match.group(3).strip().rstrip('"').rstrip("'").rstrip("*")
                break

        # Extract Sound Spotlight (if in markdown) or use Land default
        sound_spotlight = ""
        spotlight_match = re.search(
            r'^>\s*\*\*.*?Sound\s+Spotlight.*?\*\*\s*\*[\u201c\u201d"\']*(.+?)[\u201c\u201d"\']*\*$',
            block, flags=re.MULTILINE | re.IGNORECASE
        )
        if spotlight_match:
            sound_spotlight = spotlight_match.group(1).strip().rstrip('"').rstrip("'").rstrip("*")
        else:
            default_key = land_num if land_num in LAND_DEFAULTS else 0
            sound_spotlight = LAND_DEFAULTS[default_key]['spotlight']

        # Extract Spot-It Challenge (if in markdown) or use Land default
        spot_it = ""
        spotit_match = re.search(
            r'^>\s*\*\*.*?Spot-?It.*?\*\*\s*\*[\u201c\u201d"\']*(.+?)[\u201c\u201d"\']*\*$',
            block, flags=re.MULTILINE | re.IGNORECASE
        )
        if spotit_match:
            spot_it = spotit_match.group(1).strip().rstrip('"').rstrip("'").rstrip("*")
        else:
            default_key = land_num if land_num in LAND_DEFAULTS else 0
            spot_it = LAND_DEFAULTS[default_key]['spot_it']

        if words:  # Only add scenes that have vocabulary
            scenes.append({
                'scene_number': scene_number,
                'scene_title': scene_title,
                'scene_description': description,
                'words': words,
                'tip_icon': tip_icon,
                'tip_character': tip_character,
                'tip_text': tip_text,
                'sound_spotlight': sound_spotlight,
                'spot_it': spot_it,
            })

    return scenes


def generate_xhtml(land_num, scene, land_config, first_pages, prefix=None):
    """Generate a complete XHTML page for one scene with all Usborne elevation features."""
    slug = slugify(scene['scene_title'])
    if prefix:
        filename = f"{prefix}-{slug}.xhtml"
    else:
        filename = f"land{land_num}-{slug}.xhtml"

    word_count = len(scene['words'])

    # Check if any word in this scene has ASL data
    has_asl = any(w.get('asl', '') for w in scene['words'])

    # Build table rows with Part-of-Speech Badges
    rows = []
    for w in scene['words']:
        asl_cell = f'\n                <td class="col-asl">{escape_xml(w.get("asl", ""))}</td>' if has_asl else ''
        pos_badge = f'<span class="pos-badge pos-{w["pos_code"]}">{w["pos_label"]}</span>'
        rows.append(f"""            <tr>
                <td class="col-num">{escape_xml(w['num'])}</td>
                <td class="col-word">{escape_xml(w['clean_word'])} {pos_badge}</td>
                <td class="col-phonetic">{escape_xml(w['phonetic'])}</td>
                <td class="col-context">{escape_xml(w['context'])}</td>{asl_cell}
                <td class="col-translation"></td>
            </tr>""")

    table_rows = '\n'.join(rows)

    # Character tip section
    tip_html = ""
    if scene['tip_text']:
        tip_html = f"""
        <div class="character-tip">
            <span class="tip-icon">{scene['tip_icon']}</span>
            <p class="tip-character">{escape_xml(scene['tip_character'])}</p>
            <p class="tip-text">"{escape_xml(scene['tip_text'])}"</p>
        </div>"""

    # Learning Suite (Character Tip + Sound Spotlight + Quest Spot-It Challenge)
    learning_suite_html = f"""
    <!-- Learning Suite: Character Tip, Sound Spotlight & Spot-It Challenge -->
    <div class="learning-suite">
{tip_html}
        <div class="sound-spotlight">
            <span class="spotlight-icon">👂</span>
            <div>
                <p class="spotlight-title">Sound Spotlight</p>
                <p class="spotlight-text">{escape_xml(scene['sound_spotlight'])}</p>
            </div>
        </div>
        <div class="spot-it-box">
            <span class="spot-it-icon">🔍</span>
            <div>
                <p class="spot-it-title">Quest Spot-It Challenge</p>
                <p class="spot-it-text">{escape_xml(scene['spot_it'])}</p>
            </div>
        </div>
    </div>"""

    # Illustration — check if actual image exists
    illust_desc = f"A richly detailed scene depicting '{scene['scene_title']}' with numbered callout markers (1\u2013{word_count}) indicating each vocabulary item's location in the scene."
    base_slug = filename.replace('.xhtml', '')
    img_file = PAGES_DIR.parent / 'images' / f'{base_slug}.png'
    if img_file.exists():
        illust_html = f"""
    <!-- Scene Illustration -->
    <div class="scene-illustration">
        <img src="../images/{base_slug}.png" alt="{escape_xml(illust_desc)}" class="scene-image" />
    </div>"""
    else:
        illust_html = f"""
    <!-- Illustration Area -->
    <div class="scene-illustration">
        <div class="placeholder-text">
            \U0001F5BC\uFE0F <strong>Illustration: {escape_xml(scene['scene_title'])}</strong><br />
            {escape_xml(illust_desc)}
        </div>
    </div>"""

    # Edge Navigation Ribbon ("Thumb Tabs")
    edge_tabs = []
    for num in sorted(LANDS.keys()):
        cfg = LANDS[num]
        active_cls = " active" if (not prefix and land_num == num) else ""
        target_file = first_pages.get(num, f"land{num}.xhtml")
        edge_tabs.append(f'            <a href="{target_file}" class="edge-tab{active_cls}" title="Land {num}: {cfg["name"]}">{cfg["icon"]} {num}</a>')
    
    back_active = " active" if prefix else ""
    back_file = first_pages.get('back', 'back_sight_words-group-a-first-steps.xhtml')
    edge_tabs.append(f'            <a href="{back_file}" class="edge-tab{back_active}" title="Back Matter">📚</a>')
    edge_ribbon_html = '\n'.join(edge_tabs)

    # Scan & Sing Audio Header Banner
    if prefix:
        scan_sing_html = f"""
    <!-- Scan & Sing Audio Integration -->
    <div class="scan-and-sing">
        <div class="scan-sing-left">
            <span class="scan-sing-icon">🎵</span>
            <div>
                <p class="scan-sing-title">Scan &amp; Sing: Complete Rhythm Quest Album</p>
                <p class="scan-sing-desc">Stream all 19 tracks on soelearn.com/listen</p>
            </div>
        </div>
        <a href="https://soelearn.com/listen" class="scan-sing-btn" target="_blank">▶ Listen Live</a>
    </div>"""
    else:
        scan_sing_html = f"""
    <!-- Scan & Sing Audio Integration -->
    <div class="scan-and-sing">
        <div class="scan-sing-left">
            <span class="scan-sing-icon">🎵</span>
            <div>
                <p class="scan-sing-title">Scan &amp; Sing: Land {land_num} Soundtrack ({escape_xml(land_config['name'])})</p>
                <p class="scan-sing-desc">Stream the companion rhythm track on soelearn.com/listen</p>
            </div>
        </div>
        <a href="https://soelearn.com/listen?land={land_num}" class="scan-sing-btn" target="_blank">▶ Listen Live</a>
    </div>"""

    xhtml = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">

<head>
    <meta charset="UTF-8" />
    <title>{escape_xml(land_config['name'])} — {escape_xml(scene['scene_title'])}</title>
    <link rel="stylesheet" href="../styles/dictionary.css" type="text/css" />
    <style>
        :root {{
            --accent-color: {land_config['color']};
        }}
    </style>
</head>

<body>
    <div class="page-container">
        <!-- Edge Navigation Ribbon ("Thumb Tabs") -->
        <div class="edge-ribbon">
{edge_ribbon_html}
        </div>

        <!-- Land Header -->
        <div class="land-header">
            <div class="land-number">{'Back Matter' if prefix else f'Land {land_num} of 7'}</div>
            <h1 class="land-name"><span class="land-icon">{land_config['icon']}</span> {escape_xml(land_config['name'])}</h1>
            <p class="land-characters">Guided by {land_config['char_desc']}</p>
        </div>
{scan_sing_html}

        <!-- Scene Header -->
        <div class="scene-header">
            <h2 class="scene-title">Scene {scene['scene_number']}: {escape_xml(scene['scene_title'])}</h2>
            <p class="scene-description">{escape_xml(scene['scene_description'])}</p>
        </div>
{illust_html}

        <!-- Vocabulary Table -->
        <table class="vocab-table{' has-asl' if has_asl else ''}">
            <thead>
                <tr>
                    <th class="col-num">#</th>
                    <th>Word &amp; Class</th>
                    <th>Pronunciation</th>
                    <th>In the Story\u2026</th>
                    {'<th>ASL Sign \U0001F91F</th>' if has_asl else ''}
                    <th>My Language</th>
                </tr>
            </thead>
            <tbody>
{table_rows}
            </tbody>
        </table>
{learning_suite_html}
    </div>
</body>

</html>"""

    return filename, xhtml


def generate_content_opf(all_pages):
    """Generate a complete content.opf with all pages in the manifest and spine."""
    manifest_items = []
    spine_items = []

    # Static items
    manifest_items.append('    <item id="css" href="styles/dictionary.css" media-type="text/css"/>')
    manifest_items.append('    <item id="nav" href="pages/nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>')
    manifest_items.append('    <item id="cover" href="pages/cover.xhtml" media-type="application/xhtml+xml"/>')
    manifest_items.append('    <item id="frontmatter" href="pages/frontmatter.xhtml" media-type="application/xhtml+xml"/>')

    spine_items.append('    <itemref idref="cover"/>')
    spine_items.append('    <itemref idref="frontmatter"/>')

    for page in all_pages:
        item_id = page['filename'].replace('.xhtml', '').replace('-', '_')
        manifest_items.append(f'    <item id="{item_id}" href="pages/{page["filename"]}" media-type="application/xhtml+xml"/>')
        spine_items.append(f'    <itemref idref="{item_id}"/>')

    # Add image manifest items for all scene illustrations
    images_dir = PAGES_DIR.parent / 'images'
    if images_dir.exists():
        for img in sorted(images_dir.iterdir()):
            if img.is_file() and img.suffix.lower() in ('.png', '.jpg', '.jpeg', '.gif', '.svg'):
                img_id = 'img_' + img.stem.replace('-', '_').replace('.', '_')
                media_types = {
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml',
                }
                media_type = media_types.get(img.suffix.lower(), 'image/png')
                manifest_items.append(f'    <item id="{img_id}" href="images/{img.name}" media-type="{media_type}"/>')

    # Compute total word count for description
    total_words = sum(p['word_count'] for p in all_pages)

    # Use current date for modified timestamp
    from datetime import datetime, timezone
    modified_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    opf = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="en">

  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">soe-rhythm-quest-dictionary-2026</dc:identifier>
    <dc:title>SOE Rhythm Quest: Essential Picture Dictionary</dc:title>
    <dc:creator>The Sound of Essentials</dc:creator>
    <dc:language>en</dc:language>
    <dc:description>A {total_words:,}-word picture dictionary mapped to the Oxford Picture Dictionary scope, contextualized in the 7 Lands of the SOE Rhythm Quest universe.</dc:description>
    <dc:rights>© 2026 The Sound of Essentials. All rights reserved.</dc:rights>
    <meta property="dcterms:modified">{modified_date}</meta>
  </metadata>

  <manifest>
{chr(10).join(manifest_items)}
  </manifest>

  <spine>
{chr(10).join(spine_items)}
  </spine>

</package>"""

    return opf


def generate_nav_xhtml(lands_scenes, back_matter_pages=None):
    """Generate the nav.xhtml table of contents."""
    nav_items = []

    for land_num in sorted(lands_scenes.keys()):
        land_config = LANDS[land_num]
        scenes = lands_scenes[land_num]

        scene_links = []
        for page in scenes:
            scene_links.append(f'                <li><a href="{page["filename"]}">{page["scene_title"]}</a></li>')

        nav_items.append(f"""            <li>
                <a href="{scenes[0]['filename']}">{land_config['icon']} Land {land_num}: {land_config['name']}</a>
                <ol>
{chr(10).join(scene_links)}
                </ol>
            </li>""")

    # Back matter navigation
    if back_matter_pages:
        bm_links = []
        for page in back_matter_pages:
            bm_links.append(f'                <li><a href="{page["filename"]}">{page["scene_title"]}</a></li>')
        nav_items.append(f"""            <li>
                <a href="{back_matter_pages[0]['filename']}">📚 Back Matter</a>
                <ol>
{chr(10).join(bm_links)}
                </ol>
            </li>""")

    nav = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Table of Contents</title>
    <link rel="stylesheet" href="../styles/dictionary.css" type="text/css"/>
</head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>Table of Contents</h1>
        <ol>
            <li><a href="cover.xhtml">Cover</a></li>
            <li><a href="frontmatter.xhtml">How to Use This Book</a></li>
{chr(10).join(nav_items)}
        </ol>
    </nav>
</body>
</html>"""

    return nav


def main():
    print("=" * 60)
    print("  XHTML Page Generator (Usborne Elevation Suite)")
    print("  Converting Markdown → XHTML for all 7 Lands & Back Matter")
    print("=" * 60)

    # PASS 1: Parse all scenes and identify first page for each land
    raw_lands_scenes = {}
    first_pages = {}

    for land_num in sorted(LANDS.keys()):
        land_config = LANDS[land_num]
        md_file = CONTENT_DIR / f"land{land_num}_{land_config['name'].lower()}.md"
        if not md_file.exists():
            continue
        scenes = parse_markdown(md_file, land_num=land_num)
        raw_lands_scenes[land_num] = scenes
        if scenes:
            first_pages[land_num] = f"land{land_num}-{slugify(scenes[0]['scene_title'])}.xhtml"

    raw_bm_scenes = {}
    for bm_key, bm_config in BACK_MATTER.items():
        md_file = CONTENT_DIR / f"{bm_key}.md"
        if not md_file.exists():
            continue
        scenes = parse_markdown(md_file, land_num=0, prefix=bm_key)
        raw_bm_scenes[bm_key] = scenes
        if 'back' not in first_pages and scenes:
            first_pages['back'] = f"{bm_key}-{slugify(scenes[0]['scene_title'])}.xhtml"

    # PASS 2: Generate XHTML files with active Edge Ribbons, POS Badges & Scan & Sing
    all_pages = []
    lands_scenes = {}

    for land_num, scenes in raw_lands_scenes.items():
        land_config = LANDS[land_num]
        print(f"\n  📖 Land {land_num}: {land_config['name']} — {len(scenes)} scenes")
        lands_scenes[land_num] = []

        for scene in scenes:
            filename, xhtml_content = generate_xhtml(land_num, scene, land_config, first_pages)

            output_path = PAGES_DIR / filename
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(xhtml_content)

            word_count = len(scene['words'])
            page_info = {
                'filename': filename,
                'land_num': land_num,
                'scene_title': f"Scene {scene['scene_number']}: {scene['scene_title']}",
                'word_count': word_count,
            }
            all_pages.append(page_info)
            lands_scenes[land_num].append(page_info)

    back_matter_pages = []
    for bm_key, scenes in raw_bm_scenes.items():
        bm_config = BACK_MATTER[bm_key]
        print(f"\n  📚 Back Matter: {bm_config['name']} — {len(scenes)} scenes")

        for scene in scenes:
            filename, xhtml_content = generate_xhtml(0, scene, bm_config, first_pages, prefix=bm_key)

            output_path = PAGES_DIR / filename
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(xhtml_content)

            word_count = len(scene['words'])
            page_info = {
                'filename': filename,
                'land_num': 'back',
                'scene_title': scene['scene_title'],
                'word_count': word_count,
            }
            all_pages.append(page_info)
            back_matter_pages.append(page_info)

    # Generate content.opf
    opf_content = generate_content_opf(all_pages)
    opf_path = EBOOK_DIR / "OEBPS" / "content.opf"
    with open(opf_path, 'w', encoding='utf-8') as f:
        f.write(opf_content)
    print(f"\n  ✅ content.opf updated ({len(all_pages)} pages in manifest)")

    # Generate nav.xhtml
    nav_content = generate_nav_xhtml(lands_scenes, back_matter_pages)
    nav_path = PAGES_DIR / "nav.xhtml"
    with open(nav_path, 'w', encoding='utf-8') as f:
        f.write(nav_content)
    print(f"  ✅ nav.xhtml updated (7 lands + back matter, {len(all_pages)} scenes)")

    # Summary
    total_words = sum(p['word_count'] for p in all_pages)
    print(f"\n{'=' * 60}")
    print(f"  ✅ Generated {len(all_pages)} XHTML pages with Usborne Elevation Suite")
    print(f"  📊 Total vocabulary: {total_words} words")
    print(f"  📁 Output: {PAGES_DIR}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
