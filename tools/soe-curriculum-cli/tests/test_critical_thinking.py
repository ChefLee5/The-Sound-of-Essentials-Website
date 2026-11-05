"""
Deterministic verification suite for SOE Critical Thinking Curriculum Expansion.
Verifies full syllabus extraction fidelity, 7-Land x 5-Strategy symmetry,
70-unit remodelled catalog completeness, and strict SOE canon compliance.
"""

import json
from click.testing import CliRunner
from soe_curriculum.cli import main
from soe_curriculum.critical_thinking import (
    SYLLABUS_CHAPTERS,
    CRITICAL_THINKING_STRATEGIES,
    SUPPLEMENTAL_DIMENSIONS,
    REMODELLED_LESSON_CATALOG,
    SOE_SOCRATIC_QUESTS,
    INTELLECTUAL_STANDARDS,
    SOCRATIC_TAXONOMY,
    export_foundation_json,
    export_socratic_quest_markdown,
    get_strategies_by_land,
    get_remodelled_units_by_land,
)

CANONICAL_LANDS = {
    "harmonia",
    "numeria",
    "vitalis",
    "luminosity",
    "aquaria",
    "terrasol",
    "celestia",
}


def test_syllabus_chapters_completeness():
    assert len(SYLLABUS_CHAPTERS) == 16
    part1 = [c for c in SYLLABUS_CHAPTERS if c.part.startswith("Part I:")]
    part2 = [c for c in SYLLABUS_CHAPTERS if c.part.startswith("Part II:")]
    assert len(part1) == 9
    assert len(part2) == 7
    assert [c.chapter_number for c in SYLLABUS_CHAPTERS] == list(range(1, 17))


def test_35_strategies_and_7_land_symmetry():
    assert len(CRITICAL_THINKING_STRATEGIES) == 35
    codes = {s.code for s in CRITICAL_THINKING_STRATEGIES}
    expected_codes = {f"S-{i}" for i in range(1, 36)}
    assert codes == expected_codes

    # Verify exact category counts matching textbook (9 Affective, 17 Macro, 9 Micro)
    affective = [s for s in CRITICAL_THINKING_STRATEGIES if s.category == "Affective"]
    macro = [s for s in CRITICAL_THINKING_STRATEGIES if s.category == "Cognitive Macro-Ability"]
    micro = [s for s in CRITICAL_THINKING_STRATEGIES if s.category == "Cognitive Micro-Skill"]
    assert len(affective) == 9
    assert len(macro) == 17
    assert len(micro) == 9

    # Verify exact 5-per-Land distribution across all 7 canonical Lands
    for land in CANONICAL_LANDS:
        land_strats = get_strategies_by_land(land_id=land)
        assert len(land_strats) == 5, f"Expected 5 strategies for {land}, got {len(land_strats)}"

    assert len(SUPPLEMENTAL_DIMENSIONS) == 4
    assert len(INTELLECTUAL_STANDARDS) == 12
    assert len(SOCRATIC_TAXONOMY) == 6


def test_70_remodelled_units_completeness():
    assert len(REMODELLED_LESSON_CATALOG) == 70
    la = [u for u in REMODELLED_LESSON_CATALOG if u.source_domain == "Language Arts"]
    ss = [u for u in REMODELLED_LESSON_CATALOG if u.source_domain == "Social Studies"]
    sci = [u for u in REMODELLED_LESSON_CATALOG if u.source_domain == "Science"]
    math = [u for u in REMODELLED_LESSON_CATALOG if u.source_domain == "Mathematics"]
    thematic = [u for u in REMODELLED_LESSON_CATALOG if u.source_domain == "Holistic Thematic Unit"]

    assert len(la) == 23
    assert len(ss) == 26
    assert len(sci) == 18
    assert len(math) == 2
    assert len(thematic) == 1
    assert len(la) + len(ss) + len(sci) + len(math) == 69

    for u in REMODELLED_LESSON_CATALOG:
        assert u.soe_land_id in CANONICAL_LANDS
        assert 120 <= u.pdf_page <= 305


def test_flagship_quests_and_cli_export(tmp_path):
    assert set(SOE_SOCRATIC_QUESTS.keys()) == CANONICAL_LANDS
    for land_id, quest in SOE_SOCRATIC_QUESTS.items():
        md = export_socratic_quest_markdown(quest)
        assert quest.land_name in md
        assert "Seriphia" in md
        assert "Ages 2–7" in md

    runner = CliRunner()
    res_strats = runner.invoke(main, ["strategies", "--land", "terrasol"])
    assert res_strats.exit_code == 0
    assert "S-5" in res_strats.output
    assert "Terrasol" in res_strats.output

    out_dir = tmp_path / "ct_pack"
    res_pack = runner.invoke(main, ["socratic-pack", "--all", "--output-dir", str(out_dir)])
    assert res_pack.exit_code == 0
    json_file = out_dir / "soe_critical_thinking_foundation.json"
    assert json_file.exists()
    parsed = json.loads(json_file.read_text(encoding="utf-8"))
    assert len(parsed["strategies_35"]) == 35
    assert len(parsed["remodelled_units_70"]) == 70
    assert len(parsed["workbook_block_k_40_day_schedule"]) == 40


def test_40_day_workbook_block_k_bijection_and_injection(tmp_path):
    from soe_curriculum.workbook_block_k import build_40_day_block_k_map, apply_block_k_to_workbook

    schedule = build_40_day_block_k_map()
    assert len(schedule) == 40

    codes = {entry.strategy_code for entry in schedule.values()}
    expected = {f"S-{i}" for i in range(1, 36)} | {f"D-{i}" for i in range(1, 5)} | {"S-ALL"}
    assert codes == expected

    # Create synthetic 8-week x 5-day workbook structure with blocks A-J
    mock_wb = {
        "title": "SOE Test Workbook",
        "grades": "Ages 2–7 (Pre-K to Grade 2)",
        "weeks": [
            {
                "week": w,
                "days": [
                    {
                        "week": w,
                        "day": d,
                        "blocks": {k: {"title": f"Block {k}"} for k in "ABCDEFGHIJ"},
                    }
                    for d in range(1, 6)
                ],
            }
            for w in range(1, 9)
        ],
    }
    wb_file = tmp_path / "workbook_content.json"
    wb_file.write_text(json.dumps(mock_wb), encoding="utf-8")

    stats = apply_block_k_to_workbook(wb_file, write=True)
    assert stats["days_updated"] == 40
    assert stats["blocks_per_day"] == 11
    assert stats["total_activities"] == 440

    updated = json.loads(wb_file.read_text(encoding="utf-8"))
    w1d1_k = updated["weeks"][0]["days"][0]["blocks"]["K"]
    assert w1d1_k["strategy_code"] == "S-6"
    assert w1d1_k["char_img"] == "seriphia.png"
    assert "Seriphia says:" in w1d1_k["tip"]


