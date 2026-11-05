import os
import re
import uuid
from typing import List, Optional, Dict, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
from soe_mcls.config import settings
from soe_mcls.canon import PRODUCT_LADDER, CULTURAL_DELTAS, PRODUCTION_CAMPAIGNS
from soe_mcls.meta_launcher import MetaCampaignLauncher
from soe_mcls.pinterest_launcher import PinterestCampaignLauncher, PINTEREST_BOARDS, PINTEREST_PINS
from soe_mcls.funnel_engine import FunnelCheckoutService
from soe_mcls.capi_brevo_sync import TelemetrySyncEngine
from soe_mcls.rhythm_guardian import RhythmGuardianOptimizer

try:
    from soe_haystack import get_haystack_engine
    haystack_engine = get_haystack_engine()
except Exception as e:
    print(f"Warning: could not load soe_haystack: {e}")
    haystack_engine = None

app = FastAPI(title="SOE Market Campaign Launch System (SOE-MCLS)", version="1.0.0")

# Enable CORS for Vite frontend (localhost:5173 and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def update_env_meta_credentials(token: str, ad_account_id: str, pixel_id: str = "", page_id: str = ""):
    """Safely updates or persists Meta credentials in .env file."""
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    if not os.path.exists(env_path):
        return
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            content = f.read()

        clean_acct = re.sub(r"[^0-9]", "", ad_account_id or "")
        formatted_acct = f"act_{clean_acct}" if clean_acct else ""

        replacements = {
            "META_ACCESS_TOKEN": token,
            "META_AD_ACCOUNT_ID": formatted_acct,
            "META_PIXEL_ID": pixel_id or "",
            "META_PAGE_ID": page_id or "",
        }
        for k, v in replacements.items():
            pattern = rf"^{k}=.*$"
            if re.search(pattern, content, flags=re.MULTILINE):
                content = re.sub(pattern, f"{k}={v}", content, flags=re.MULTILINE)
            else:
                content += f"\n{k}={v}"

        with open(env_path, "w", encoding="utf-8") as f:
            f.write(content)
    except Exception as e:
        print(f"Warning: could not update .env: {e}")

# Runtime Credential Stores
RUNTIME_META_CONFIG = {
    "access_token": settings.META_ACCESS_TOKEN if settings.META_ACCESS_TOKEN != "mock_meta_token" else "",
    "ad_account_id": settings.META_AD_ACCOUNT_ID if settings.META_AD_ACCOUNT_ID != "act_000000000" else "",
    "page_id": settings.META_PAGE_ID if settings.META_PAGE_ID != "000000000000" else "",
    "pixel_id": settings.META_PIXEL_ID if settings.META_PIXEL_ID != "000000000000" else "",
}

RUNTIME_PINTEREST_CONFIG = {
    "access_token": settings.PINTEREST_ACCESS_TOKEN if settings.PINTEREST_ACCESS_TOKEN != "mock_pinterest_token" else "",
    "ad_account_id": settings.PINTEREST_AD_ACCOUNT_ID if settings.PINTEREST_AD_ACCOUNT_ID != "000000000000" else "",
    "tag_id": settings.PINTEREST_TAG_ID if settings.PINTEREST_TAG_ID != "000000000000" else "",
}

launcher = MetaCampaignLauncher(dry_run=True)
pinterest_launcher = PinterestCampaignLauncher(dry_run=True)
funnel_service = FunnelCheckoutService(mock_mode=True)
sync_engine = TelemetrySyncEngine()
guardian = RhythmGuardianOptimizer()

class MetaCredentialsInput(BaseModel):
    access_token: str = Field(..., description="Meta System User or User Access Token")
    ad_account_id: Optional[str] = Field("", description="Meta Ad Account ID (e.g. act_123456789)")
    page_id: Optional[str] = Field("", description="Facebook Page ID")
    pixel_id: Optional[str] = Field("", description="Meta Pixel / Dataset ID")

class CampaignLaunchRequest(BaseModel):
    campaign_key: str
    delta_key: str
    daily_budget_cents: int = 5000
    buyer_track: str = "D2C"
    language: str = "en"
    archetype_ids: List[str] = ["ARC-01", "ARC-02", "ARC-03"]
    engine_type: str = "ENGINE_A_VALUE_GATE"

class ListenCaptureRequest(BaseModel):
    email: str
    first_name: str
    delta: str = "SCREEN_VS_SENSORY"
    buyer_track: str = "D2C"
    include_starter_pack_bump: bool = False
    child_age_bracket: Optional[str] = None
    phone: Optional[str] = None
    first_touch_ad_id: Optional[str] = None
    fbc: Optional[str] = None
    fbp: Optional[str] = None

class UpsellChargeRequest(BaseModel):
    customer_id: str
    payment_method_id: str
    sku_key: str

class PinterestLaunchRequest(BaseModel):
    campaign_name: str = "Screen-Free Early Literacy"
    daily_budget_cents: int = 1500
    target_pin_ids: List[str] = ["pin_01_apps", "pin_04_coloring"]
    custom_keywords: Optional[List[str]] = None

class PinterestCredentialsInput(BaseModel):
    access_token: str
    ad_account_id: Optional[str] = ""
    tag_id: Optional[str] = ""

class HaystackQueryRequest(BaseModel):
    query: str

class HaystackEmailTriageRequest(BaseModel):
    email_body: str

@app.get("/api/v1/canon")
def get_canon_state():
    return {
        "deltas": CULTURAL_DELTAS,
        "campaigns": PRODUCTION_CAMPAIGNS,
        "product_ladder": PRODUCT_LADDER,
    }

@app.get("/api/v1/meta/status")
def get_meta_status():
    """Returns current Meta connection mode, credential status, and masked token."""
    token = RUNTIME_META_CONFIG.get("access_token", "")
    acct_id = RUNTIME_META_CONFIG.get("ad_account_id", "")
    is_live_configured = bool(token and acct_id and "mock" not in token.lower())
    
    clean_acct = re.sub(r"[^0-9]", "", acct_id) if acct_id else ""
    return {
        "mode": "LIVE_CONNECTED" if is_live_configured else "SANDBOX_DRY_RUN",
        "is_configured": is_live_configured,
        "ad_account_id": f"act_{clean_acct}" if clean_acct else "Not Connected (Sandbox Default)",
        "page_id": RUNTIME_META_CONFIG.get("page_id") or "Not Configured",
        "pixel_id": RUNTIME_META_CONFIG.get("pixel_id") or "Not Configured",
        "token_preview": f"{token[:8]}...{token[-4:]}" if len(token) > 16 else ("Configured (Mock)" if token else "None"),
        "graph_api_version": "v21.0",
        "notice": "All dispatches are staged safely in Sandbox Simulation mode until real Meta credentials are provided."
    }

@app.post("/api/v1/meta/verify")
async def verify_and_save_meta_credentials(creds: MetaCredentialsInput):
    """
    Validates Meta credentials against Meta Graph API v21.0.
    1. Validates access token against /me.
    2. Auto-discovers or validates Ad Account (never queries empty act_).
    3. Auto-discovers or validates Facebook Page ID.
    4. Persists credentials if live connection succeeds.
    """
    token = (creds.access_token or "").strip()
    raw_acct = (creds.ad_account_id or "").strip()
    clean_acct_digits = re.sub(r"[^0-9]", "", raw_acct)
    page_id = (creds.page_id or "").strip()
    clean_page = re.sub(r"[^0-9]", "", page_id)
    pixel_id = (creds.pixel_id or "").strip()
    clean_pixel = re.sub(r"[^0-9]", "", pixel_id)

    # 1. Mock token / Sandbox mode check
    if not token or "mock" in token.lower() or len(token) < 20:
        launcher.dry_run = True
        RUNTIME_META_CONFIG["access_token"] = token
        RUNTIME_META_CONFIG["ad_account_id"] = clean_acct_digits
        RUNTIME_META_CONFIG["page_id"] = clean_page
        RUNTIME_META_CONFIG["pixel_id"] = clean_pixel
        return {
            "verified": False,
            "mode": "SANDBOX_DRY_RUN",
            "message": "Saved in Sandbox Simulation Mode. All launches will simulate real Meta Graph API calls without real ad spend."
        }

    async with httpx.AsyncClient(timeout=10.0) as client:
        # 2. Check token identity against /me
        try:
            me_resp = await client.get(
                "https://graph.facebook.com/v21.0/me",
                params={"fields": "id,name", "access_token": token}
            )
            me_data = me_resp.json()
        except Exception as exc:
            return {
                "verified": False,
                "mode": "NETWORK_ERROR",
                "error": f"Failed to connect to Meta Graph API: {str(exc)}"
            }

        if me_resp.status_code != 200 or "error" in me_data:
            err_msg = me_data.get("error", {}).get("message", "Meta Graph API rejected access token.")
            return {
                "verified": False,
                "mode": "AUTH_FAILED",
                "error": f"Invalid System User Access Token: {err_msg}"
            }

        token_user_name = me_data.get("name", "System User")
        token_user_id = me_data.get("id")

        # 3. Handle Ad Account Validation or Auto-discovery
        selected_account = None
        available_accounts = []

        if clean_acct_digits:
            # User provided a numeric Ad Account ID
            formatted_acct = f"act_{clean_acct_digits}"
            acct_resp = await client.get(
                f"https://graph.facebook.com/v21.0/{formatted_acct}",
                params={
                    "fields": "name,account_status,currency,amount_spent,business_name",
                    "access_token": token,
                }
            )
            acct_data = acct_resp.json()
            if acct_resp.status_code == 200 and "id" in acct_data:
                selected_account = acct_data
            else:
                raw_err = acct_data.get("error", {}).get("message", "Ad Account could not be loaded.")
                if "does not exist, cannot be loaded due to missing permissions" in raw_err:
                    err_msg = (
                        f"Ad Account '{formatted_acct}' was not found or lacks permissions for System User '{token_user_name}'. "
                        f"In Meta Business Settings > System Users > '{token_user_name}', click 'Assign Assets' and add this Ad Account with 'Manage campaigns' permission."
                    )
                else:
                    err_msg = f"Meta Graph API error for {formatted_acct}: {raw_err}"
                
                return {
                    "verified": False,
                    "mode": "PERMISSION_MISSING",
                    "error": err_msg,
                    "token_owner": token_user_name,
                    "raw_meta_response": acct_data,
                }
        else:
            # Ad Account ID was not provided -> Try auto-discovery via /me/adaccounts
            ad_resp = await client.get(
                "https://graph.facebook.com/v21.0/me/adaccounts",
                params={
                    "fields": "id,name,account_id,account_status,currency,amount_spent,business_name",
                    "access_token": token,
                }
            )
            if ad_resp.status_code == 200:
                available_accounts = ad_resp.json().get("data", [])
                if available_accounts:
                    selected_account = available_accounts[0]
                    clean_acct_digits = selected_account.get("account_id") or selected_account.get("id", "").replace("act_", "")

        # If still no account found, explain clearly without any cryptic GraphMethodException
        if not selected_account:
            return {
                "verified": False,
                "mode": "AD_ACCOUNT_REQUIRED",
                "error": (
                    f"Token verified for System User '{token_user_name}', but no Meta Ad Account ID was provided and none are currently assigned to this user. "
                    f"Please enter your Meta Ad Account ID above (e.g. act_123456789012345), and ensure the Ad Account is assigned to '{token_user_name}' under Meta Business Settings > System Users > Assign Assets."
                ),
                "token_owner": token_user_name,
            }

        # 4. Optional Page validation / auto-discovery
        page_name = None
        if clean_page:
            p_resp = await client.get(
                f"https://graph.facebook.com/v21.0/{clean_page}",
                params={"fields": "id,name", "access_token": token}
            )
            if p_resp.status_code == 200:
                page_name = p_resp.json().get("name")
        else:
            # Try auto-discovering pages via /me/accounts
            p_resp = await client.get(
                "https://graph.facebook.com/v21.0/me/accounts",
                params={"fields": "id,name", "access_token": token}
            )
            if p_resp.status_code == 200:
                pages = p_resp.json().get("data", [])
                if pages:
                    clean_page = pages[0].get("id")
                    page_name = pages[0].get("name")

        # 5. Success! Save to runtime config and .env
        RUNTIME_META_CONFIG["access_token"] = token
        RUNTIME_META_CONFIG["ad_account_id"] = clean_acct_digits
        RUNTIME_META_CONFIG["page_id"] = clean_page
        RUNTIME_META_CONFIG["pixel_id"] = clean_pixel
        launcher.dry_run = False

        update_env_meta_credentials(token, clean_acct_digits, clean_pixel, clean_page)

        return {
            "verified": True,
            "mode": "LIVE_CONNECTED",
            "ad_account_id": f"act_{clean_acct_digits}",
            "page_id": clean_page,
            "pixel_id": clean_pixel,
            "account_details": {
                "id": selected_account.get("id"),
                "name": selected_account.get("name", "Verified Meta Ad Account"),
                "currency": selected_account.get("currency", "USD"),
                "account_status": selected_account.get("account_status"),
                "business_name": selected_account.get("business_name", "N/A"),
            },
            "page_name": page_name,
            "message": f"Successfully connected to Meta Ad Account: {selected_account.get('name')} ({selected_account.get('id')}) via System User '{token_user_name}'.",
            "available_accounts": available_accounts,
        }

@app.post("/api/v1/campaigns/launch")
def launch_meta_campaign(req: CampaignLaunchRequest):
    bundle = launcher.prepare_full_campaign_launch(
        campaign_key=req.campaign_key,
        delta_key=req.delta_key,
        daily_budget_cents=req.daily_budget_cents,
        buyer_track=req.buyer_track,
        language=req.language,
        archetype_ids=req.archetype_ids,
        engine_type=req.engine_type,
    )
    
    is_live = not launcher.dry_run and bool(RUNTIME_META_CONFIG["access_token"])
    return {
        "status": "DISPATCHED_LIVE" if is_live else "STAGED_SANDBOX",
        "mode": "LIVE_CONNECTED" if is_live else "SANDBOX_SIMULATION",
        "ad_account_id": RUNTIME_META_CONFIG.get("ad_account_id") or "act_sandbox_soe",
        "bundle": bundle,
        "message": (
            f"Campaign successfully created in Meta Ads Manager ({RUNTIME_META_CONFIG.get('ad_account_id')}) in PAUSED review state."
            if is_live else
            "Real Meta Graph API v21.0 payload constructed and validated. Running in Sandbox Simulation mode (no real ad spend occurred)."
        )
    }

# --- PINTEREST API v5 ENDPOINTS ---

@app.get("/api/v1/pinterest/status")
def get_pinterest_status():
    token = RUNTIME_PINTEREST_CONFIG.get("access_token")
    ad_acct = RUNTIME_PINTEREST_CONFIG.get("ad_account_id")
    is_live = bool(token and token != "mock_pinterest_token")
    return {
        "status": "LIVE_CONNECTED" if is_live else "SANDBOX_SIMULATION",
        "is_configured": is_live,
        "ad_account_id": ad_acct or "Not Connected (Sandbox Default)",
        "tag_id": RUNTIME_PINTEREST_CONFIG.get("tag_id") or "Not Configured",
        "boards_count": len(PINTEREST_BOARDS),
        "pins_count": len(PINTEREST_PINS),
    }

@app.get("/api/v1/pinterest/catalog")
def get_pinterest_catalog():
    return {
        "boards": PINTEREST_BOARDS,
        "pins": PINTEREST_PINS,
    }

@app.post("/api/v1/pinterest/launch")
async def launch_pinterest_campaign(req: PinterestLaunchRequest):
    bundle = pinterest_launcher.prepare_pinterest_campaign_launch(
        campaign_name=req.campaign_name,
        daily_budget_cents=req.daily_budget_cents,
        target_pin_ids=req.target_pin_ids,
        custom_keywords=req.custom_keywords,
    )
    result = await pinterest_launcher.dispatch_campaign(
        access_token=RUNTIME_PINTEREST_CONFIG.get("access_token"),
        ad_account_id=RUNTIME_PINTEREST_CONFIG.get("ad_account_id"),
        payload=bundle,
    )
    return {
        "status": result.get("status", "STAGED_SANDBOX"),
        "mode": result.get("mode", "SANDBOX_DRY_RUN"),
        "bundle": bundle,
        "dispatch_details": result,
    }

# --- HAYSTACK ENTERPRISE RAG ENDPOINTS ---

@app.post("/api/v1/haystack/ask-seriphia")
def ask_seriphia_endpoint(req: HaystackQueryRequest):
    if not haystack_engine:
        return {"status": "ERROR", "message": "Haystack engine not initialized"}
    return haystack_engine.ask_seriphia(req.query)

@app.post("/api/v1/haystack/dictionary-search")
def dictionary_search_endpoint(req: HaystackQueryRequest):
    if not haystack_engine:
        return {"status": "ERROR", "message": "Haystack engine not initialized"}
    return haystack_engine.search_dictionary(req.query)

@app.post("/api/v1/haystack/standards-crosswalk")
def standards_crosswalk_endpoint(req: HaystackQueryRequest):
    if not haystack_engine:
        return {"status": "ERROR", "message": "Haystack engine not initialized"}
    return haystack_engine.crosswalk_standards(req.query)

@app.post("/api/v1/haystack/support-triage")
def support_triage_endpoint(req: HaystackEmailTriageRequest):
    if not haystack_engine:
        return {"status": "ERROR", "message": "Haystack engine not initialized"}
    return haystack_engine.triage_support_email(req.email_body)

@app.post("/api/v1/funnel/listen-capture")
def capture_listen_lead(req: ListenCaptureRequest):
    event_id = f"evt_{uuid.uuid4().hex[:12]}"
    event_name = "InitiateCheckout" if req.include_starter_pack_bump else "Lead"
    val_cents = 700 if req.include_starter_pack_bump else 0

    capi_payload = sync_engine.build_meta_capi_payload(
        event_name=event_name,
        email=req.email,
        event_id=event_id,
        source_url="https://soelearn.com/listen",
        value_cents=val_cents,
        phone=req.phone,
        fbc=req.fbc,
        fbp=req.fbp,
    )

    brevo_payload = sync_engine.build_brevo_contact_payload(
        email=req.email,
        first_name=req.first_name,
        buyer_track=req.buyer_track,
        delta=req.delta,
        purchased_skus=["soe_free_19_album"],
        child_age_bracket=req.child_age_bracket,
        phone=req.phone,
        first_touch_ad_id=req.first_touch_ad_id,
    )

    stripe_intent = None
    if req.include_starter_pack_bump:
        stripe_intent = funnel_service.create_vaulted_checkout_intent(
            email=req.email,
            sku_key="STARTER_PACK",
            delta=req.delta,
            first_touch_ad_id=req.first_touch_ad_id,
        )

    return {
        "status": "CAPTURED",
        "album_stream_unlocked": True,
        "capi_event": capi_payload,
        "brevo_sync": brevo_payload,
        "stripe_intent": stripe_intent,
    }

@app.post("/api/v1/funnel/charge-upsell")
def charge_vaulted_upsell(req: UpsellChargeRequest):
    charge = funnel_service.charge_vaulted_upsell(
        customer_id=req.customer_id,
        payment_method_id=req.payment_method_id,
        sku_key=req.sku_key,
    )
    return {"status": "CHARGED", "charge": charge}
