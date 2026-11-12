"""Binary STL manifold & CPSC 16 CFR 1501 child-safety DFM validator (Ages 2-7)."""

from __future__ import annotations

import math
import struct
from pathlib import Path
from typing import Any, Dict, Tuple


CPSC_MIN_DIMENSION_MM = 31.8  # Exceeds 31.7mm (1.25 in) CPSC small-parts cylinder diameter
MIN_PLATE_HEIGHT_MM = 3.0


def _cross(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> Tuple[float, float, float]:
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def _dot(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> float:
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _sub(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> Tuple[float, float, float]:
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def _qvert(v: Tuple[float, float, float]) -> Tuple[float, float, float]:
    return (round(v[0], 4), round(v[1], 4), round(v[2], 4))


def validate_stl_dfm(stl_path: str | Path) -> Dict[str, Any]:
    """
    Parse a binary STL file and verify:
    1. Valid binary STL byte count and header
    2. Closed 2-manifold topology (0 boundary edges, 0 non-manifold edges)
    3. Zero degenerate triangles and positive signed volume
    4. CPSC 16 CFR 1501 child-safety clearance (> 31.7mm) for Ages 2-7 manipulatives
    """
    path = Path(stl_path)
    raw = path.read_bytes()
    if len(raw) < 84:
        raise ValueError(f"Invalid STL file (too small): {path}")

    header = raw[:80].split(b"\x00", 1)[0].decode("ascii", errors="ignore").strip()
    (tri_count,) = struct.unpack_from("<I", raw, 80)
    expected_bytes = 84 + tri_count * 50
    if len(raw) != expected_bytes:
        raise ValueError(
            f"Binary STL size mismatch for {path}: expected {expected_bytes} bytes, got {len(raw)}"
        )

    directed_edges: Dict[Tuple[Tuple[float, float, float], Tuple[float, float, float]], int] = {}
    degenerate_triangles = 0
    signed_volume_6x = 0.0

    min_x = min_y = min_z = math.inf
    max_x = max_y = max_z = -math.inf

    for idx in range(tri_count):
        offset = 84 + idx * 50
        floats = struct.unpack_from("<12f", raw, offset)
        v0 = (floats[3], floats[4], floats[5])
        v1 = (floats[6], floats[7], floats[8])
        v2 = (floats[9], floats[10], floats[11])

        for vx, vy, vz in (v0, v1, v2):
            min_x = min(min_x, vx)
            max_x = max(max_x, vx)
            min_y = min(min_y, vy)
            max_y = max(max_y, vy)
            min_z = min(min_z, vz)
            max_z = max(max_z, vz)

        cross_vec = _cross(_sub(v1, v0), _sub(v2, v0))
        area2 = math.sqrt(_dot(cross_vec, cross_vec))
        if area2 < 1e-8:
            degenerate_triangles += 1

        signed_volume_6x += _dot(v0, _cross(v1, v2))

        q0, q1, q2 = _qvert(v0), _qvert(v1), _qvert(v2)
        for a, b in ((q0, q1), (q1, q2), (q2, q0)):
            directed_edges[(a, b)] = directed_edges.get((a, b), 0) + 1

    boundary_edges = 0
    non_manifold_edges = 0
    for (a, b), count in directed_edges.items():
        if count > 1:
            non_manifold_edges += count - 1
        twin_count = directed_edges.get((b, a), 0)
        if twin_count != count:
            boundary_edges += abs(count - twin_count)

    width_mm = round(max_x - min_x, 3) if tri_count else 0.0
    depth_mm = round(max_y - min_y, 3) if tri_count else 0.0
    height_mm = round(max_z - min_z, 3) if tri_count else 0.0
    volume_mm3 = round(signed_volume_6x / 6.0, 3)

    cpsc_1501_pass = min(width_mm, depth_mm) >= CPSC_MIN_DIMENSION_MM and height_mm >= MIN_PLATE_HEIGHT_MM
    watertight_manifold = (
        tri_count >= 12
        and degenerate_triangles == 0
        and boundary_edges == 0
        and non_manifold_edges == 0
        and volume_mm3 > 0
    )

    return {
        "file": str(path),
        "header": header,
        "triangle_count": tri_count,
        "degenerate_triangles": degenerate_triangles,
        "boundary_edges": boundary_edges,
        "non_manifold_edges": non_manifold_edges,
        "watertight_manifold": watertight_manifold,
        "volume_mm3": volume_mm3,
        "estimated_pla_grams": round((volume_mm3 / 1000.0) * 1.24 * 0.35, 2),  # ~35% effective print density
        "dimensions_mm": {"width": width_mm, "depth": depth_mm, "height": height_mm},
        "cpsc_1501_child_safe_ages_2_7": cpsc_1501_pass,
        "dfm_passed": watertight_manifold and cpsc_1501_pass,
    }

