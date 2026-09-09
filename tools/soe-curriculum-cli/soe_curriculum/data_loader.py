"""
Data loader for SOE tracks, lands, and heroes.
"""

import os
import json
from typing import Dict, List, Optional
from soe_curriculum.models import TrackInfo, LandInfo, HeroInfo

# Canonical fallback tracks if JSON is missing
FALLBACK_TRACKS = [
    {"id": 1, "slug": "sunny-day", "title": "Sunny Day (Intro)", "landId": "terrasol", "color": "#FF6F00", "domainIcon": "☀️"},
    {"id": 2, "slug": "days-of-the-week", "title": "Days of the Week", "landId": "celestia", "color": "#1E88E5", "domainIcon": "📅"},
    {"id": 3, "slug": "alphabet-song-remix", "title": "Alphabet Song Remix", "landId": "harmonia", "color": "#FF6F00", "domainIcon": "🗣️"},
    {"id": 4, "slug": "horses-interlude", "title": "Horses Interlude", "landId": "terrasol", "color": "#9C27B0", "domainIcon": "🎨"},
    {"id": 5, "slug": "le-cheval", "title": "Le Cheval", "landId": "luminosity", "color": "#1E88E5", "domainIcon": "🇫🇷"},
    {"id": 6, "slug": "lets-stretch", "title": "Let's Stretch", "landId": "vitalis", "color": "#4CAF50", "domainIcon": "🤸"},
    {"id": 7, "slug": "drill-time", "title": "Drill Time", "landId": "vitalis", "color": "#4CAF50", "domainIcon": "💪"},
    {"id": 8, "slug": "numbers", "title": "Numbers", "landId": "numeria", "color": "#FF6F00", "domainIcon": "🔢"},
    {"id": 9, "slug": "my-body", "title": "My Body", "landId": "terrasol", "color": "#9C27B0", "domainIcon": "🔬"},
    {"id": 10, "slug": "manners", "title": "Manners", "landId": "harmonia", "color": "#1E88E5", "domainIcon": "🤝"},
    {"id": 11, "slug": "seasons", "title": "Seasons", "landId": "celestia", "color": "#9678c4", "domainIcon": "🍂"},
    {"id": 12, "slug": "months-of-the-year", "title": "Months of the Year", "landId": "celestia", "color": "#1E88E5", "domainIcon": "🗓️"},
    {"id": 13, "slug": "shapes", "title": "Shapes", "landId": "numeria", "color": "#7fb685", "domainIcon": "🔺"},
    {"id": 14, "slug": "colors", "title": "Colors", "landId": "luminosity", "color": "#d4897a", "domainIcon": "🎨"},
    {"id": 15, "slug": "feelings", "title": "Feelings", "landId": "aquaria", "color": "#5ba4c9", "domainIcon": "💙"},
    {"id": 16, "slug": "opposite-words", "title": "Opposite Words", "landId": "harmonia", "color": "#d4a843", "domainIcon": "↔️"},
    {"id": 17, "slug": "time", "title": "Time", "landId": "celestia", "color": "#9678c4", "domainIcon": "⏳"},
    {"id": 18, "slug": "thank-you", "title": "Thank You", "landId": "harmonia", "color": "#d4a843", "domainIcon": "🙏"},
    {"id": 19, "slug": "goodnight-terrasol", "title": "Goodnight Terrasol", "landId": "terrasol", "color": "#5fb685", "domainIcon": "🌙"}
]

FALLBACK_LANDS = [
    {"id": "harmonia", "name": "Harmonia", "icon": "🎵", "color": "#d4a843", "focus": "Language & Early Literacy", "heroes": ["kenji", "aiko"], "duoLabel": "Kenji & Aiko"},
    {"id": "numeria", "name": "Numeria", "icon": "🔢", "color": "#7fb685", "focus": "Numbers & Spatial Mathematics", "heroes": ["kwame", "octavia"], "duoLabel": "Kwame & Octavia"},
    {"id": "vitalis", "name": "Vitalis", "icon": "🤸", "color": "#c4785a", "focus": "Physical & Somatic Motor Skills", "heroes": ["felix", "amara"], "duoLabel": "Felix & Amara"},
    {"id": "celestia", "name": "Celestia", "icon": "⏰", "color": "#9678c4", "focus": "Time, Rhythms & Seasons", "heroes": ["elias", "selene"], "duoLabel": "Elias & Selene"},
    {"id": "luminosity", "name": "Luminosity", "icon": "📖", "color": "#d4897a", "focus": "Curiosity, Civics & Exploration", "heroes": ["athena", "ezra"], "duoLabel": "Athena & Ezra"},
    {"id": "aquaria", "name": "Aquaria", "icon": "💧", "color": "#5ba4c9", "focus": "Emotional Literacy & Fluidity", "heroes": ["nerissa", "ronan"], "duoLabel": "Nerissa & Ronan"},
    {"id": "terrasol", "name": "Terrasol", "icon": "🌿", "color": "#5fb685", "focus": "Sensory, Living Nature & Earth", "heroes": ["vesta", "silas"], "duoLabel": "Vesta & Silas"}
]

FALLBACK_HEROES = [
    {"id": "seriphia", "name": "Seriphia", "title": "An Eternal Learning Mother", "land": "The Celestial", "land_id": "celestia", "focus": "Guardian & Guide", "traits": ["Wisdom", "Patience", "Nurturing"]},
    {"id": "kenji", "name": "Kenji", "title": "The Word Musician", "land": "Harmonia", "land_id": "harmonia", "focus": "Language & Manners", "traits": ["Creative", "Curious", "Respectful"]},
    {"id": "aiko", "name": "Aiko", "title": "The Harmony Keeper", "land": "Harmonia", "land_id": "harmonia", "focus": "Language & Manners", "traits": ["Empathetic", "Articulate", "Kind"]},
    {"id": "kwame", "name": "Kwame", "title": "The Rhythm Counter", "land": "Numeria", "land_id": "numeria", "focus": "Numbers & Math", "traits": ["Logical", "Rhythmic", "Patient"]},
    {"id": "octavia", "name": "Octavia", "title": "The Pattern Weaver", "land": "Numeria", "land_id": "numeria", "focus": "Patterns & Geometry", "traits": ["Visual", "Inventive", "Focused"]},
    {"id": "felix", "name": "Felix", "title": "The Kinetic Guide", "land": "Vitalis", "land_id": "vitalis", "focus": "Movement & Strength", "traits": ["Energetic", "Courageous", "Playful"]},
    {"id": "amara", "name": "Amara", "title": "The Somatic Anchor", "land": "Vitalis", "land_id": "vitalis", "focus": "Breath & Regulation", "traits": ["Calm", "Centered", "Grounded"]},
    {"id": "elias", "name": "Elias", "title": "The Time Navigator", "land": "Celestia", "land_id": "celestia", "focus": "Time & Cycles", "traits": ["Observant", "Patient", "Wise"]},
    {"id": "selene", "name": "Selene", "title": "The Sky Dreamer", "land": "Celestia", "land_id": "celestia", "focus": "Seasons & Stars", "traits": ["Imaginative", "Serene", "Gentle"]},
    {"id": "athena", "name": "Athena", "title": "The Inquisitive Sage", "land": "Luminosity", "land_id": "luminosity", "focus": "Language & Civics", "traits": ["Curious", "Just", "Articulate"]},
    {"id": "ezra", "name": "Ezra", "title": "The Story Crafter", "land": "Luminosity", "land_id": "luminosity", "focus": "Stories & Community", "traits": ["Narrative", "Warm", "Collaborative"]},
    {"id": "nerissa", "name": "Nerissa", "title": "The Wave Listener", "land": "Aquaria", "land_id": "aquaria", "focus": "Feelings & Empathy", "traits": ["Intuitive", "Compassionate", "Fluid"]},
    {"id": "ronan", "name": "Ronan", "title": "The Tide Steerer", "land": "Aquaria", "land_id": "aquaria", "focus": "Emotional Resilience", "traits": ["Steadfast", "Reflective", "Loyal"]},
    {"id": "vesta", "name": "Vesta", "title": "The Earth Steward", "land": "Terrasol", "land_id": "terrasol", "focus": "Plants & Soil", "traits": ["Nurturing", "Rooted", "Patient"]},
    {"id": "silas", "name": "Silas", "title": "The Living System Tracker", "land": "Terrasol", "land_id": "terrasol", "focus": "Animals & Nature", "traits": ["Observant", "Instinctive", "Resourceful"]}
]


def find_data_file(filename: str) -> Optional[str]:
    """Look for data files relative to current working directory or common paths."""
    candidates = [
        os.path.join(os.getcwd(), "web", "src", "data", filename),
        os.path.join(os.getcwd(), "src", "data", filename),
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "web", "src", "data", filename),
        r"C:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website\web\src\data\\" + filename
    ]
    for p in candidates:
        if os.path.exists(p):
            return os.path.abspath(p)
    return None


class DataLoader:
    def __init__(self):
        self.tracks: List[TrackInfo] = []
        self.lands: Dict[str, LandInfo] = {}
        self.heroes: Dict[str, HeroInfo] = {}
        self._load_lands()
        self._load_heroes()
        self._load_tracks()

    def _load_lands(self):
        p = find_data_file("lands.json")
        raw = FALLBACK_LANDS
        if p:
            try:
                with open(p, "r", encoding="utf-8") as f:
                    raw = json.load(f)
            except Exception:
                pass
        for item in raw:
            land = LandInfo(
                id=item["id"],
                name=item["name"],
                icon=item.get("icon", "✨"),
                color=item.get("color", "#4F46E5"),
                focus=item.get("focus", ""),
                heroes=item.get("heroes", []),
                duo_label=item.get("duoLabel", "")
            )
            self.lands[land.id] = land

    def _load_heroes(self):
        p = find_data_file("heroes.json")
        raw = FALLBACK_HEROES
        if p:
            try:
                with open(p, "r", encoding="utf-8") as f:
                    raw = json.load(f)
            except Exception:
                pass
        for item in raw:
            hero = HeroInfo(
                id=item["id"],
                name=item["name"],
                title=item.get("title", ""),
                land_id=item.get("landId", item.get("land_id", "")),
                land=item.get("land", ""),
                focus=item.get("focus", ""),
                traits=item.get("traits", [])
            )
            self.heroes[hero.id] = hero

    def _load_tracks(self):
        p = find_data_file("tracks.json")
        raw = FALLBACK_TRACKS
        if p:
            try:
                with open(p, "r", encoding="utf-8") as f:
                    raw = json.load(f)
            except Exception:
                pass
        for item in raw:
            title = item.get("title")
            if not title:
                # Format slug into human title
                title = item["slug"].replace("-", " ").title()
                if "Remix" in title:
                    title = title.replace("Abc", "ABC")
            track = TrackInfo(
                id=item["id"],
                slug=item["slug"],
                title=title,
                audio_file=item.get("audioFile"),
                cover=item.get("cover"),
                color=item.get("color", "#4F46E5"),
                domain_icon=item.get("domainIcon", "🎵"),
                land_id=item.get("landId", "terrasol"),
                lyrics=item.get("lyrics")
            )
            self.tracks.append(track)

    def get_track(self, identifier: str) -> Optional[TrackInfo]:
        """Find track by id (int or str) or slug with exact-match precedence."""
        str_id = str(identifier).strip().lower()
        # 1. Exact match on id or slug
        for t in self.tracks:
            if str(t.id) == str_id or t.slug.lower() == str_id:
                return t
        # 2. Exact match on title
        for t in self.tracks:
            if t.title.lower() == str_id:
                return t
        # 3. Substring match on title (only if no exact match found)
        for t in self.tracks:
            if str_id in t.title.lower():
                return t
        return None

    def get_land(self, land_id: str) -> Optional[LandInfo]:
        return self.lands.get(land_id.lower())

    def get_tracks_by_land(self, land_id: str) -> List[TrackInfo]:
        return [t for t in self.tracks if t.land_id.lower() == land_id.lower()]
