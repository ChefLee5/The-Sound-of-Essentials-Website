from fastapi.testclient import TestClient

from soe_mcls.main import app
from soe_mcls.google_ads_launcher import GoogleAdsCampaignLauncher
from soe_mcls.pinterest_launcher import PinterestCampaignLauncher, PINTEREST_PINS
from soe_mcls.x_ads_launcher import XAdsAndPulseLauncher
from soe_mcls.reddit_ads_launcher import RedditAdsAndCrawlerLauncher
from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer


client = TestClient(app)


def test_google_ads_stags_and_rsa_character_limits():
    launcher = GoogleAdsCampaignLauncher(dry_run=True)
    bundle = launcher.prepare_google_campaign_launch(daily_budget_cents=2000)
    assert bundle["rsa_audit_passed"] is True
    assert bundle["rsa_audit_failures"] == []
    assert len(bundle["ad_groups"]) == 7
    assert any(g["stag_key"] == "STAG_1E_NEURO_SENSORY" for g in bundle["ad_groups"])
    assert bundle["youtube_shorts_companion"]["status"] == "PAUSED"
    dispatch = launcher.dispatch_campaign(bundle)
    assert dispatch["status"] == "SIMULATED_SUCCESS"


def test_pinterest_niche_bend_pins_and_cpa_ceiling():
    assert len(PINTEREST_PINS) >= 9
    assert any(p["id"] == "pin_06_neural_pathways" for p in PINTEREST_PINS)
    assert any(p["id"] == "pin_07_sensory_regulation" for p in PINTEREST_PINS)
    launcher = PinterestCampaignLauncher(dry_run=True)
    bundle = launcher.prepare_pinterest_campaign_launch(
        campaign_name="Seriphia Signal Niche Bends",
        daily_budget_cents=1500,
        target_pin_ids=["pin_06_neural_pathways", "pin_07_sensory_regulation"],
    )
    assert len(bundle["ad_specs"]) == 2


def test_x_ads_and_atproto_signal_generation():
    launcher = XAdsAndPulseLauncher(dry_run=True)
    bundle = launcher.prepare_x_campaign_launch(daily_budget_cents=1000)
    assert bundle["campaign_spec"]["entity_status"] == "PAUSED"
    assert len(bundle["promoted_threads"]) == 2
    atproto = launcher.build_atproto_signal_post("x_thread_50_percent_floor")
    assert atproto["protocol"] == "AT_PROTOCOL"
    assert len(atproto["record"]["text"]) <= 300


def test_reddit_crawler_dedup_and_ads_payload():
    launcher = RedditAdsAndCrawlerLauncher(dry_run=True)
    threads = [
        {
            "subreddit": "ScienceBasedParenting",
            "title": "Screen free phonics vs reading app for 4 year old?",
            "body": "Looking for auditory phonics without tablet meltdowns.",
            "url": "https://reddit.com/r/ScienceBasedParenting/comments/1",
        },
        {
            "subreddit": "ScienceBasedParenting",
            "title": "Screen free phonics vs reading app for 4 year old?",
            "body": "Looking for auditory phonics without tablet meltdowns.",
            "url": "https://reddit.com/r/ScienceBasedParenting/comments/1",
        },
        {
            "subreddit": "cooking",
            "title": "Best skillet?",
            "body": "Cast iron vs stainless.",
            "url": "https://reddit.com/r/cooking/comments/2",
        },
    ]
    staged = launcher.score_and_filter_threads(threads)
    assert len(staged) == 1
    assert "soelearn.com/downloads/SOE_5_Neural_Pathways_Guide.html" in staged[0]["draft_reply"]

    ads = launcher.prepare_reddit_campaign_launch(daily_budget_cents=1000)
    assert ads["campaign_spec"]["configured_status"] == "PAUSED"
    assert len(ads["promoted_posts"]) == 2


def test_rhythm_guardian_channel_specific_cpa_ceilings():
    guardian = RhythmGuardianOptimizer()
    decisions = guardian.evaluate_ads([
        {
            "ad_id": "pin_high_cpa",
            "channel": "PINTEREST",
            "engine_type": "ENGINE_A_VALUE_GATE",
            "spend": 21.0,
            "leads": 10,  # $2.10 > $1.80 Pinterest ceiling
            "ctr": 0.60,
            "current_budget_cents": 1500,
        },
        {
            "ad_id": "google_win",
            "channel": "GOOGLE",
            "engine_type": "ENGINE_A_VALUE_GATE",
            "spend": 20.0,
            "leads": 10,  # $2.00 <= $2.50 Google ceiling
            "ctr": 3.20,
            "current_budget_cents": 2000,
        },
    ])
    assert decisions["pin_high_cpa"]["action"] == "PAUSE"
    assert decisions["google_win"]["action"] == "SCALE_BUDGET"
    assert decisions["google_win"]["new_budget_cents"] == 2400


def test_multichannel_fastapi_endpoints():
    status_res = client.get("/api/v1/channels/status")
    assert status_res.status_code == 200
    assert status_res.json()["meta"]["status"] == "PAUSED_AUTOMATION_COOLDOWN"

    g_res = client.post("/api/v1/google/launch", json={"daily_budget_cents": 2000})
    assert g_res.status_code == 200
    assert g_res.json()["status"] == "SIMULATED_SUCCESS"

    x_res = client.post("/api/v1/x/launch", json={"daily_budget_cents": 1000})
    assert x_res.status_code == 200
    assert x_res.json()["atproto_post"]["protocol"] == "AT_PROTOCOL"

    r_res = client.post("/api/v1/reddit/launch", json={"daily_budget_cents": 1000})
    assert r_res.status_code == 200
    assert r_res.json()["status"] == "SIMULATED_SUCCESS"
