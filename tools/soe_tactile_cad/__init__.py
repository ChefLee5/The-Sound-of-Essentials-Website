"""SOE Cloud Academy Text-to-CAD & 3D Print-on-Demand Tactile Engine."""

from .dfm_validator import validate_stl_dfm
from .generator import (
    CANONICAL_HERO_TO_LAND,
    RETIRED_CANON_NAMES,
    SOE_TACTILE_CATALOG,
    build_slant3d_order_payload,
    generate_harmonia_nameplate,
    generate_nfc_hero_totem_plinth,
    generate_vitalis_knuckle_board,
)

__all__ = [
    "CANONICAL_HERO_TO_LAND",
    "RETIRED_CANON_NAMES",
    "SOE_TACTILE_CATALOG",
    "build_slant3d_order_payload",
    "generate_harmonia_nameplate",
    "generate_nfc_hero_totem_plinth",
    "generate_vitalis_knuckle_board",
    "validate_stl_dfm",
]

