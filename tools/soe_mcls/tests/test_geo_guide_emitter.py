import json
from pathlib import Path

import pytest

from soe_mcls.geo_guide_emitter import (
    compile_pulse_topic_to_geo_guide,
    emit_guides_from_pulse_file,
    enforce_canon_guards,
    parse_pulse_brief,
)


SAMPLE_PULSE = """# ⚡ MCLS Pulse Brief — 2026-11-19

## Topic 1: The "Freeze & Guess" CVC Blending Wall (Sound-First Rhythm vs. Choppy Segmenting)

* **Live Community Signal (`r/kindergarten`, `r/teachers`):** Parents and kindergarten teachers report children freezing on CVC words when taught choppy segmenting instead of continuous sound blending.
* **MCLS Moat & Delta:** **Moat 1 (Phonics & Rhythm Engine)** • **Δ2 Testing vs. Arts**

### Ready-to-Deploy Meta Ad Draft (`Ad_ContinuousSoundBeforePrint`)
* **Wave 3 `Get X Without Y` Hook:** Get effortless sound blending without choppy flashcard drills or guessing tears.
* **Headline:** Phonics That Flows Before Flashcards
* **Primary Text (3-Layer Rule):**
  > Many young kids know individual letter sounds yet freeze or guess the second they see a real word on a page.
  > Crafted by a father's heart and a mother's love for ages 2–7 (Pre-K to Grade 2), The Sound of Essentials: Rhythm Quest trains the ear before the eye with 19 studio-recorded tracks and 400 tactile quests across Harmonia with Kenji and Aiko.
  > Stream all 19 tracks free at soelearn.com/listen.

## Topic 2: "Swiping Paper Books" & The Tablet Dopamine Crash

* **Live News & Educator Signal (`EdWeek` / `r/Parenting`):** Preschool teachers see toddlers trying to swipe paper pages like a tablet after high-stimulation screen sessions.
* **MCLS Moat & Delta:** **Moat 2 (Physical Heirloom Sanctuary)** • **Δ1 Screen vs. Sensory**

### Ready-to-Deploy Meta Ad Draft (`Ad_NoSwipeSanctuary`)
* **Wave 3 `Get X Without Y` Hook:** Build calm print readiness without the iPad dopamine crash.
* **Headline:** Real Music & Tactile Books — Zero Screen Crash
* **Primary Text (3-Layer Rule):**
  > Preschool teachers are seeing toddlers try to swipe paper pages like a tablet while parents battle post-screen tantrums.
  > Crafted by a father's heart and a mother's love for ages 2–7, The Sound of Essentials: Rhythm Quest pairs 19 studio-recorded songs with physical heirlooms—the Rhythm Ready Workbook ($21 digital / $35 print) and our 4,000+ word Essential Picture Dictionary (reserve your copy for $55).
  > Stream all 19 tracks free at soelearn.com/listen.
"""


def test_parse_and_compile_pulse_brief_blueprint_fields():
    parsed = parse_pulse_brief(SAMPLE_PULSE, source_filename="MCLS_Pulse_2026-11-19.md")
    assert parsed["pulse_date"] == "2026-11-19"
    assert len(parsed["topics"]) == 2

    g1 = compile_pulse_topic_to_geo_guide(parsed["topics"][0], parsed["pulse_date"], parsed["source_pulse"])
    g2 = compile_pulse_topic_to_geo_guide(parsed["topics"][1], parsed["pulse_date"], parsed["source_pulse"])

    # Blueprint B2/B3: Zero prices or emojis in SERP meta fields
    for g in (g1, g2):
        assert "$" not in g["metaTitle"]
        assert "$" not in g["metaDescription"]
        assert "⚡" not in g["metaTitle"]
        assert g["type"] == "guide"
        assert g["author"]["name"]
        assert len(g["directAnswer"]) > 80
        assert len(g["factBullets"]) >= 3
        assert any("(" in b and ")" in b for b in g["factBullets"])
        assert len(g["internalLinks"]) >= 5
        assert g["ctaBlock"]["buttonUrl"] == "/listen?unlocked=true"
        assert g["heroImg"].startswith("/assets/characters/")
        assert g["heroImg"].endswith(".webp")
        assert not g["deltaSummary"]["problem"].startswith(">")
        assert not g["deltaSummary"]["soeSolution"].startswith(">")
        assert len(g["deltaSummary"]["soeSolution"]) > 50

    assert g1["land"] == "Harmonia"
    assert g2["land"] == "Aquaria"


def test_emit_guides_idempotent_upsert(tmp_path: Path):
    pulse_file = tmp_path / "MCLS_Pulse_2026-11-19.md"
    pulse_file.write_text(SAMPLE_PULSE, encoding="utf-8")
    out_file = tmp_path / "geoGuides.json"

    first = emit_guides_from_pulse_file(pulse_file, out_file)
    second = emit_guides_from_pulse_file(pulse_file, out_file)

    assert len(first) == 2
    assert len(second) == 2
    saved = json.loads(out_file.read_text(encoding="utf-8"))
    assert len(saved) == 2
    assert len({g["slug"] for g in saved}) == 2


@pytest.mark.parametrize(
    "mutator,expected_msg",
    [
        (lambda g: g.update({"directAnswer": "Designed for Ages 2-8 kids."}), "Age creep"),
        (lambda g: g.update({"directAnswer": "Recorded with live instruments in studio."}), "live instrumentation"),
        (lambda g: g.update({"directAnswer": "Checkout on Shopify today."}), "Shopify"),
        (lambda g: g.update({"directAnswer": "Join our pre-sale for the dictionary."}), "reserve your copy"),
        (lambda g: g.update({"metaTitle": "Save $21 on Phonics Guide"}), "Rule B2"),
        (lambda g: g.update({"metaDescription": "Great screen-free guide 🔥"}), "Rule B3"),
        (lambda g: g.update({"heroImg": "/assets/random-stock.jpg"}), "Canonical Visual Lock"),
    ],
)
def test_enforce_canon_guards_blocks_violations(mutator, expected_msg):
    parsed = parse_pulse_brief(SAMPLE_PULSE, source_filename="MCLS_Pulse_2026-11-19.md")
    guide = compile_pulse_topic_to_geo_guide(parsed["topics"][0], "2026-11-19", "MCLS_Pulse_2026-11-19.md")
    mutator(guide)
    with pytest.raises(ValueError, match=expected_msg):
        enforce_canon_guards(guide)
