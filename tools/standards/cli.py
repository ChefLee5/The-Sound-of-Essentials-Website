#!/usr/bin/env python3
"""
SOE Curriculum & 50-State Standards Crosswalk CLI.
Command-line interface to explore state procurement pathways, generate ELOF/NAEYC alignments,
and export institutional procurement exhibits for any of the 50 US states.
"""

import argparse
import sys
import os
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from tools.standards.engine import StandardsEngine
from tools.standards.renderers import StandardsRenderer
from tools.standards.state_registry import STATES_REGISTRY, get_state, get_states_by_tier, get_all_states

def cmd_states(args):
    """Lists states categorized by procurement tier."""
    tier = args.tier
    if tier:
        states = get_states_by_tier(tier)
        print(f"\n=== TIER {tier} STATES ({len(states)} Total) ===")
    else:
        states = get_all_states()
        print(f"\n=== ALL 50 STATES + DC ({len(states)} Total) ===")

    print(f"{'Code':<5} | {'State Name':<16} | {'Tier':<5} | {'Program Name':<38} | {'Framework':<20}")
    print("-" * 95)
    for s in states:
        prog = s.prek_program_name[:36] + (".." if len(s.prek_program_name) > 36 else "")
        fw = s.framework_acronym[:18]
        print(f"{s.code:<5} | {s.name:<16} | {s.tier:<5} | {prog:<38} | {fw:<20}")

def cmd_rfp_brief(args):
    """Outputs an instant 1-page alignment brief for an individual track."""
    engine = StandardsEngine()
    track = engine.get_track_alignment(args.track)
    if not track:
        print(f"[!] Error: Track '{args.track}' not found in canonical catalog.", file=sys.stderr)
        sys.exit(1)

    print(f"\n{'='*75}")
    print(f"SOE RFP CURRICULUM BRIEF: TRACK {track.track_id} — {track.title.upper()}")
    print(f"{'='*75}")
    print(f"Land:                       {track.land}")
    print(f"Tempo & Metronome:          {track.bpm} BPM")
    print(f"Primary Early Domain:       {track.primary_domain}")
    print(f"Head Start ELOF Codes:      {', '.join(track.elof_codes)}")
    print(f"NAEYC Standard Indicators:  {', '.join(track.naeyc_codes)}")
    print(f"Target Skill Milestones:    {', '.join(track.target_skills)}")
    print("-" * 75)
    print("NEUROLOGICAL MECHANISM:")
    print(f"  {track.neurological_impact.mechanism}")
    print("\nDEVELOPMENTAL READINESS VALUE:")
    print(f"  {track.neurological_impact.developmental_readiness}")
    print("\nCLASSROOM APPLICATION & TEACHER TRANSITION:")
    print(f"  {track.neurological_impact.classroom_application}")
    print("\n10-MINUTE SCREEN-FREE TACTILE LESSON RITUAL:")
    print(f"  {track.tactile_extension_summary}")
    print(f"{'='*75}\n")

def cmd_export(args):
    """Exports multi-format procurement deliverables."""
    outdir = args.outdir
    fmt = args.format.lower()
    target_state = (args.state or "TX").upper()

    renderer = StandardsRenderer()
    os.makedirs(outdir, exist_ok=True)

    print(f"\n[i] Exporting SOE Standards & Procurement Deliverables to: {outdir}")

    # 1. 50-State Procurement Index
    if fmt in ["index", "all", "md"]:
        index_path = os.path.join(outdir, "50_STATES_PROCUREMENT_INDEX.md")
        renderer.export_50_state_index(index_path)
        print(f"[+] Exported 50-State Procurement Index: {index_path}")

    # 2. Master Markdown Matrix
    if fmt in ["md", "all"]:
        md_path = os.path.join(outdir, "STANDARDS_CROSSWALK_MASTER.md")
        renderer.export_markdown(md_path)
        print(f"[+] Exported Master Crosswalk Markdown:  {md_path}")

    # 3. Master JSON Database
    if fmt in ["json", "all"]:
        json_path = os.path.join(outdir, "STANDARDS_CROSSWALK_MASTER.json")
        renderer.export_json(json_path)
        print(f"[+] Exported Master Crosswalk JSON:      {json_path}")

    # 4. Printable HTML Exhibit
    if fmt in ["html", "all"]:
        if target_state == "ALL":
            # Generate exhibits for the top 5 flagship states across tiers
            flagships = ["TX", "CA", "FL", "GA", "NY"]
            for st in flagships:
                html_path = os.path.join(outdir, f"SOE_State_DOE_Procurement_Exhibit_{st}.html")
                renderer.export_html_exhibit(html_path, state_code=st)
                print(f"[+] Exported Printable Procurement Exhibit ({st}): {html_path}")
        else:
            html_path = os.path.join(outdir, f"SOE_State_DOE_Procurement_Exhibit_{target_state}.html")
            renderer.export_html_exhibit(html_path, state_code=target_state)
            print(f"[+] Exported Printable Procurement Exhibit ({target_state}): {html_path}")

    print("[OK] All requested procurement deliverables successfully rendered!\n")

def main():
    parser = argparse.ArgumentParser(description="SOE 50-State Curriculum & Standards CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Subcommand: states
    p_states = subparsers.add_parser("states", help="List cataloged states and procurement tiers")
    p_states.add_argument("--tier", type=int, choices=[1, 2, 3], help="Filter by tier (1=Approved List [28], 2=Local Control [16], 3=Head Start/Title I [6])")
    p_states.set_defaults(func=cmd_states)

    # Subcommand: rfp-brief
    p_brief = subparsers.add_parser("rfp-brief", help="Generate 1-page alignment brief for a track")
    p_brief.add_argument("--track", "-t", required=True, help="Track slug or number (e.g. 'drill-time' or '7')")
    p_brief.set_defaults(func=cmd_rfp_brief)

    # Subcommand: export
    p_export = subparsers.add_parser("export", help="Export multi-format procurement exhibits")
    p_export.add_argument("--format", "-f", choices=["all", "md", "json", "html", "index"], default="all", help="Output format")
    p_export.add_argument("--state", "-s", default="TX", help="Target state code (e.g. TX, CA, FL, NY) or 'ALL'")
    p_export.add_argument("--outdir", "-o", default="./curriculum_exhibits", help="Output directory path")
    p_export.set_defaults(func=cmd_export)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
