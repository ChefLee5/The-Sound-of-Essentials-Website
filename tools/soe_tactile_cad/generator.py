"""
SOE Cloud Academy Parametric Text-to-CAD Engine (Ages 2-7).

Generates watertight Binary STL meshes for immediate US Print-on-Demand fulfillment
(Slant 3D REST API) and Cloud Academy Classroom Pods, paired with OpenCASCADE-ready
build123d Python scripts modeled after earthtojake/text-to-cad.
"""

from __future__ import annotations

import math
import re
import struct
from pathlib import Path
from typing import Any, Dict, List, Tuple

from .dfm_validator import validate_stl_dfm

RETIRED_CANON_NAMES = {"marcus", "elena", "reef", "zara", "dara", "sophia", "geometria"}

CANONICAL_HERO_TO_LAND: Dict[str, str] = {
    "seriphia": "all_lands",
    "kenji": "harmonia",
    "aiko": "harmonia",
    "kwame": "numeria",
    "octavia": "numeria",
    "felix": "vitalis",
    "amara": "vitalis",
    "elias": "celestia",
    "selene": "celestia",
    "athena": "luminosity",
    "ezra": "luminosity",
    "nerissa": "aquaria",
    "ronan": "aquaria",
    "vesta": "terrasol",
    "silas": "terrasol",
    "lil g": "concord",
}

SOE_TACTILE_CATALOG: Dict[str, Dict[str, Any]] = {
    "SOE-HARM-NAME-01": {
        "name": "My Name in Harmonia — Personalized Phonics & Syllable Board",
        "land": "Harmonia (Kenji & Aiko)",
        "domain": "Language, Phonics & Syllable Awareness (Ages 2-7)",
        "retail_usd": 29.00,
        "unlocks_physical_continuity": "$14.99/mo The Rhythm Pass",
    },
    "SOE-VIT-KNUCKLE-01": {
        "name": "Vitalis Somatic Knuckle-Tap & Midline Rhythm Board",
        "land": "Vitalis (Amara & Felix)",
        "domain": "Physical, Bilateral & Fine-Motor Coordination (Ages 2-7)",
        "retail_usd": 34.00,
        "unlocks_physical_continuity": "$14.99/mo The Rhythm Pass",
    },
    "SOE-CONCORD-NFC-01": {
        "name": "Phygital NFC Hero Totem Plinth (Seriphia, 14 Heroes & Lil G)",
        "land": "All 7 Lands + The Concord",
        "domain": "Screen-Free Audio Trigger & Circle-Time Anchor (Ages 2-7)",
        "retail_usd": 19.00,
        "unlocks_physical_continuity": "$14.99/mo The Rhythm Pass",
    },
}

# Normalized stroke boxes (x0, y0, x1, y1) inside a [0..1] x [0..1] glyph cell.
# Every stroke is placed with a subtle z-offset in add_box so overlapping strokes
# form non-coincident closed manifold shells for zero-artifact slicing.
FONT_STROKES: Dict[str, List[Tuple[float, float, float, float]]] = {
    "A": [(0.05, 0.0, 0.25, 0.95), (0.75, 0.0, 0.95, 0.95), (0.20, 0.80, 0.80, 1.0), (0.20, 0.42, 0.80, 0.60)],
    "B": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.82, 0.85, 1.0), (0.20, 0.44, 0.80, 0.62), (0.20, 0.0, 0.85, 0.18), (0.72, 0.56, 0.92, 0.90), (0.72, 0.10, 0.92, 0.48)],
    "C": [(0.05, 0.05, 0.27, 0.95), (0.15, 0.82, 0.92, 1.0), (0.15, 0.0, 0.92, 0.18)],
    "D": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.82, 0.80, 1.0), (0.20, 0.0, 0.80, 0.18), (0.74, 0.12, 0.95, 0.88)],
    "E": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.82, 0.92, 1.0), (0.20, 0.43, 0.78, 0.60), (0.20, 0.0, 0.92, 0.18)],
    "F": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.82, 0.92, 1.0), (0.20, 0.43, 0.78, 0.60)],
    "G": [(0.05, 0.05, 0.27, 0.95), (0.15, 0.82, 0.92, 1.0), (0.15, 0.0, 0.92, 0.18), (0.74, 0.05, 0.95, 0.48), (0.50, 0.36, 0.95, 0.52)],
    "H": [(0.05, 0.0, 0.27, 1.0), (0.73, 0.0, 0.95, 1.0), (0.20, 0.42, 0.80, 0.60)],
    "I": [(0.15, 0.82, 0.85, 1.0), (0.39, 0.10, 0.61, 0.90), (0.15, 0.0, 0.85, 0.18)],
    "J": [(0.68, 0.10, 0.90, 1.0), (0.15, 0.0, 0.85, 0.18), (0.08, 0.10, 0.30, 0.36)],
    "K": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.42, 0.55, 0.60), (0.48, 0.55, 0.88, 1.0), (0.48, 0.0, 0.88, 0.45)],
    "L": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.0, 0.92, 0.18)],
    "M": [(0.05, 0.0, 0.25, 1.0), (0.75, 0.0, 0.95, 1.0), (0.40, 0.35, 0.60, 0.78), (0.20, 0.65, 0.45, 0.95), (0.55, 0.65, 0.80, 0.95)],
    "N": [(0.05, 0.0, 0.25, 1.0), (0.75, 0.0, 0.95, 1.0), (0.22, 0.50, 0.55, 0.85), (0.45, 0.20, 0.78, 0.55)],
    "O": [(0.05, 0.05, 0.27, 0.95), (0.73, 0.05, 0.95, 0.95), (0.15, 0.82, 0.85, 1.0), (0.15, 0.0, 0.85, 0.18)],
    "P": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.82, 0.85, 1.0), (0.20, 0.46, 0.85, 0.64), (0.73, 0.55, 0.95, 0.92)],
    "Q": [(0.05, 0.12, 0.27, 0.95), (0.73, 0.12, 0.95, 0.95), (0.15, 0.82, 0.85, 1.0), (0.15, 0.08, 0.85, 0.25), (0.58, 0.0, 0.95, 0.22)],
    "R": [(0.05, 0.0, 0.27, 1.0), (0.20, 0.82, 0.85, 1.0), (0.20, 0.46, 0.82, 0.64), (0.72, 0.55, 0.94, 0.92), (0.52, 0.0, 0.90, 0.48)],
    "S": [(0.10, 0.82, 0.90, 1.0), (0.05, 0.48, 0.27, 0.90), (0.15, 0.42, 0.85, 0.60), (0.73, 0.10, 0.95, 0.50), (0.10, 0.0, 0.90, 0.18)],
    "T": [(0.05, 0.82, 0.95, 1.0), (0.39, 0.0, 0.61, 0.88)],
    "U": [(0.05, 0.10, 0.27, 1.0), (0.73, 0.10, 0.95, 1.0), (0.15, 0.0, 0.85, 0.18)],
    "V": [(0.05, 0.35, 0.27, 1.0), (0.73, 0.35, 0.95, 1.0), (0.22, 0.10, 0.52, 0.45), (0.48, 0.10, 0.78, 0.45), (0.35, 0.0, 0.65, 0.20)],
    "W": [(0.05, 0.05, 0.24, 1.0), (0.76, 0.05, 0.95, 1.0), (0.41, 0.15, 0.59, 0.65), (0.18, 0.0, 0.46, 0.22), (0.54, 0.0, 0.82, 0.22)],
    "X": [(0.08, 0.60, 0.40, 1.0), (0.60, 0.60, 0.92, 1.0), (0.32, 0.34, 0.68, 0.66), (0.08, 0.0, 0.40, 0.40), (0.60, 0.0, 0.92, 0.40)],
    "Y": [(0.08, 0.52, 0.36, 1.0), (0.64, 0.52, 0.92, 1.0), (0.25, 0.42, 0.75, 0.62), (0.39, 0.0, 0.61, 0.50)],
    "Z": [(0.08, 0.82, 0.92, 1.0), (0.45, 0.45, 0.85, 0.85), (0.15, 0.15, 0.55, 0.50), (0.08, 0.0, 0.92, 0.18)],
    "-": [(0.20, 0.42, 0.80, 0.58)],
}


def _assert_canon_safe(text: str) -> None:
    lowered = text.lower()
    for banned in RETIRED_CANON_NAMES:
        if re.search(rf"\b{re.escape(banned)}\b", lowered):
            raise ValueError(f"SOE Canon Block: retired entity '{banned}' cannot enter CAD generation.")


class _ManifoldMesh:
    """Builds outward-oriented closed manifold triangle shells and serializes to Binary STL."""

    def __init__(self, header_label: str) -> None:
        self.header_label = header_label[:79]
        self.triangles: List[Tuple[Tuple[float, float, float], Tuple[float, float, float], Tuple[float, float, float]]] = []

    def add_prism(self, polygon_xy: List[Tuple[float, float]], z0: float, z1: float) -> None:
        """Emit a closed 2-manifold extruded CCW prism between z0 and z1."""
        n = len(polygon_xy)
        cx = sum(p[0] for p in polygon_xy) / n
        cy = sum(p[1] for p in polygon_xy) / n
        bot_center = (cx, cy, z0)
        top_center = (cx, cy, z1)

        for i in range(n):
            p0 = polygon_xy[i]
            p1 = polygon_xy[(i + 1) % n]
            b0, b1 = (p0[0], p0[1], z0), (p1[0], p1[1], z0)
            t0, t1 = (p0[0], p0[1], z1), (p1[0], p1[1], z1)

            self.triangles.append((top_center, t0, t1))
            self.triangles.append((bot_center, b1, b0))
            self.triangles.append((b0, b1, t1))
            self.triangles.append((b0, t1, t0))

    def add_chamfered_plate(self, x0: float, y0: float, z0: float, x1: float, y1: float, z1: float, chamfer: float = 3.0) -> None:
        c = min(chamfer, (x1 - x0) * 0.25, (y1 - y0) * 0.25)
        poly = [
            (x0 + c, y0), (x1 - c, y0),
            (x1, y0 + c), (x1, y1 - c),
            (x1 - c, y1), (x0 + c, y1),
            (x0, y1 - c), (x0, y0 + c),
        ]
        self.add_prism(poly, z0, z1)

    def add_box(self, x0: float, y0: float, z0: float, x1: float, y1: float, z1: float) -> None:
        self.add_prism([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], z0, z1)

    def add_cylinder(self, cx: float, cy: float, z0: float, z1: float, radius: float, segments: int = 24) -> None:
        poly = [
            (cx + radius * math.cos(2.0 * math.pi * i / segments), cy + radius * math.sin(2.0 * math.pi * i / segments))
            for i in range(segments)
        ]
        self.add_prism(poly, z0, z1)

    def write_stl(self, output_path: Path) -> Path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        header = self.header_label.encode("ascii", errors="ignore").ljust(80, b"\x00")[:80]
        chunks = [header, struct.pack("<I", len(self.triangles))]

        for v0, v1, v2 in self.triangles:
            ux, uy, uz = v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]
            vx, vy, vz = v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]
            nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
            mag = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
            chunks.append(
                struct.pack(
                    "<12fH",
                    nx / mag, ny / mag, nz / mag,
                    v0[0], v0[1], v0[2],
                    v1[0], v1[1], v1[2],
                    v2[0], v2[1], v2[2],
                    0,
                )
            )

        output_path.write_bytes(b"".join(chunks))
        return output_path


def _emit_build123d_nameplate_script(clean_name: str, width_mm: float, depth_mm: float, base_h: float) -> str:
    return f'''"""Auto-generated SOE Text-to-CAD build123d script (earthtojake/text-to-cad compatible)."""
from build123d import Align, BuildPart, BuildSketch, Extrude, FontStyle, Location, Text, Circle, RectangleRounded, fillet

CHILD_NAME = {clean_name!r}
BOARD_WIDTH_MM = {width_mm:.1f}
BOARD_DEPTH_MM = {depth_mm:.1f}
BASE_HEIGHT_MM = {base_h:.1f}
RELIEF_HEIGHT_MM = 3.5

with BuildPart() as part:
    with BuildSketch():
        RectangleRounded(BOARD_WIDTH_MM, BOARD_DEPTH_MM, radius=5.0)
    Extrude(amount=BASE_HEIGHT_MM)
    fillet(part.edges().filter_by_position(axis=2, minimum=BASE_HEIGHT_MM - 0.1, maximum=BASE_HEIGHT_MM + 0.1), radius=1.0)
    with BuildSketch(Location((0, 4.0, BASE_HEIGHT_MM))):
        Text(CHILD_NAME, font_size=22.0, font_style=FontStyle.BOLD, align=(Align.CENTER, Align.CENTER))
    Extrude(amount=RELIEF_HEIGHT_MM)
    # Syllable/phoneme tapping dots underneath each letter
    spacing = (BOARD_WIDTH_MM - 28.0) / max(len(CHILD_NAME), 1)
    start_x = -((len(CHILD_NAME) - 1) * spacing) / 2.0
    for idx in range(len(CHILD_NAME)):
        with BuildSketch(Location((start_x + idx * spacing, -14.0, BASE_HEIGHT_MM))):
            Circle(radius=3.8)
        Extrude(amount=2.8)

part.part.export_stl("harmonia_nameplate_" + CHILD_NAME.lower() + ".stl")
part.part.export_step("harmonia_nameplate_" + CHILD_NAME.lower() + ".step")
'''


def generate_harmonia_nameplate(child_name: str, output_dir: str | Path) -> Dict[str, Any]:
    """
    Generate SKU SOE-HARM-NAME-01: Personalized 'My Name in Harmonia' Tactile Phonics Board.
    Includes chamfered baseplate (>= 84mm x 48mm x 5mm), raised 3D letters, and syllable tapping dots.
    """
    _assert_canon_safe(child_name)
    cleaned = re.sub(r"[^A-Z -]", "", child_name.strip().upper())[:12] or "SOE"
    letter_pitch = 22.0
    letter_w = 15.0
    letter_h = 21.0
    base_h = 5.0
    depth_mm = 50.0
    margin_x = 16.0
    width_mm = max(90.0, margin_x * 2 + len(cleaned) * letter_pitch - (letter_pitch - letter_w))

    mesh = _ManifoldMesh(f"SOE HARMONIA PHONICS BOARD: {cleaned} (AGES 2-7)")
    mesh.add_chamfered_plate(0.0, 0.0, 0.0, width_mm, depth_mm, base_h, chamfer=4.0)

    start_x = (width_mm - (len(cleaned) * letter_pitch - (letter_pitch - letter_w))) / 2.0
    letter_y0 = 19.0
    dot_y = 9.5

    for char_idx, ch in enumerate(cleaned):
        cell_x0 = start_x + char_idx * letter_pitch
        strokes = FONT_STROKES.get(ch, [])
        for s_idx, (sx0, sy0, sx1, sy1) in enumerate(strokes):
            # Subtle per-stroke z/inset variance keeps every box shell vertex-disjoint
            # while embedding 0.3mm deep into the baseplate for unified 3D slicing.
            eps = (char_idx * 7 + s_idx) * 0.002
            bx0 = cell_x0 + sx0 * letter_w + eps
            by0 = letter_y0 + sy0 * letter_h + eps
            bx1 = cell_x0 + sx1 * letter_w - eps * 0.5
            by1 = letter_y0 + sy1 * letter_h - eps * 0.5
            mesh.add_box(bx0, by0, base_h - 0.30, bx1, by1, base_h + 3.50 + eps)

        if ch != " ":
            mesh.add_cylinder(cell_x0 + letter_w / 2.0, dot_y, base_h - 0.25, base_h + 2.6, radius=3.6, segments=20)

    out_dir = Path(output_dir)
    slug = cleaned.lower().replace(" ", "_")
    stl_path = mesh.write_stl(out_dir / f"harmonia_nameplate_{slug}.stl")
    cad_script_path = out_dir / f"harmonia_nameplate_{slug}.build123d.py"
    cad_script_path.write_text(_emit_build123d_nameplate_script(cleaned, width_mm, depth_mm, base_h), encoding="utf-8")

    dfm = validate_stl_dfm(stl_path)
    return {
        "sku": "SOE-HARM-NAME-01",
        "child_name": cleaned,
        "stl_path": str(stl_path),
        "build123d_script_path": str(cad_script_path),
        "dfm": dfm,
    }


def generate_vitalis_knuckle_board(beats: int = 8, output_dir: str | Path = ".") -> Dict[str, Any]:
    """
    Generate SKU SOE-VIT-KNUCKLE-01: Vitalis Somatic Knuckle-Tap & Midline Rhythm Board.
    """
    beat_count = max(4, min(16, int(beats)))
    pitch = 22.0
    width_mm = max(110.0, 24.0 + beat_count * pitch)
    depth_mm = 64.0
    base_h = 5.5

    mesh = _ManifoldMesh(f"SOE VITALIS KNUCKLE BOARD ({beat_count} BEATS)")
    mesh.add_chamfered_plate(0.0, 0.0, 0.0, width_mm, depth_mm, base_h, chamfer=5.0)

    # Bilateral tracking rails + beat tapping domes
    mesh.add_box(12.0, 12.0, base_h - 0.3, width_mm - 12.0, 17.0, base_h + 3.0)
    mesh.add_box(12.0, depth_mm - 17.0, base_h - 0.3, width_mm - 12.0, depth_mm - 12.0, base_h + 3.0)

    start_x = (width_mm - (beat_count - 1) * pitch) / 2.0
    for idx in range(beat_count):
        cx = start_x + idx * pitch
        radius = 6.2 if idx % 2 == 0 else 4.8  # Tactile strong-beat / off-beat alternation
        mesh.add_cylinder(cx, depth_mm / 2.0, base_h - 0.3, base_h + 4.0 + (idx * 0.001), radius=radius, segments=24)

    out_dir = Path(output_dir)
    stl_path = mesh.write_stl(out_dir / f"vitalis_knuckle_board_{beat_count}beat.stl")
    dfm = validate_stl_dfm(stl_path)
    return {"sku": "SOE-VIT-KNUCKLE-01", "beats": beat_count, "stl_path": str(stl_path), "dfm": dfm}


def generate_nfc_hero_totem_plinth(hero_name: str, output_dir: str | Path = ".") -> Dict[str, Any]:
    """
    Generate SKU SOE-CONCORD-NFC-01: Phygital NFC Hero Totem Plinth (Seriphia, 14 Land Heroes, or Lil G).
    Includes pause-at-layer cavity dimensions for an internal 25mm NTAG215 NFC wafer.
    """
    _assert_canon_safe(hero_name)
    cleaned = hero_name.strip().lower()
    land = CANONICAL_HERO_TO_LAND.get(cleaned)
    if not land:
        raise ValueError(f"Unknown SOE Hero '{hero_name}'. Must be Seriphia, one of the 14 Land Heroes, or Lil G.")

    mesh = _ManifoldMesh(f"SOE NFC HERO PLINTH: {hero_name.upper()} ({land.upper()})")
    # Wide chamfered child-safe pedestal (> 48mm base >= 31.8mm CPSC clearance)
    mesh.add_cylinder(28.0, 28.0, 0.0, 8.0, radius=26.0, segments=32)
    mesh.add_cylinder(28.0, 28.0, 7.6, 16.0, radius=20.0, segments=32)
    mesh.add_box(16.0, 20.0, 15.6, 40.0, 36.0, 22.0)

    out_dir = Path(output_dir)
    slug = re.sub(r"[^a-z0-9]+", "_", cleaned).strip("_")
    stl_path = mesh.write_stl(out_dir / f"nfc_hero_plinth_{slug}.stl")
    dfm = validate_stl_dfm(stl_path)
    return {
        "sku": "SOE-CONCORD-NFC-01",
        "hero_name": hero_name.strip(),
        "land": land,
        "nfc_pocket_spec": {"tag_type": "NTAG215", "diameter_mm": 26.2, "pause_layer_z_mm": 3.2},
        "stl_path": str(stl_path),
        "dfm": dfm,
    }


def build_slant3d_order_payload(
    *,
    customer_name: str,
    customer_email: str,
    shipping_address: Dict[str, str],
    sku: str,
    stl_file_url: str,
    color: str = "Orange",
    quantity: int = 1,
) -> Dict[str, Any]:
    """Construct a Slant 3D REST API v2 Print-on-Demand fulfillment payload (Direct Stripe, Zero Shopify)."""
    return {
        "provider": "slant3d_rest_api_v2",
        "endpoint": "https://www.slant3dapi.com/api/order",
        "customer": {
            "name": customer_name,
            "email": customer_email,
            "shipping_address": {
                "address_line_1": shipping_address.get("address_line_1", ""),
                "city": shipping_address.get("city", ""),
                "state": shipping_address.get("state", ""),
                "postal_code": shipping_address.get("postal_code", ""),
                "country": shipping_address.get("country", "US"),
            },
        },
        "line_items": [
            {
                "sku": sku,
                "file_url": stl_file_url,
                "filament": "PLA",
                "color": color,
                "quantity": int(quantity),
            }
        ],
    }
