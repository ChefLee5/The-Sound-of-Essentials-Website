"""
Data models for SOE Standards Alignment & Procurement Engine.
Supports Pydantic v2 when available, with standard dataclass fallback.
"""

from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field, asdict

try:
    from pydantic import BaseModel, Field
    HAS_PYDANTIC = True
except ImportError:
    HAS_PYDANTIC = False

if HAS_PYDANTIC:
    class StateProfile(BaseModel):
        code: str
        name: str
        tier: int  # 1 = State Approved List (28), 2 = Local District (16), 3 = Head Start/Title I (6)
        procurement_type: str
        standards_framework: str
        framework_acronym: str
        doe_agency_name: str
        approved_list_required: bool
        prek_program_name: str
        key_priorities: List[str] = Field(default_factory=list)

    class StandardCode(BaseModel):
        framework: str  # ELOF, NAEYC, CA-PTKLF, TX-TPG, FL-FELDS, etc.
        domain: str     # P-LC, 2.B, Language, etc.
        code: str       # P-LC 1, 2.B.01, etc.
        title: str
        description: str
        age_band: str = "Ages 2-7"

    class NeurologicalImpact(BaseModel):
        mechanism: str
        developmental_readiness: str
        classroom_application: str
        vagal_regulation: bool = False
        bilateral_integration: bool = False

    class TrackAlignment(BaseModel):
        track_id: int
        slug: str
        title: str
        land: str
        bpm: int
        primary_domain: str
        elof_codes: List[str]
        naeyc_codes: List[str]
        state_codes: Dict[str, List[str]] = Field(default_factory=dict)
        neurological_impact: NeurologicalImpact
        tactile_extension_summary: str
        target_skills: List[str] = Field(default_factory=list)

else:
    @dataclass
    class StateProfile:
        code: str
        name: str
        tier: int
        procurement_type: str
        standards_framework: str
        framework_acronym: str
        doe_agency_name: str
        approved_list_required: bool
        prek_program_name: str
        key_priorities: List[str] = field(default_factory=list)

        def dict(self) -> Dict[str, Any]:
            return asdict(self)

    @dataclass
    class StandardCode:
        framework: str
        domain: str
        code: str
        title: str
        description: str
        age_band: str = "Ages 2-7"

        def dict(self) -> Dict[str, Any]:
            return asdict(self)

    @dataclass
    class NeurologicalImpact:
        mechanism: str
        developmental_readiness: str
        classroom_application: str
        vagal_regulation: bool = False
        bilateral_integration: bool = False

        def dict(self) -> Dict[str, Any]:
            return asdict(self)

    @dataclass
    class TrackAlignment:
        track_id: int
        slug: str
        title: str
        land: str
        bpm: int
        primary_domain: str
        elof_codes: List[str]
        naeyc_codes: List[str]
        neurological_impact: NeurologicalImpact
        tactile_extension_summary: str
        state_codes: Dict[str, List[str]] = field(default_factory=dict)
        target_skills: List[str] = field(default_factory=list)

        def dict(self) -> Dict[str, Any]:
            return asdict(self)
