"""
SOE-MCLS Google Search & YouTube Ads Launcher (Argon v3.0 STAG Specification).
Supports Coliseum Intent STAGs, Niche-Bend Neuro/Sensory STAG 1E, Competitor
Intercepts, and YouTube Shorts Seriphia Signal campaigns in PAUSED safety state.
"""

from typing import Any, Dict, List, Optional
from soe_mcls.config import settings

GOOGLE_STAGS: Dict[str, Dict[str, Any]] = {
    "STAG_1A_SCREEN_FREE": {
        "name": "STAG 1A — Screen-Free Early Learning",
        "delta": "SCREEN_VS_SENSORY",
        "final_url": f"{settings.BASE_DOMAIN}/signal?utm_source=google&utm_medium=cpc&utm_campaign=coliseum&utm_content=screen_free",
        "keywords": [
            {"text": "screen free learning for kids", "match_type": "EXACT"},
            {"text": "screen free phonics program", "match_type": "EXACT"},
            {"text": "teach child to read without screens", "match_type": "PHRASE"},
        ],
        "headlines": [
            "Screen-Free Learning Ages 2-7",
            "Screen-Free Phonics (Ages 2-7)",
            "Get The Free 19-Track Album",
            "Zero Apps. Zero Algorithms.",
            "Pre-K To Grade 2 Literacy",
        ],
        "descriptions": [
            "Designed for the developing brain. Stream 19 studio tracks and 3 printable guides free.",
            "Replace tablet battles with 7 Lands of rhythm, phonics, and tactile books for Ages 2-7.",
        ],
    },
    "STAG_1B_TACTILE_WORKBOOKS": {
        "name": "STAG 1B — Phonics Workbooks & Tactile",
        "delta": "INSTITUTION_VS_SANCTUARY",
        "final_url": f"{settings.BASE_DOMAIN}/rhythm-ready?utm_source=google&utm_medium=cpc&utm_campaign=coliseum&utm_content=tactile_workbooks",
        "keywords": [
            {"text": "phonics workbooks for kindergarten", "match_type": "EXACT"},
            {"text": "hands on phonics curriculum", "match_type": "EXACT"},
            {"text": "pre k reading workbooks", "match_type": "PHRASE"},
        ],
        "headlines": [
            "Phonics Workbooks & Audio",
            "Hands-On Phonics (Ages 2-7)",
            "Includes Free 19-Track Album",
            "No Screens. Real Paper Books.",
            "40-Day Kindergarten Readiness",
        ],
        "descriptions": [
            "Pair 400 tactile workbook activities with 19 studio recordings for Ages 2 to 7.",
            "Instant Digital PDF ($21) or Physical Print ($45 Free US Shipping). Listen free first.",
        ],
    },
    "STAG_1C_MUSIC_LITERACY": {
        "name": "STAG 1C — Music & Rhythm Literacy",
        "delta": "TESTING_VS_ARTS",
        "final_url": f"{settings.BASE_DOMAIN}/signal?utm_source=google&utm_medium=cpc&utm_campaign=coliseum&utm_content=music_literacy",
        "keywords": [
            {"text": "music based phonics program", "match_type": "EXACT"},
            {"text": "learn to read with music", "match_type": "EXACT"},
            {"text": "phonics songs for kindergarten", "match_type": "PHRASE"},
        ],
        "headlines": [
            "Music-Based Phonics Program",
            "Learn To Read With Music 2-7",
            "Stream 19 Studio Tracks Free",
            "Sound Before Symbol Method",
            "7 Musical Story Lands",
        ],
        "descriptions": [
            "Help young ears decode phonemes through 19 master studio recordings for Ages 2 to 7.",
            "Acoustic rhythms calm the mind and build reading readiness without glowing screens.",
        ],
    },
    "STAG_1D_SOCRATIC_CRITICAL": {
        "name": "STAG 1D — Critical Thinking & Socratic Inquiry",
        "delta": "TESTING_VS_ARTS",
        "final_url": f"{settings.BASE_DOMAIN}/signal?utm_source=google&utm_medium=cpc&utm_campaign=coliseum&utm_content=critical_thinking",
        "keywords": [
            {"text": "critical thinking for preschoolers", "match_type": "EXACT"},
            {"text": "socratic method for kids", "match_type": "EXACT"},
            {"text": "screen free logic games for kids", "match_type": "PHRASE"},
        ],
        "headlines": [
            "Early Critical Thinking 2-7",
            "Socratic Stories & Music",
            "Free 19-Track Signal + Guides",
            "Built For Brains, Not Screens",
            "Pre-K To Grade 2 Inquiry",
        ],
        "descriptions": [
            "Replace rote guessing drills with Socratic wonder across 7 Lands for Ages 2 to 7.",
            "Unlock 19 studio songs and the 5 Neural Pathways Field Guide free at soelearn.com.",
        ],
    },
    "STAG_1E_NEURO_SENSORY": {
        "name": "STAG 1E — Neuro-Parenting & Sensory Regulation",
        "delta": "SCREEN_VS_SENSORY",
        "final_url": f"{settings.BASE_DOMAIN}/signal?utm_source=google&utm_medium=cpc&utm_campaign=coliseum&utm_content=sensory_regulation",
        "keywords": [
            {"text": "sensory regulation music toddler", "match_type": "EXACT"},
            {"text": "calming acoustic music kids adhd", "match_type": "PHRASE"},
            {"text": "screen free sensory activities 2-7", "match_type": "PHRASE"},
        ],
        "headlines": [
            "Calm Sensory Audio Ages 2-7",
            "60-80 BPM Reset Without Apps",
            "Free Sensory & Rhythm Guide",
            "Stop Screen Time Meltdowns",
            "OT & Parent Field Guides",
        ],
        "descriptions": [
            "Calm post-screen dysregulation with 60-80 BPM studio music and bilateral movement.",
            "Get the free Sensory Regulation Guide plus all 19 studio recordings at /signal.",
        ],
    },
    "STAG_2A_ABCMOUSE_INTERCEPT": {
        "name": "STAG 2A — ABCmouse & App Intercept",
        "delta": "ALGORITHM_VS_HANDCRAFTED",
        "final_url": f"{settings.BASE_DOMAIN}/alternatives/abcmouse?utm_source=google&utm_medium=cpc&utm_campaign=intercept&utm_content=abcmouse",
        "keywords": [
            {"text": "abcmouse alternatives", "match_type": "EXACT"},
            {"text": "screen free alternative to abcmouse", "match_type": "EXACT"},
            {"text": "non digital alternative to abcmouse", "match_type": "PHRASE"},
        ],
        "headlines": [
            "Screen-Free ABCmouse Alt",
            "No Tablets. Real Phonics 2-7.",
            "Free 19-Track Studio Album",
            "Zero Apps. Zero Subscriptions.",
            "Handcrafted 7-Land Curriculum",
        ],
        "descriptions": [
            "Done with tablet subscriptions? Try 19 studio songs and tactile books for Ages 2 to 7.",
            "Built for developing brains, not algorithms. Stream all 19 songs free today.",
        ],
    },
    "STAG_2B_KUMON_INTERCEPT": {
        "name": "STAG 2B — Kumon & Rote Drill Intercept",
        "delta": "CONSUMPTION_VS_QUEST",
        "final_url": f"{settings.BASE_DOMAIN}/signal?utm_source=google&utm_medium=cpc&utm_campaign=intercept&utm_content=kumon",
        "keywords": [
            {"text": "kumon alternatives for preschoolers", "match_type": "EXACT"},
            {"text": "hands on alternative to kumon", "match_type": "PHRASE"},
            {"text": "stop rote memorization preschool", "match_type": "EXACT"},
        ],
        "headlines": [
            "Joyful Pre-K Alt To Drills",
            "Phonics & Rhythm (Ages 2-7)",
            "Free 19-Track Signal + Guides",
            "15 Mins A Day Across 7 Lands",
            "Tactile Books & Studio Music",
        ],
        "descriptions": [
            "Trade repetitive worksheet tears for 10 daily blocks of music and tactile discovery.",
            "Explore all 19 studio songs and 3 printable field guides free for Ages 2 to 7.",
        ],
    },
}


class GoogleAdsCampaignLauncher:
    """MCLS Extension: Google Search STAGs + YouTube Shorts Seriphia Signal Launcher."""

    def __init__(self, dry_run: bool = True):
        self.dry_run = dry_run
        self.api_version = "v18"

    @staticmethod
    def verify_rsa_limits(headlines: List[str], descriptions: List[str]) -> Dict[str, Any]:
        headline_violations = [h for h in headlines if len(h) > 30]
        desc_violations = [d for d in descriptions if len(d) > 90]
        return {
            "passed": len(headline_violations) == 0 and len(desc_violations) == 0,
            "headline_violations": headline_violations,
            "description_violations": desc_violations,
        }

    def prepare_google_campaign_launch(
        self,
        campaign_name: str = "SOE_Search_Coliseum_Intent_US",
        daily_budget_cents: int = 2000,
        stag_keys: Optional[List[str]] = None,
        include_youtube_shorts: bool = True,
    ) -> Dict[str, Any]:
        selected_keys = stag_keys or list(GOOGLE_STAGS.keys())
        ad_groups: List[Dict[str, Any]] = []
        rsa_audit_failures: List[Dict[str, Any]] = []

        for key in selected_keys:
            stag = GOOGLE_STAGS.get(key)
            if not stag:
                continue
            audit = self.verify_rsa_limits(stag["headlines"], stag["descriptions"])
            if not audit["passed"]:
                rsa_audit_failures.append({"stag": key, **audit})

            ad_groups.append({
                "stag_key": key,
                "name": stag["name"],
                "status": "PAUSED",
                "delta": stag["delta"],
                "final_url": stag["final_url"],
                "keywords": stag["keywords"],
                "rsa": {
                    "headlines": [{"text": h, "chars": len(h)} for h in stag["headlines"]],
                    "descriptions": [{"text": d, "chars": len(d)} for d in stag["descriptions"]],
                    "rsa_limits_passed": audit["passed"],
                },
            })

        youtube_brief = None
        if include_youtube_shorts:
            youtube_brief = {
                "campaign_name": "SOE_YouTube_Shorts_Seriphia_Signal",
                "status": "PAUSED",
                "remotion_composition": "TactileExplainer",
                "duration_seconds": 15,
                "hook_0_3s": "40% of 4th graders read below basic—yet schools banned zeros. Hear why sound comes first.",
                "destination_url": f"{settings.BASE_DOMAIN}/signal?utm_source=youtube&utm_medium=video&utm_campaign=seriphia_signal",
            }

        return {
            "channel": "GOOGLE_ADS",
            "customer_id": settings.GOOGLE_ADS_CUSTOMER_ID,
            "api_version": self.api_version,
            "campaign_spec": {
                "name": campaign_name,
                "advertising_channel_type": "SEARCH",
                "status": "PAUSED",
                "daily_budget_micros": int(daily_budget_cents) * 10000,
                "bidding_strategy": "MAXIMIZE_CONVERSIONS",
                "target_cpa_dollars": 2.50,
            },
            "ad_groups": ad_groups,
            "youtube_shorts_companion": youtube_brief,
            "rsa_audit_passed": len(rsa_audit_failures) == 0,
            "rsa_audit_failures": rsa_audit_failures,
        }

    def dispatch_campaign(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not payload.get("rsa_audit_passed", False):
            return {
                "status": "BLOCKED_RSA_LIMITS",
                "errors": payload.get("rsa_audit_failures", []),
            }
        return {
            "status": "SIMULATED_SUCCESS" if self.dry_run else "STAGED_PAUSED_READY",
            "mode": "SANDBOX_DRY_RUN" if self.dry_run else "GOOGLE_ADS_REST_PAUSED",
            "ad_groups_staged": len(payload.get("ad_groups", [])),
            "campaign_name": payload.get("campaign_spec", {}).get("name"),
        }
