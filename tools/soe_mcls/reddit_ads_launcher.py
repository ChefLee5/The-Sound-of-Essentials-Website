"""
SOE-MCLS Reddit Ads API v3 Builder & MyClaw-Style Subreddit Signal Crawler.
Targets r/ScienceBasedParenting, r/Preschoolers, r/homeschool, r/slp,
r/Autism_Parenting, and r/multilingualparenting with zero-fluff, citation-backed value.
"""

from typing import Any, Dict, List, Optional
from soe_mcls.config import settings
from soe_mcls.ops_harness import compute_content_hash

TARGET_SUBREDDITS: List[Dict[str, Any]] = [
    {
        "subreddit": "ScienceBasedParenting",
        "niche_bend": "Neuro-Parenting (#1)",
        "primary_asset": "/downloads/SOE_5_Neural_Pathways_Guide.html",
        "keywords": ["phonics", "screen time", "reading app", "speech delay", "auditory"],
    },
    {
        "subreddit": "Preschoolers",
        "niche_bend": "Sensory & Transitions (#4)",
        "primary_asset": "/signal",
        "keywords": ["meltdown", "tablet", "screen free", "quiet time", "circle time"],
    },
    {
        "subreddit": "homeschool",
        "niche_bend": "Micro-School Pods & Workbooks (#2 / #5)",
        "primary_asset": "/rhythm-ready",
        "keywords": ["kindergarten", "pre-k", "co-op", "phonics", "morning basket"],
    },
    {
        "subreddit": "slp",
        "niche_bend": "OT/SLP Acoustic Pacing (#4)",
        "primary_asset": "/downloads/SOE_Sensory_Regulation_Guide.html",
        "keywords": ["phonemic", "rhythm", "pacing", "aac", "preschool", "sensory"],
    },
    {
        "subreddit": "Autism_Parenting",
        "niche_bend": "Sensory Regulation (#4)",
        "primary_asset": "/downloads/SOE_Sensory_Regulation_Guide.html",
        "keywords": ["regulation", "transition", "screen", "music", "calm"],
    },
    {
        "subreddit": "multilingualparenting",
        "niche_bend": "Heritage Language (#3)",
        "primary_asset": "/global-learn-english",
        "keywords": ["bilingual", "spanish", "french", "heritage", "toddler"],
    },
]


class RedditAdsAndCrawlerLauncher:
    """MCLS Extension: Reddit Ads API v3 Launcher + Deduplicated Subreddit Signal Scorer."""

    def __init__(self, dry_run: bool = True):
        self.dry_run = dry_run
        self.api_base = "https://ads-api.reddit.com/api/v3"

    def prepare_reddit_campaign_launch(
        self,
        campaign_name: str = "SOE_Reddit_Seriphia_Signal_US",
        daily_budget_cents: int = 1000,
        subreddits: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        chosen_subs = subreddits or [s["subreddit"] for s in TARGET_SUBREDDITS]
        return {
            "channel": "REDDIT_ADS_V3",
            "ad_account_id": settings.REDDIT_AD_ACCOUNT_ID,
            "campaign_spec": {
                "name": campaign_name,
                "objective": "CONVERSIONS",
                "configured_status": "PAUSED",
                "daily_budget_micros": int(daily_budget_cents) * 10000,
                "target_cpa_dollars": 2.25,
            },
            "ad_group_spec": {
                "name": "ADGROUP | Ages 2-7 Screen-Free Phonics & Sensory",
                "configured_status": "PAUSED",
                "targeting": {
                    "subreddits": chosen_subs,
                    "locations": ["US", "CA", "GB", "AU"],
                },
            },
            "promoted_posts": [
                {
                    "headline": "Why Sound Must Come Before Print Symbols for Ages 2–7 (Free 19-Track Acoustic Signal + 5 Neural Pathways Guide)",
                    "body": (
                        "Built on Dalcroze, Orff, and Kodály foundations for ages 2–7 (Pre-K to Grade 2). "
                        "No apps, no glowing screen flicker—just 19 master studio recordings (60–110 BPM) "
                        "and three printable field guides free ($0) for parents, OTs, SLPs, and co-ops."
                    ),
                    "destination_url": f"{settings.BASE_DOMAIN}/signal?utm_source=reddit&utm_medium=paid_social&utm_campaign=seriphia_signal&utm_content=neural_pathways",
                },
                {
                    "headline": "Free OT/Parent Reference: 60–80 BPM Sensory & Transition Reset Guide (Ages 2–7)",
                    "body": (
                        "Looking for a predictable, screen-free transition ritual without cartoon overstimulation? "
                        "Grab our printable Sensory & Acoustic Regulation Guide plus free streaming for all 19 studio tracks."
                    ),
                    "destination_url": f"{settings.BASE_DOMAIN}/downloads/SOE_Sensory_Regulation_Guide.html?utm_source=reddit&utm_medium=paid_social&utm_campaign=seriphia_signal&utm_content=sensory_guide",
                },
            ],
        }

    def score_and_filter_threads(
        self,
        threads: List[Dict[str, str]],
        seen_hashes: Optional[set] = None,
    ) -> List[Dict[str, Any]]:
        """
        MyClaw-style subreddit crawler filter: deduplicates via ops_harness SHA-256 hashes,
        matches subreddit keyword signals, and drafts non-spammy value replies for mcls_approvals.
        """
        seen = seen_hashes if seen_hashes is not None else set()
        sub_map = {s["subreddit"].lower(): s for s in TARGET_SUBREDDITS}
        staged: List[Dict[str, Any]] = []

        for item in threads:
            sub = str(item.get("subreddit", "")).strip()
            title = str(item.get("title", "")).strip()
            body = str(item.get("body", "")).strip()
            url = str(item.get("url", "")).strip()
            if not title:
                continue

            content_hash = compute_content_hash(f"{sub}:{title}:{body}")
            if content_hash in seen:
                continue
            seen.add(content_hash)

            spec = sub_map.get(sub.lower())
            text_low = f"{title} {body}".lower()
            matched_kw = [
                kw for kw in (spec["keywords"] if spec else ["phonics", "screen free", "toddler"])
                if kw in text_low
            ]
            if not matched_kw:
                continue

            asset_path = spec["primary_asset"] if spec else "/signal"
            staged.append({
                "subreddit": sub or "Parenting",
                "title": title,
                "url": url,
                "content_hash": content_hash,
                "matched_keywords": matched_kw,
                "score": min(100, 50 + len(matched_kw) * 15),
                "draft_reply": (
                    "For ages 2–7, pairing steady 60–80 BPM studio music with a simple 10-minute tactile movement "
                    "or syllable-clapping ritual settles transitions faster than screen apps. We also made all 19 studio "
                    f"tracks and printable field guides free ($0) at https://soelearn.com{asset_path} if helpful."
                ),
            })

        return sorted(staged, key=lambda r: r["score"], reverse=True)

    def dispatch_campaign(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "SIMULATED_SUCCESS" if self.dry_run else "STAGED_PAUSED_READY",
            "mode": "SANDBOX_DRY_RUN" if self.dry_run else "REDDIT_ADS_V3_PAUSED",
            "posts_staged": len(payload.get("promoted_posts", [])),
            "campaign_name": payload.get("campaign_spec", {}).get("name"),
        }
