"""CLI entrypoint for generating SOE Cloud Academy 3D-printable tactile components."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from .generator import (
    generate_harmonia_nameplate,
    generate_nfc_hero_totem_plinth,
    generate_vitalis_knuckle_board,
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate SOE Tactile STL & build123d CAD files")
    sub = parser.add_subparsers(dest="command", required=True)

    p_name = sub.add_parser("nameplate", help="Generate Personalized Harmonia Phonics Nameplate")
    p_name.add_argument("child_name", help="Child's first name (Ages 2-7)")
    p_name.add_argument("--out", default="./dist_cad", help="Output directory")

    p_knuckle = sub.add_parser("knuckle", help="Generate Vitalis Somatic Knuckle-Tap Board")
    p_knuckle.add_argument("--beats", type=int, default=8, help="Number of beat domes (4-16)")
    p_knuckle.add_argument("--out", default="./dist_cad", help="Output directory")

    p_nfc = sub.add_parser("totem", help="Generate Phygital NFC Hero Totem Plinth")
    p_nfc.add_argument("hero_name", help="Canonical SOE Hero (e.g. Seriphia, Kenji, Aiko, Lil G)")
    p_nfc.add_argument("--out", default="./dist_cad", help="Output directory")

    args = parser.parse_args()
    out_dir = Path(args.out)

    if args.command == "nameplate":
        result = generate_harmonia_nameplate(args.child_name, out_dir)
    elif args.command == "knuckle":
        result = generate_vitalis_knuckle_board(args.beats, out_dir)
    else:
        result = generate_nfc_hero_totem_plinth(args.hero_name, out_dir)

    print(json.dumps(result, indent=2))
    return 0 if result["dfm"]["dfm_passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

