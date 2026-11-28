"""
SOE-MCLS X.com Ads API v2, X-Pulse Cultural Receipts, and AT Protocol Syndication.
"""

from typing import Any, Dict, List, Optional
from soe_mcls.config import settings

X_PULSE_RECEIPT_THREADS: List[Dict[str, Any]] = [
    {
        "id": "x_thread_50_percent_floor",
        "delta": "INSTITUTION_VS_SANCTUARY",
        "niche_bend": "Neuro-Parenting & State of Emergency",
        "hook": "Why 40% of 4th graders read below basic while report cards claim everything is fine (Ages 2–7):",
        "posts": [
            "1/ National data shows 40% of U.S. 4th graders read below basic—yet 27% of surveyed teachers report 50% minimum grading floors that hide early gaps.",
            "2/ Decades of 'three-cueing' trained kids to guess words from pictures instead of decoding sounds. When Mississippi returned to systematic phonics, it jumped from 49th to 9th.",
            "3/ Reading starts in the ear during Ages 2–7. Answer Seriphia's Acoustic Signal: 19 master studio recordings (60–110 BPM) + 3 printable field guides free at soelearn.com/signal",
        ],
        "destination_url": f"{settings.BASE_DOMAIN}/signal?utm_source=x&utm_medium=organic_thread&utm_campaign=seriphia_signal&utm_content=50_percent_floor",
    },
    {
        "id": "x_thread_neuro_parenting",
        "delta": "SCREEN_VS_SENSORY",
        "niche_bend": "Neuro-Parenting & Sensory Regulation",
        "hook": "Parents don't need another screen app for toddlers. They need an applied 10-minute nervous-system instrument:",
        "posts": [
            "1/ Every podcast explains childhood neuroplasticity. Almost none hand parents a screen-free daily tool for Ages 2–7.",
            "2/ In Rhythm Quest, steady 60–80 BPM resting songs calm transitions while 90–110 BPM movement tracks build bilateral midline coordination across 7 Lands.",
            "3/ Print the free 5 Neural Pathways Field Guide & Sensory Regulation Guide + stream all 19 studio tracks free ($0): soelearn.com/signal",
        ],
        "destination_url": f"{settings.BASE_DOMAIN}/signal?utm_source=x&utm_medium=organic_thread&utm_campaign=seriphia_signal&utm_content=neuro_parenting",
    },
]


class XAdsAndPulseLauncher:
    """MCLS Extension: X Ads API v2 Paused-First Builder + AT Protocol Cross-Poster."""

    def __init__(self, dry_run: bool = True):
        self.dry_run = dry_run
        self.api_base = "https://ads-api.x.com/12"

    def prepare_x_campaign_launch(
        self,
        campaign_name: str = "SOE_X_Seriphia_Signal_US",
        daily_budget_cents: int = 1000,
        thread_ids: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        selected_ids = thread_ids or [t["id"] for t in X_PULSE_RECEIPT_THREADS]
        creatives = [t for t in X_PULSE_RECEIPT_THREADS if t["id"] in selected_ids]

        return {
            "channel": "X_COM_ADS",
            "account_id": settings.X_ADS_ACCOUNT_ID,
            "campaign_spec": {
                "name": campaign_name,
                "funding_instrument_id": "configured_at_runtime",
                "daily_budget_amount_local_micro": int(daily_budget_cents) * 10000,
                "entity_status": "PAUSED",
                "objective": "WEBSITE_CONVERSIONS",
                "target_cpa_dollars": 2.25,
            },
            "line_items": [
                {
                    "name": "X_LineItem_Neuro_Homeschool_Sovereign_Parents",
                    "entity_status": "PAUSED",
                    "targeting": {
                        "locations": ["US", "CA", "GB", "AU"],
                        "keywords": [
                            "screen free kids",
                            "phonics homeschool",
                            "neurodivergent parenting",
                            "montessori toddler",
                            "science of reading",
                        ],
                    },
                }
            ],
            "promoted_threads": creatives,
        }

    def build_atproto_signal_post(self, thread_id: str = "x_thread_neuro_parenting") -> Dict[str, Any]:
        thread = next((t for t in X_PULSE_RECEIPT_THREADS if t["id"] == thread_id), X_PULSE_RECEIPT_THREADS[0])
        text = f"{thread['hook']}\n\n{thread['posts'][1]}\n\n{thread['destination_url']}"
        return {
            "protocol": "AT_PROTOCOL",
            "lexicon": "app.bsky.feed.post",
            "handle": settings.ATPROTO_HANDLE or "seriphia.thesoundofessentials.com",
            "record": {
                "$type": "app.bsky.feed.post",
                "text": text[:300],
                "langs": ["en-US"],
            },
            "destination_url": thread["destination_url"],
        }

    def dispatch_campaign(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "SIMULATED_SUCCESS" if self.dry_run else "STAGED_PAUSED_READY",
            "mode": "SANDBOX_DRY_RUN" if self.dry_run else "X_ADS_V2_PAUSED",
            "threads_staged": len(payload.get("promoted_threads", [])),
            "campaign_name": payload.get("campaign_spec", {}).get("name"),
        }
