import os
import json
import re
from typing import List, Dict, Any
from dataclasses import dataclass, field
from soe_haystack.config import haystack_config

@dataclass
class Document:
    """Haystack 2.x standard Document representation."""
    content: str
    id: str
    meta: Dict[str, Any] = field(default_factory=dict)
    score: float = 0.0

# Canonical 19 Published Tracks (Immutable Sovereign Assets)
CANONICAL_TRACK_METADATA: Dict[int, Dict[str, Any]] = {
    1: {"trackNumber": 1, "title": "Sunny Day (intro)", "land": "Terrasol", "domain": "Introduction & Welcome", "tempo": "90 BPM", "meter": "4/4", "desc": "A gentle acoustic sunrise melody welcoming young learners to The Sound of Essentials."},
    2: {"trackNumber": 2, "title": "Days of the Week", "land": "Celestia", "domain": "Time, Cycles & Celestia", "tempo": "100 BPM", "meter": "4/4", "desc": "Elias & Selene sing the seven days, building temporal sequencing and calendar awareness."},
    3: {"trackNumber": 3, "title": "Alphabet Song Remix", "land": "Harmonia", "domain": "Language & Pre-Literacy (Harmonia)", "tempo": "95 BPM", "meter": "4/4", "desc": "Kenji & Aiko bring the ABCs to life with a rhythmic phonics breakdown and sound boundary mapping."},
    4: {"trackNumber": 4, "title": "Horses Interlude", "land": "Terrasol", "domain": "Science, Humor & Terrasol", "tempo": "Spoken Word", "meter": "Free", "desc": "Playful spoken-word auditory discrimination journey through animal sounds guided by humor."},
    5: {"trackNumber": 5, "title": "Le Cheval", "land": "Luminosity", "domain": "Bilingual French-English & Civics (Luminosity)", "tempo": "85 BPM", "meter": "3/4", "desc": "Bilingual French-English tribute to the power, grace, and movement of the horse."},
    6: {"trackNumber": 6, "title": "Lets Stretch", "land": "Vitalis", "domain": "Physical Development & Somatics (Vitalis)", "tempo": "75 BPM", "meter": "4/4", "desc": "Felix & Amara lead deep diaphragmatic breathing and full-body somatic stretching."},
    7: {"trackNumber": 7, "title": "Drill Time", "land": "Vitalis", "domain": "Physical & Gross-Motor Marching (Vitalis)", "tempo": "110 BPM", "meter": "4/4", "desc": "Motivating cadence march and physical shakeout drill releasing adrenaline through gross-motor stomping."},
    8: {"trackNumber": 8, "title": "Numbers", "land": "Numeria", "domain": "Early Mathematics & Numeria", "tempo": "90 BPM", "meter": "4/4", "desc": "Kwame & Octavia count to 10 with rhythmic call-and-response handclaps for one-to-one correspondence."},
    9: {"trackNumber": 9, "title": "My Body", "land": "Terrasol", "domain": "Anatomy, Health & Terrasol", "tempo": "95 BPM", "meter": "4/4", "desc": "Athena & Ezra guide somatic body-part identification from face to toes with rhythmic cadence."},
    10: {"trackNumber": 10, "title": "Manners", "land": "Harmonia", "domain": "Social-Emotional Courtesy (Harmonia)", "tempo": "85 BPM", "desc": "Aiko teaches the language of social grace: please, thank you, you're welcome, and excuse me."},
    11: {"trackNumber": 11, "title": "Time", "land": "Celestia", "domain": "Time, Daily Routines & Bedtime (Celestia)", "tempo": "90 BPM", "meter": "4/4", "desc": "Elias & Selene explore morning waking, afternoon play, and evening bedtime transitions."},
    12: {"trackNumber": 12, "title": "Changes", "land": "Terrasol", "domain": "Weather, Science & Terrasol", "tempo": "80 BPM", "desc": "Soulful reflection on changing weather patterns, rain, snow, and the constancy of unconditional love."},
    13: {"trackNumber": 13, "title": "One hundred", "land": "Numeria", "domain": "Advanced Counting & Numeria", "tempo": "100 BPM", "desc": "Octavia counts all the way to 100 in rhythmic decuple sets of ten."},
    14: {"trackNumber": 14, "title": "The Ocean", "land": "Terrasol", "domain": "Sensory Calm, Nature & Terrasol", "tempo": "60 BPM", "meter": "4/4", "desc": "Immersive acoustic ocean-wave soundscape for deep calming, vagus nerve rest, and soothing co-regulation."},
    15: {"trackNumber": 15, "title": "Hard Words", "land": "Aquaria", "domain": "Phonemic Articulation & Aquaria", "tempo": "85 BPM", "desc": "Ronan & Nerissa tackle multisyllabic vocabulary with slow, rhythmic articulation drills."},
    16: {"trackNumber": 16, "title": "Shapes", "land": "Terrasol", "domain": "Spatial Geometry & Terrasol", "tempo": "95 BPM", "meter": "4/4", "desc": "Silas & Vesta discover circles, squares, triangles, trapezoids, and spheres in the physical world."},
    17: {"trackNumber": 17, "title": "Months of the Year", "land": "Celestia", "domain": "Annual Calendar Cycles & Celestia", "tempo": "95 BPM", "meter": "4/4", "desc": "Elias guides children through all 12 calendar months in an unforgettable melodic sequence."},
    18: {"trackNumber": 18, "title": "Rain", "land": "Terrasol", "domain": "Sensory Co-Regulation & Terrasol", "tempo": "70 BPM", "meter": "4/4", "desc": "Gentle falling raindrops cleansing the atmosphere, ideal for calming transitions and bedtime winding down."},
    19: {"trackNumber": 19, "title": "After the Storm (outro)", "land": "Terrasol", "domain": "Resolution & Sanctuary (Terrasol)", "tempo": "65 BPM", "meter": "4/4", "desc": "Serene closing acoustic outro reassuring children that calm, warmth, and rainbow light follow every storm."},
}

class SOEKnowledgeIndexer:
    """Indexes canonical SOE ecosystem data into typed Haystack Document representations."""

    def __init__(self, data_dir: str = None):
        self.data_dir = data_dir or haystack_config.DATA_DIR

    def load_json_safe(self, filename: str) -> Any:
        path = os.path.join(self.data_dir, filename)
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Warning: could not read {filename}: {e}")
        return None

    def build_track_documents(self) -> List[Document]:
        tracks_file_data = self.load_json_safe("tracks.json") or []
        tracks_by_id = {t.get("id"): t for t in tracks_file_data if isinstance(t, dict)}

        docs = []
        for track_id in range(1, 20):
            canon = CANONICAL_TRACK_METADATA[track_id]
            file_info = tracks_by_id.get(track_id, {})
            lyrics_raw = file_info.get("lyrics") or canon.get("desc")
            lyrics_text = " ".join([f"{k}: {v}" for k, v in lyrics_raw.items()]) if isinstance(lyrics_raw, dict) else str(lyrics_raw or "")

            title = canon["title"]
            land = canon["land"]
            domain = canon["domain"]
            tempo = canon["tempo"]
            meter = canon.get("meter", "4/4")
            desc = canon["desc"]

            content = (
                f"Track #{track_id}: {title} ({land}). "
                f"Domain: {domain}. Tempo: {tempo} {meter}. "
                f"Description: {desc}. "
                f"Lyrics & Call-and-Response: {lyrics_text}"
            )
            meta = {
                "type": "track",
                "id": track_id,
                "track_number": track_id,
                "title": f"Track #{track_id}: {title}",
                "track_title": title,
                "land": land,
                "domain": domain,
                "tempo": tempo,
                "audio_url": f"https://soelearn.com/listen?track={track_id}",
                "age_bracket": "Strictly Ages 2–7",
            }
            docs.append(Document(id=f"track_{track_id}", content=content, meta=meta))
        return docs

    def build_hero_documents(self) -> List[Document]:
        heroes_data = self.load_json_safe("heroes.json") or {}
        heroes_list = []
        if isinstance(heroes_data, dict):
            heroes_list = heroes_data.get("heroes", [])
            seriphia = heroes_data.get("seriphia")
            if seriphia:
                heroes_list.append(seriphia)
        elif isinstance(heroes_data, list):
            heroes_list = heroes_data

        docs = []
        for h in heroes_list:
            content = (
                f"Hero: {h.get('name')} of {h.get('land', 'Sanctuary')}. "
                f"Title: {h.get('title', 'Guide')}. Domain: {h.get('domain', 'Developmental')}. "
                f"Personality & Trait: {h.get('trait', 'Curious and kind')}. "
                f"Bio: {h.get('bio', '')}. Storybook Role: {h.get('role', '')}."
            )
            meta = {
                "type": "hero",
                "id": h.get("id"),
                "name": h.get("name"),
                "land": h.get("land"),
                "domain": h.get("domain"),
                "age_bracket": "Ages 2–7",
            }
            docs.append(Document(id=f"hero_{h.get('id')}", content=content, meta=meta))
        return docs

    def build_land_documents(self) -> List[Document]:
        lands_data = self.load_json_safe("lands.json") or []
        docs = []
        for l in lands_data:
            content = (
                f"Land: {l.get('name')}. Core Developmental Domain: {l.get('domain')}. "
                f"Environment & Vibe: {l.get('description')}. Color Theme: {l.get('color')}."
            )
            meta = {
                "type": "land",
                "id": l.get("id"),
                "name": l.get("name"),
                "domain": l.get("domain"),
                "color": l.get("color"),
                "age_bracket": "Ages 2–7",
            }
            docs.append(Document(id=f"land_{l.get('id')}", content=content, meta=meta))
        return docs

    def build_product_documents(self) -> List[Document]:
        products_data = self.load_json_safe("products.json") or {}
        products_list = products_data.get("products", []) if isinstance(products_data, dict) else (products_data or [])
        docs = []
        for p in products_list:
            content = (
                f"Product: {p.get('name')} (SKU: {p.get('sku')}). "
                f"Price: ${p.get('price_usd')}. "
                f"Description: {p.get('description')}. "
                f"Deliverable Details: {p.get('specifications', '')}. Age Range: Strictly Ages 2–7."
            )
            meta = {
                "type": "product",
                "sku": p.get("sku"),
                "name": p.get("name"),
                "price": p.get("price_usd"),
                "age_bracket": "Ages 2–7",
                "url": f"https://soelearn.com{p.get('landing_path', '/listen')}",
            }
            docs.append(Document(id=f"prod_{p.get('sku')}", content=content, meta=meta))
        return docs

    def build_sensory_lesson_documents(self) -> List[Document]:
        """Core tactile lesson extenders (Screen-free routines, tantrum resets, Head Start ELOF crosswalks).
        All paired music references strictly cite the immutable published 19-track album catalog.
        """
        lessons = [
            {
                "id": "lesson_tantrum_reset_vitalis",
                "title": "10-Minute Sensory Tantrum Reset (Grounding Stomp)",
                "domain": "Social-Emotional & Self-Regulation",
                "land": "Vitalis",
                "track": "Track #7: Drill Time",
                "materials": "Soft pillow, bare feet, acoustic rhythm",
                "procedure": "Put on Track #7: Drill Time (110 BPM march). Have child stomp rhythmic feet in slow 4/4 meter on a soft pillow to physically discharge excess adrenaline. Follow immediately with Track #6: Lets Stretch to transition into gentle diaphragmatic belly breathing.",
                "standards": "Head Start ELOF: P-SE 1, P-SE 2 (Regulates emotions and behaviors); NAEYC Domain 1.",
            },
            {
                "id": "lesson_sound_before_symbols_harmonia",
                "title": "Auditory Ear Mapping Before Letters (Mississippi Phonics Drill)",
                "domain": "Language & Pre-Literacy",
                "land": "Harmonia",
                "track": "Track #3: Alphabet Song Remix",
                "materials": "Wooden spoons, clapping hands",
                "procedure": "Put on Track #3: Alphabet Song Remix. Clap out syllable beats in animals and child's name (/el-e-phant/, /ba-na-na/). Do not show letters first. Let auditory ear map sound boundaries before eye symbol fatigue.",
                "standards": "Head Start ELOF: P-LIT 1, P-LIT 2 (Phonological awareness); Common Core Kindergarten RF.K.2.",
            },
            {
                "id": "lesson_tactile_counting_numeria",
                "title": "Tactile Seed & Stone Counting (Sensory Math)",
                "domain": "Cognitive & Early Mathematics",
                "land": "Numeria",
                "track": "Track #8: Numbers",
                "materials": "Acorns, dry pinto beans, or smooth stones",
                "procedure": "Place 5 to 10 stones on a cloth. Play Track #8: Numbers. Move each stone with pincer tripod grasp on every call-and-response count clap. Builds one-to-one correspondence physically.",
                "standards": "Head Start ELOF: P-MATH 1 (Counts with one-to-one correspondence); NAEYC Cognitive Domain.",
            },
            {
                "id": "lesson_calm_bedtime_ocean",
                "title": "Celestia Bedtime Co-Regulation & Vagus Nerve Calm",
                "domain": "Physical Development & Rest",
                "land": "Celestia & Terrasol",
                "track": "Track #14: The Ocean",
                "materials": "Dim light, soft blanket, warm presence",
                "procedure": "Dim room lights to amber tone. Play Track #14: The Ocean (or Track #18: Rain) at a gentle 60 BPM resting pulse. Invite child to rest their hands on caregiver's chest, practicing slow 4-count breathing to soothe the vagus nerve before sleep.",
                "standards": "Early Childhood Sleep & Sensory Regulation Standards; Vagus nerve co-regulation.",
            },
            {
                "id": "lesson_evening_routine_celestia",
                "title": "Evening Winding Down & Daily Rhythm Check",
                "domain": "Time, Daily Routines & Celestia",
                "land": "Celestia",
                "track": "Track #11: Time",
                "materials": "Storybook, calm bedside lighting",
                "procedure": "Play Track #11: Time ('Is it in the evening and you're getting ready for bed?'). Sing along while transitioning from evening cleanup to bedtime, providing predictable acoustic cues.",
                "standards": "Head Start ELOF: P-ATL 2 (Maintains routines and transitions).",
            },
        ]
        docs = []
        for l in lessons:
            content = (
                f"Tactile Lesson Extender: {l['title']}. Domain: {l['domain']} ({l['land']}). "
                f"Paired Audio Track: {l['track']}. Materials: {l['materials']}. "
                f"Step-by-Step Procedure: {l['procedure']}. "
                f"Educational & Institutional Standards Alignment: {l['standards']}. Ages: 2–7."
            )
            meta = {
                "type": "lesson_extender",
                "id": l["id"],
                "title": l["title"],
                "domain": l["domain"],
                "land": l["land"],
                "track": l["track"],
                "standards": l["standards"],
                "age_bracket": "Ages 2–7",
            }
            docs.append(Document(id=l["id"], content=content, meta=meta))
        return docs

    def get_all_documents(self) -> List[Document]:
        all_docs = []
        all_docs.extend(self.build_track_documents())
        all_docs.extend(self.build_hero_documents())
        all_docs.extend(self.build_land_documents())
        all_docs.extend(self.build_product_documents())
        all_docs.extend(self.build_sensory_lesson_documents())
        return all_docs
