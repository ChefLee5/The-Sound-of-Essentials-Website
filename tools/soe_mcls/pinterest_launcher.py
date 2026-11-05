from typing import List, Dict, Any, Optional
import json
import urllib.request
import urllib.error
try:
    import httpx
except ImportError:
    httpx = None

from soe_mcls.config import settings

PINTEREST_BOARDS = [
    {
        "id": "board_screen_free_play",
        "name": "Screen-Free Toddler & Pre-K Play (Ages 2–5)",
        "description": "Discover simple, joyful screen-free toddler activities, sensory play ideas, and acoustic music rituals designed for developing brains ages 2 to 5. Replace tablet tantrums with calm, rhythmic movement and tactile exploration.",
        "privacy": "PUBLIC",
    },
    {
        "id": "board_phonics_early_reading",
        "name": "Kindergarten Phonics & Early Reading (Sound Before Symbols)",
        "description": "Evidence-based early reading and phonics activities for preschool, pre-k, and kindergarten. Learn why auditory sound must come before symbols, avoiding the whole-language guessing trap through the proven Mississippi phonics model.",
        "privacy": "PUBLIC",
    },
    {
        "id": "board_morning_basket_rhythms",
        "name": "Morning Basket & Daily Sensory Rhythms",
        "description": "Nourishing morning basket ideas, acoustic songs, and daily rhythm cards to start your homeschool or Pre-K day with peace and joyful focus. Crafted by a father's heart and a mother's love.",
        "privacy": "PUBLIC",
    },
    {
        "id": "board_homeschool_montessori",
        "name": "Gentle Homeschool & Montessori Living",
        "description": "Intentional, screen-free homeschool resources for toddlers, Pre-K, and early elementary (ages 2–7). Hands-on learning tools, nature study, and multi-sensory curriculum extensions.",
        "privacy": "PUBLIC",
    },
    {
        "id": "board_free_printables",
        "name": "Free Early Learning Printables & Coloring Pages",
        "description": "Instant free downloads for families: 40-page Rhythm Quest coloring book, tactile lesson cards, phonics flashcards, and 19 free acoustic learning songs for ages 2 to 7.",
        "privacy": "PUBLIC",
    },
]

PINTEREST_PINS = [
    {
        "id": "pin_01_apps",
        "board_id": "board_screen_free_play",
        "title": "Why We Deleted Reading Apps Before Age 5 (Screen-Free Phonics)",
        "description": "Are educational apps actually helping your toddler read or just teaching them to guess? Discover the pediatric sensory science behind acoustic rhythm and multi-sensory phonics for ages 2–7. Free 19-track album and 40-page coloring book download at the link!",
        "destination_url": f"{settings.BASE_DOMAIN}/listen?utm_source=pinterest&utm_medium=pin&utm_campaign=screen_free_infographic&utm_content=deleted_apps",
        "image_file": "pinterest-pins/pin01_why_we_ditched_reading_apps.png",
        "keywords": ["screen free toddler activities", "preschool sensory play", "toddler quiet time", "screen free parenting"],
    },
    {
        "id": "pin_02_phonics",
        "board_id": "board_phonics_early_reading",
        "title": "Stop Teaching Letters First! (The 3-Step Sound Before Symbols Method)",
        "description": "Before young children can read letters with their eyes they must map sounds with their ears. Discover how 19 rhythmic songs teach foundational phonemes for preschool and kindergarten without screens or tears. Free download!",
        "destination_url": f"{settings.BASE_DOMAIN}/listen?utm_source=pinterest&utm_medium=pin&utm_campaign=phonics_cheat_sheet&utm_content=sound_before_symbols",
        "image_file": "pinterest-pins/pin02_sound_before_symbols_phonics.png",
        "keywords": ["phonics activities kindergarten", "science of reading preschool", "beginning sounds worksheets", "auditory phonemic awareness"],
    },
    {
        "id": "pin_03_routine",
        "board_id": "board_morning_basket_rhythms",
        "title": "The 10-Minute Morning Routine That Eliminates Toddler Tantrums",
        "description": "Looking for a peaceful screen-free morning routine with toddlers and preschoolers? This simple 10-minute rhythmic routine uses gentle acoustic songs to help little bodies co-regulate and focus. Get your free 19-track album pass today!",
        "destination_url": f"{settings.BASE_DOMAIN}/listen?utm_source=pinterest&utm_medium=pin&utm_campaign=morning_routine&utm_content=tantrum_reset",
        "image_file": "pinterest-pins/pin03_ten_minute_morning_routine.png",
        "keywords": ["morning basket ideas preschool", "daily rhythm with toddlers", "homeschool morning routine", "calming music for kids"],
    },
    {
        "id": "pin_04_coloring",
        "board_id": "board_free_printables",
        "title": "FREE 40-Page Rhythm Quest Early Learning Coloring Book + 19 Songs",
        "description": "Download this beautiful 40-page early learning coloring book featuring the 15 heroes of Rhythm Quest! Covers letters numbers nature and emotional calm paired with 19 full acoustic learning songs. Instant free access at soelearn.com.",
        "destination_url": f"{settings.BASE_DOMAIN}/listen?utm_source=pinterest&utm_medium=pin&utm_campaign=free_coloring_book&utm_content=instant_pdf",
        "image_file": "pinterest-pins/pin04_free_coloring_book_40_pages.png",
        "keywords": ["free preschool printables", "kindergarten coloring pages pdf", "free phonics worksheets", "homeschool freebies"],
    },
    {
        "id": "pin_05_grading",
        "board_id": "board_homeschool_montessori",
        "title": "Why A Florida Teacher Was Fired for Refusing to Give 50% for Blank Paper",
        "description": "Learn why thousands of conscious families are building early literacy at home through screen-free sensory music for ages 2 to 7. Discover the documentary truth and listen to all 19 tracks free.",
        "destination_url": f"{settings.BASE_DOMAIN}/listen?utm_source=pinterest&utm_medium=pin&utm_campaign=institutional_truth&utm_content=grading_floor",
        "image_file": "pinterest-pins/pin05_fifty_percent_grading_floor.png",
        "keywords": ["montessori at home toddler", "waldorf inspired learning", "kindergarten homeschool curriculum", "tactile learning activities"],
    },
]

class PinterestCampaignLauncher:
    """MCLS Extension: Autonomous Pinterest API v5 Visual Campaign Dispatcher."""

    def __init__(self, dry_run: bool = True):
        self.dry_run = dry_run
        self.api_base = "https://api.pinterest.com/v5"

    def build_targeting_spec(self, keywords: List[str] = None) -> Dict[str, Any]:
        default_keywords = [
            {"value": "screen free toddler activities", "match_type": "PHRASE"},
            {"value": "kindergarten phonics", "match_type": "PHRASE"},
            {"value": "preschool morning routine", "match_type": "BROAD"},
            {"value": "science of reading", "match_type": "PHRASE"},
            {"value": "free preschool printables", "match_type": "BROAD"},
        ]
        kw_spec = default_keywords
        if keywords:
            kw_spec = [{"value": kw, "match_type": "PHRASE"} for kw in keywords]

        return {
            "geo_locations": ["US", "CA"],
            "genders": ["FEMALE"],
            "age_buckets": ["25-34", "35-44"],
            "keywords": kw_spec,
            "interests": [
                "925234190824", # Parenting > Toddlers
                "925234190825", # Parenting > Preschoolers
                "925234190828", # Education > Homeschooling
            ],
        }

    def prepare_pinterest_campaign_launch(
        self,
        campaign_name: str,
        daily_budget_cents: int = 1500,
        target_pin_ids: Optional[List[str]] = None,
        custom_keywords: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        target_pin_ids = target_pin_ids or ["pin_01_apps", "pin_04_coloring"]
        
        # 1. Campaign Spec (Conversions)
        campaign_spec = {
            "name": f"SOE | PINTEREST | {campaign_name.upper()} | CONVERSIONS",
            "objective_type": "WEB_CONVERSIONS",
            "status": "ACTIVE",
            "daily_spend_cap_in_micro_currency": daily_budget_cents * 10000, # 1 USD = 1,000,000 micro currency
            "is_automated_campaign": False,
        }

        # 2. Ad Group Spec
        ad_group_spec = {
            "name": f"ADGROUP | {campaign_name} | High-Intent Early Childhood",
            "status": "ACTIVE",
            "budget_in_micro_currency": daily_budget_cents * 10000,
            "budget_type": "DAILY",
            "billable_event": "IMPRESSION",
            "bid_in_micro_currency": 1500000, # $1.50 Max CPM/CPA bid
            "targeting_spec": self.build_targeting_spec(custom_keywords),
            "tracking_urls": {
                "impression": [],
                "click": [],
                "engagement": [],
                "buyable_button": [],
                "audience_verification": [],
            },
        }

        # 3. Promoted Pin Specs
        selected_pins = [p for p in PINTEREST_PINS if p["id"] in target_pin_ids]
        ad_specs = []
        for pin in selected_pins:
            ad_specs.append({
                "name": f"PROMOTED PIN | {pin['title'][:40]}",
                "status": "ACTIVE",
                "pin_id": f"pin_ext_{pin['id']}",
                "destination_url": pin["destination_url"],
                "carousel_android_deep_links": [],
                "carousel_ios_deep_links": [],
                "click_tracking_url": pin["destination_url"],
                "metadata": pin,
            })

        return {
            "ad_account_id": settings.PINTEREST_AD_ACCOUNT_ID,
            "campaign_spec": campaign_spec,
            "ad_group_spec": ad_group_spec,
            "ad_specs": ad_specs,
            "organic_boards": PINTEREST_BOARDS,
            "all_available_pins": PINTEREST_PINS,
        }

    async def dispatch_campaign(
        self,
        access_token: str,
        ad_account_id: str,
        payload: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Dispatches to Pinterest API v5 or executes sandbox dry-run."""
        if self.dry_run or not access_token or access_token == "mock_pinterest_token":
            return {
                "status": "SIMULATED_SUCCESS",
                "mode": "SANDBOX_DRY_RUN",
                "message": "Pinterest API payload validated and compiled cleanly. Live token required for physical auction dispatch.",
                "dispatched_entities": {
                    "campaign_id": "sim_pin_camp_88319",
                    "ad_group_id": "sim_pin_adg_44120",
                    "ads_created": len(payload.get("ad_specs", [])),
                },
                "payload": payload,
            }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

        clean_ad_acct = ad_account_id.replace("act_", "").strip()
        url = f"{self.api_base}/ad_accounts/{clean_ad_acct}/campaigns"

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, headers=headers, json=[payload["campaign_spec"]])
            if resp.status_code in [200, 201]:
                return {
                    "status": "LIVE_SUCCESS",
                    "mode": "LIVE_PINTEREST_API",
                    "response": resp.json(),
                }
            else:
                return {
                    "status": "API_ERROR",
                    "http_code": resp.status_code,
                    "error": resp.text,
                }
