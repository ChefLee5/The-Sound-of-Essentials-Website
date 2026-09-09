"""
Command Line Interface for SOE Curriculum Generator (soe-curriculum-cli).
Wraps @early-childhood-lesson-extender for batch classroom production.
"""

import os
import sys
import click
from typing import Optional
from soe_curriculum.data_loader import DataLoader
from soe_curriculum.engine import CurriculumEngine
from soe_curriculum.exporters import (
    export_markdown,
    export_batch_index_markdown,
    export_html,
    export_batch_html,
    export_json,
    export_batch_json
)
from soe_curriculum.standards import STANDARDS_CATALOG


@click.group()
@click.version_option(version="1.0.0", prog_name="soe-curriculum-cli")
def main():
    """SOE Curriculum CLI: Batch-Produce Screen-Free ECE Lesson Packages.

    Wraps @early-childhood-lesson-extender to generate standards-aligned,
    10–15 minute tactile music rituals across the 5 Core Domains.
    """
    pass


@main.command(name="list")
@click.argument("category", type=click.Choice(["tracks", "lands", "heroes", "domains"]), default="tracks")
def list_catalog(category: str):
    """Browse the SOE Curriculum catalog (tracks, lands, heroes, domains)."""
    loader = DataLoader()

    if category == "tracks":
        click.echo(click.style("\n=== SOE RHYTHM QUEST — 19 TRACKS ===", fg="cyan", bold=True))
        for t in loader.tracks:
            land = loader.get_land(t.land_id)
            land_name = land.name if land else t.land_id
            click.echo(f"  {t.domain_icon} Track {t.id:02d}: {t.title:<24} [Land: {land_name:<10}] (slug: {t.slug})")
        click.echo()

    elif category == "lands":
        click.echo(click.style("\n=== THE 7 LANDS OF ESSENTIAL LEARNING ===", fg="yellow", bold=True))
        for l in loader.lands.values():
            click.echo(f"  {l.icon} {l.name:<12} Focus: {l.focus:<30} Guides: {l.duo_label}")
        click.echo()

    elif category == "heroes":
        click.echo(click.style("\n=== SOE CANONICAL HERO GUIDES ===", fg="magenta", bold=True))
        for h in loader.heroes.values():
            traits_str = ", ".join(h.traits)
            click.echo(f"  ⭐ {h.name:<10} ({h.title:<26}) Land: {h.land:<12} Traits: {traits_str}")
        click.echo()

    elif category == "domains":
        click.echo(click.style("\n=== THE 5 CORE DOMAINS OF ESSENTIAL LEARNING ===", fg="green", bold=True))
        domains = [
            ("🗣️ Language & Early Literacy", "Harmonia / Kenji & Aiko", "Phonemic awareness, vocal articulation, rhythm phrases, courtesies"),
            ("🔢 Cognitive & Mathematics", "Numeria / Kwame & Octavia", "Counting, 1-to-1 correspondence, spatial patterns, geometry"),
            ("🤸 Physical & Motor Skills", "Vitalis / Felix & Amara", "Bilateral midline crossing, somatic regulation, gross/fine motor"),
            ("🔬 Science & Sensory", "Terrasol / Vesta & Silas", "Anatomy, botanical systems, acoustic vibration, diurnal cycles"),
            ("🤝 Social-Emotional & Relational", "Aquaria / Nerissa & Ronan", "Emotional self-awareness, empathy, cooperative circle rituals")
        ]
        for name, land, desc in domains:
            click.echo(f"  • {name:<35}\n    Anchor: {land}\n    Focus:  {desc}\n")


@main.command(name="generate")
@click.argument("track")
@click.option("--format", "-f", "output_format", type=click.Choice(["md", "html", "json", "all"]), default="md", help="Output format.")
@click.option("--output-dir", "-o", default=".", help="Directory to save output files.")
@click.option("--age-group", default="Ages 2–7 (Pre-K to Grade 1)", help="Target age group.")
@click.option("--stdout", is_flag=True, help="Print content directly to stdout.")
def generate_lesson(track: str, output_format: str, output_dir: str, age_group: str, stdout: bool):
    """Generate a single 10–15 min screen-free lesson package for a track."""
    engine = CurriculumEngine()
    try:
        lesson = engine.generate_lesson(track, age_group=age_group)
    except ValueError as e:
        click.secho(f"Error: {e}", fg="red")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)
    slug = lesson.track_slug

    if stdout and output_format == "md":
        click.echo(export_markdown(lesson))
        return
    elif stdout and output_format == "json":
        click.echo(export_json(lesson))
        return

    # Write files
    saved_files = []
    if output_format in ["md", "all"]:
        path = os.path.join(output_dir, f"{slug}.md")
        with open(path, "w", encoding="utf-8") as f:
            f.write(export_markdown(lesson))
        saved_files.append(path)

    if output_format in ["html", "all"]:
        path = os.path.join(output_dir, f"{slug}.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(export_html(lesson))
        saved_files.append(path)

    if output_format in ["json", "all"]:
        path = os.path.join(output_dir, f"{slug}.json")
        with open(path, "w", encoding="utf-8") as f:
            f.write(export_json(lesson))
        saved_files.append(path)

    click.secho(f"✓ Generated lesson package for '{lesson.title}' (Track {lesson.track_id}):", fg="green", bold=True)
    for p in saved_files:
        click.echo(f"  📄 {p}")


@main.command(name="batch")
@click.option("--all", "all_tracks", is_flag=True, help="Generate lessons for all 19 tracks.")
@click.option("--land", help="Generate all tracks for a specific Land (e.g., vitalis, numeria, harmonia).")
@click.option("--format", "-f", "output_format", type=click.Choice(["md", "html", "json", "all"]), default="all", help="Output format.")
@click.option("--output-dir", "-o", default="./curriculum_batch", help="Output directory for the package.")
@click.option("--age-group", default="Ages 2–7 (Pre-K to Grade 1)", help="Target age group.")
def batch_generate(all_tracks: bool, land: Optional[str], output_format: str, output_dir: str, age_group: str):
    """Batch-produce multi-lesson classroom curriculum packages."""
    if not all_tracks and not land:
        click.secho("Error: Please specify either --all or --land <land_id>.", fg="red")
        click.echo("Example: soe-curriculum-cli batch --all -o ./soe_full_curriculum")
        click.echo("Example: soe-curriculum-cli batch --land vitalis -o ./vitalis_pack")
        sys.exit(1)

    engine = CurriculumEngine()
    os.makedirs(output_dir, exist_ok=True)

    if all_tracks:
        title = "The Sound of Essentials: Rhythm Quest — Complete 19-Track Curriculum Suite"
        lessons = engine.generate_all_lessons(age_group=age_group)
    else:
        land_info = engine.data_loader.get_land(land)
        land_name = land_info.name if land_info else land.capitalize()
        title = f"SOE Rhythm Quest: {land_name} Domain Package"
        lessons = engine.generate_land_lessons(land, age_group=age_group)

    click.secho(f"\n🚀 Batch-producing {len(lessons)} classroom lesson packages in '{output_dir}'...", fg="cyan", bold=True)

    # Write individual lessons
    for lesson in lessons:
        slug = lesson.track_slug
        if output_format in ["md", "all"]:
            with open(os.path.join(output_dir, f"{slug}.md"), "w", encoding="utf-8") as f:
                f.write(export_markdown(lesson))
        if output_format in ["html", "all"]:
            with open(os.path.join(output_dir, f"{slug}.html"), "w", encoding="utf-8") as f:
                f.write(export_html(lesson))
        if output_format in ["json", "all"]:
            with open(os.path.join(output_dir, f"{slug}.json"), "w", encoding="utf-8") as f:
                f.write(export_json(lesson))
        click.echo(f"  ✓ {lesson.domain_icon} Track {lesson.track_id:02d}: {lesson.title}")

    # Generate master index / booklet
    if output_format in ["md", "all"]:
        index_md = export_batch_index_markdown(lessons, title=title)
        with open(os.path.join(output_dir, "INDEX.md"), "w", encoding="utf-8") as f:
            f.write(index_md)
        click.echo("  📑 Generated INDEX.md")

    if output_format in ["html", "all"]:
        bundle_html = export_batch_html(lessons, title=title)
        with open(os.path.join(output_dir, "CURRICULUM_BOOKLET.html"), "w", encoding="utf-8") as f:
            f.write(bundle_html)
        click.echo("  🖨️ Generated CURRICULUM_BOOKLET.html (Print-Ready)")

    if output_format in ["json", "all"]:
        bundle_json = export_batch_json(lessons)
        with open(os.path.join(output_dir, "curriculum_bundle.json"), "w", encoding="utf-8") as f:
            f.write(bundle_json)
        click.echo("  📦 Generated curriculum_bundle.json")

    click.secho(f"\n✨ Batch generation complete! {len(lessons)} lessons ready in {output_dir}\n", fg="green", bold=True)


@main.command(name="standards")
@click.option("--output", "-o", default="elof_standards_crosswalk.md", help="Output file path.")
@click.option("--format", "-f", "output_format", type=click.Choice(["md", "json"]), default="md")
def export_standards_report(output: str, output_format: str):
    """Export the Head Start ELOF and NAEYC standards crosswalk matrix."""
    loader = DataLoader()
    engine = CurriculumEngine(data_loader=loader)
    lessons = engine.generate_all_lessons()

    if output_format == "json":
        import json
        data = {
            "title": "SOE Rhythm Quest State DOE & Head Start Standards Crosswalk",
            "frameworks": ["Head Start ELOF", "NAEYC Program Standards", "Kindergarten Readiness"],
            "crosswalk": [
                {
                    "track_id": l.track_id,
                    "title": l.title,
                    "land": l.land_name,
                    "elof_codes": l.standards.elof_codes,
                    "naeyc_standards": l.standards.naeyc_standards,
                    "kindergarten_readiness": l.standards.kindergarten_readiness
                }
                for l in lessons
            ]
        }
        content = json.dumps(data, indent=2, ensure_ascii=False)
    else:
        rows = []
        for l in lessons:
            elof = "<br>".join(l.standards.elof_codes)
            naeyc = "<br>".join(l.standards.naeyc_standards)
            rows.append(
                f"| **Track {l.track_id}: {l.title}**<br>({l.land_name}) | {elof} | {naeyc} | {l.standards.kindergarten_readiness} |"
            )
        table_rows = "\n".join(rows)
        content = f"""# 🏛️ SOE Rhythm Quest: State DOE & Head Start Standards Crosswalk
> **Target:** State Departments of Education (State DOEs), Head Start Collaboration Offices (HSSCO), and NAEYC Accredited Centers  
> **Pedagogical Alignment:** Screen-Free, Music-Powered 5-Domain Early Learning Curriculum

---

## 📋 Comprehensive Crosswalk Matrix (19 Tracks)

| Track & Land | Head Start ELOF Codes | NAEYC Early Learning Standards | Kindergarten Readiness Target |
| :--- | :--- | :--- | :--- |
{table_rows}

---

## 🎯 Compliance Summary for State RFP Filings
- **Whole-Child Coverage:** 100% compliance across all 5 Head Start Central Domains.
- **Screen-Free Mandate:** 0 hours screen time; 100% active acoustic and tactile participation.
- **Low-Cost Deployment:** Uses zero-prep everyday materials (wooden spoons, scarves, floor tape).

*Generated by `soe-curriculum-cli` for Stage 3 Enterprise B2B State DOE procurement.*
"""

    with open(output, "w", encoding="utf-8") as f:
        f.write(content)

    click.secho(f"✓ Standards crosswalk matrix exported to: {output}", fg="green", bold=True)


@main.command(name="repl")
def interactive_repl():
    """Start an interactive REPL session for teachers and curriculum designers."""
    click.secho("╔══════════════════════════════════════════════════════════════════╗", fg="cyan")
    click.secho("║  SOE Curriculum Interactive REPL — Rhythm Quest Lesson Studio     ║", fg="cyan", bold=True)
    click.secho("╚══════════════════════════════════════════════════════════════════╝", fg="cyan")
    click.echo("Type track name or number (e.g. 'drill-time', '7', 'numbers') or 'help', 'quit'.\n")

    loader = DataLoader()
    engine = CurriculumEngine(loader)

    while True:
        try:
            cmd = input(click.style("soe-curriculum> ", fg="yellow", bold=True)).strip()
        except (EOFError, KeyboardInterrupt):
            click.echo("\nGoodbye!")
            break

        if not cmd:
            continue
        if cmd.lower() in ["quit", "exit", "q"]:
            click.echo("Exiting REPL. Keep learning in rhythm!")
            break
        elif cmd.lower() in ["help", "h"]:
            click.echo("Commands:\n  list           - List all tracks\n  <track>        - Preview lesson extension for track\n  batch <land>   - Batch generate lessons for a land\n  quit           - Exit REPL")
            continue
        elif cmd.lower() == "list":
            for t in loader.tracks:
                click.echo(f"  Track {t.id:02d}: {t.title} ({t.slug})")
            continue

        # Try to find track
        track = loader.get_track(cmd)
        if track:
            lesson = engine.generate_lesson(track.slug)
            click.secho(f"\n=== {lesson.domain_icon} Track {lesson.track_id}: {lesson.title} ({lesson.land_name}) ===", fg="green", bold=True)
            click.secho(f"Guides: {lesson.hero_guides} | Duration: {lesson.duration}", fg="cyan")
            click.echo(f"\n🎯 MISSION:\n{lesson.quest_mission}")
            click.echo(f"\n🥁 RHYTHM IGNITION (2 Min):\n{lesson.rhythm_ignition}")
            click.echo(f"\n🖐️ TACTILE DISCOVERY (7 Min):\n{lesson.tactile_ritual}")
            click.secho(f"\n🌟 TEACHER WHISPER:\n{lesson.teacher_whisper}\n", fg="yellow")
        else:
            click.secho(f"Unrecognized track or command: '{cmd}'. Type 'list' or 'help'.", fg="red")


if __name__ == "__main__":
    main()
