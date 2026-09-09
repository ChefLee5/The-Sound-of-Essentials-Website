"""
Data models for SOE Curriculum & Early Childhood Lesson Extensions.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class HeroInfo(BaseModel):
    id: str
    name: str
    title: str = ""
    land_id: str = ""
    land: str = ""
    focus: str = ""
    traits: List[str] = Field(default_factory=list)


class LandInfo(BaseModel):
    id: str
    name: str
    icon: str = "✨"
    color: str = "#4F46E5"
    focus: str = ""
    heroes: List[str] = Field(default_factory=list)
    duo_label: str = ""


class TrackInfo(BaseModel):
    id: int
    slug: str
    title: str = ""
    audio_file: Optional[str] = None
    cover: Optional[str] = None
    color: str = "#4F46E5"
    domain_icon: str = "🎵"
    land_id: str = "terrasol"
    lyrics: Optional[str] = None


class FiveDomainSpider(BaseModel):
    language: str
    cognitive: str
    physical: str
    science_sensory: str
    social_emotional: str


class StandardsCrosswalk(BaseModel):
    elof_codes: List[str] = Field(default_factory=list)
    elof_domains: List[str] = Field(default_factory=list)
    naeyc_standards: List[str] = Field(default_factory=list)
    kindergarten_readiness: str = ""


class LessonExtension(BaseModel):
    track_id: int
    track_slug: str
    title: str
    land_name: str
    land_id: str
    land_color: str
    domain_icon: str
    hero_guides: str
    age_group: str = "Ages 2–7 (Pre-K to Grade 1)"
    duration: str = "10–15 Minutes"
    materials: List[str] = Field(default_factory=list)
    quest_mission: str
    rhythm_ignition: str
    tactile_ritual: str
    domain_spider: FiveDomainSpider
    teacher_whisper: str
    standards: StandardsCrosswalk
