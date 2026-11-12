import pytest
from soe_mcls.meta_launcher import MetaCampaignLauncher
from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer

def test_meta_campaign_payload_structure():
    launcher = MetaCampaignLauncher(dry_run=True)
    bundle = launcher.prepare_full_campaign_launch(
        campaign_key="THE_ENEMY",
        delta_key="SCREEN_VS_SENSORY",
        daily_budget_cents=5000,
        buyer_track="D2C",
        language="en",
        archetype_ids=["ARC-01", "ARC-02", "ARC-03"],
        engine_type="ENGINE_A_VALUE_GATE"
    )
    assert bundle["campaign_spec"]["objective"] == "OUTCOME_SALES"
    assert bundle["campaign_spec"]["daily_budget"] == 5000
    assert len(bundle["ad_specs"]) == 3
    assert bundle["adset_spec"]["targeting"]["age_min"] == 24

def test_rhythm_guardian_kill_and_scale_decisions():
    guardian = RhythmGuardianOptimizer(
        max_lead_cpa_dollars=2.50,
        min_ctr_percent=0.8,
        min_spend_for_decision_dollars=10.0
    )
    metrics = [
        # Bleeding Engine A ad: spent $18, 0 leads, CTR 0.45% -> PAUSE
        {"ad_id": "ad_loser_1", "engine_type": "ENGINE_A_VALUE_GATE", "spend": 18.0, "leads": 0, "purchases": 0, "ctr": 0.45, "current_budget_cents": 3000},
        # Winning Engine A ad: spent $25, 15 leads ($1.66 CPA) -> SCALE +20%
        {"ad_id": "ad_winner_1", "engine_type": "ENGINE_A_VALUE_GATE", "spend": 25.0, "leads": 15, "purchases": 0, "ctr": 2.10, "current_budget_cents": 5000},
        # Learning Engine A ad: spent $4, 0 leads -> HOLD
        {"ad_id": "ad_learning_1", "engine_type": "ENGINE_A_VALUE_GATE", "spend": 4.0, "leads": 0, "purchases": 0, "ctr": 1.10, "current_budget_cents": 3000},
    ]
    decisions = guardian.evaluate_ads(metrics)
    assert decisions["ad_loser_1"]["action"] == "PAUSE"
    assert decisions["ad_winner_1"]["action"] == "SCALE_BUDGET"
    assert decisions["ad_winner_1"]["new_budget_cents"] == 6000  # +20% of 5000
    assert decisions["ad_learning_1"]["action"] == "HOLD"


def test_rhythm_guardian_adversarial_review_and_anti_shiny_object():
    guardian = RhythmGuardianOptimizer()

    # 1. Valid canon-locked & funnel-aligned proposal -> APPROVED
    good = guardian.review_proposal_adversarial({
        "unit_key": "MCLS-STUDIO",
        "title": "Ad18: If They Can't Rhyme (Ages 2–7 Harmonia Phonics)",
        "description": "3-Layer meta ad anchored on Kenji & Aiko phonics rhyming.",
        "target_route": "https://soelearn.com/listen",
        "visual_reference": "The Sound of Essentials Image Assets/Canonical Master Visuals/Pond Aiko_Kenji.png",
        "requires_visual": True,
    })
    assert good["approved"] is True
    assert good["verdict"] == "APPROVED"

    # 2. Age creep / retired entity -> BLOCKED_CANON
    bad_canon = guardian.review_proposal_adversarial({
        "unit_key": "MCLS-PULSE",
        "title": "Ages 2-8 guide featuring Marcus",
        "description": "No credit card required.",
        "target_route": "/listen",
    })
    assert bad_canon["approved"] is False
    assert bad_canon["verdict"] == "BLOCKED_CANON"
    assert len(bad_canon["canon_violations"]) == 3

    # 3. Shiny-object / Linktree distraction -> SHINY_OBJECT_HOLD
    shiny = guardian.review_proposal_adversarial({
        "unit_key": "MCLS-PRIME",
        "title": "Launch crypto token and Linktree storefront",
        "description": "Side quest outside core SOE curriculum.",
        "target_route": "https://linktr.ee/random",
    })
    assert shiny["approved"] is False
    assert shiny["verdict"] == "SHINY_OBJECT_HOLD"
    assert len(shiny["shiny_object_flags"]) >= 2
