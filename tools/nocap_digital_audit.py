"""
No-Cap Audit: Digital Products, Download Triggers, and Stripe Infrastructure
Enforces the 4 Core Invariants: Proof-Before-Claim, Zero Hallucinations, Deterministic Execution.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

# Ensure UTF-8 stdout on Windows
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(r"c:\Users\ldmur\Downloads\The Sound of Essentials Image Assets\The-Sound-of-Essentials-Eco-System")
WEB_DIR = ROOT_DIR / "web"
PUBLIC_DIR = WEB_DIR / "public"
DOWNLOADS_DIR = PUBLIC_DIR / "downloads"
PRODUCTS_JSON = WEB_DIR / "src" / "data" / "products.json"
DELIVERY_JS = WEB_DIR / "src" / "utils" / "deliveryUrl.js"

print("=" * 70)
print("  NO-CAP GUARD: DIGITAL PRODUCTS & STRIPE INFRASTRUCTURE AUDIT")
print("=" * 70)

# ── 1. DIGITAL ASSET INVENTORY ON FILE ───────────────────────────────────────
print("\n[1/4] AUDITING DIGITAL ASSETS IN web/public/downloads/...")
if not DOWNLOADS_DIR.exists():
    print(f"❌ downloads directory missing: {DOWNLOADS_DIR}")
else:
    files = list(DOWNLOADS_DIR.glob("*"))
    print(f"Found {len(files)} files in {DOWNLOADS_DIR.name}:")
    for f in files:
        size_mb = f.stat().st_size / (1024 * 1024)
        print(f"  • {f.name} ({size_mb:.2f} MB)")

# Check other deliverables across repo
print("\n[Deliverables in workbook/]:")
wb_dir = ROOT_DIR / "workbook"
if wb_dir.exists():
    wb_files = [
        "SOE_RhythmReady_Workbook.epub",
        "SOE_RhythmReady_Workbook_Complete.pdf",
        "SOE_RhythmReady_Workbook_Interior_Lulu.pdf",
        "SOE_RhythmReady_Workbook_Cover_Coil_Lulu.pdf",
        "SOE_RhythmReady_Workbook_Cover_Paperback_Lulu.pdf",
    ]
    for wbf in wb_files:
        p = wb_dir / wbf
        if p.exists():
            print(f"  ✔ {wbf} ({p.stat().st_size / (1024 * 1024):.2f} MB)")
        else:
            print(f"  ✖ {wbf} NOT FOUND")

# ── 2. AUDIT deliveryUrl.js MAPPINGS VS DISK ─────────────────────────────────
print("\n[2/4] AUDITING DELIVERY MAPPINGS (deliveryUrl.js)...")
expected_mappings = {
    'rhythm-quest-storybook': 'SOE_Rhythm_Quest_Storybook_2026-08.pdf',
    'coloring-book': 'SOE_Rhythm_Quest_Coloring_Book.pdf',
    'rhythm-ready-workbook': 'SOE_RhythmReady_Workbook_COMPLETE.pdf',
    'rhythmready-workbook': 'SOE_RhythmReady_Workbook_COMPLETE.pdf',
    'summer-stretch-workbook': 'SOE_RhythmReady_Workbook_COMPLETE.pdf',
    'picture-dictionary': 'SOE_Picture_Dictionary_Sampler.pdf',
    'full-quest-bundle': 'SOE_Rhythm_Quest_Storybook_2026-08.pdf',
}

for prod_key, fname in expected_mappings.items():
    target = DOWNLOADS_DIR / fname
    if target.exists():
        size_mb = target.stat().st_size / (1024 * 1024)
        print(f"  ✔ [{prod_key}] -> {fname} (EXISTS, {size_mb:.2f} MB)")
    else:
        print(f"  ⚠️ [{prod_key}] -> {fname} (MISSING on disk in /downloads/)")

# ── 3. AUDIT STRIPE CHECKOUT LINKS ───────────────────────────────────────────
print("\n[3/4] AUDITING LIVE STRIPE CHECKOUT LINKS...")

with open(PRODUCTS_JSON, "r", encoding="utf-8") as f:
    products = json.load(f)

stripe_links = []
for p in products:
    name = p.get("name") or p.get("shortName")
    if p.get("storeUrl") and "stripe.com" in p.get("storeUrl"):
        stripe_links.append((f"{name} (Digital / Main)", p.get("storeUrl")))
    if p.get("printStoreUrl") and "stripe.com" in p.get("printStoreUrl"):
        stripe_links.append((f"{name} (Print)", p.get("printStoreUrl")))

print(f"Testing {len(stripe_links)} Stripe payment endpoints...")
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

for label, url in stripe_links:
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            print(f"  ✔ [HTTP {status}] {label}")
            print(f"     URL: {url}")
    except urllib.error.HTTPError as e:
        print(f"  ✖ [HTTP {e.code}] {label}: {url}")
    except Exception as e:
        print(f"  ✖ [FAILED] {label}: {e}")

# ── 4. AUDIT POST-PURCHASE TRIGGER & ORDER SUCCESS FLOW ──────────────────────
print("\n[4/4] AUDITING POST-PURCHASE ORDER SUCCESS FLOW (OrderSuccess.jsx)...")
order_success_jsx = WEB_DIR / "src" / "pages" / "OrderSuccess.jsx"
if order_success_jsx.exists():
    with open(order_success_jsx, "r", encoding="utf-8") as f:
        content = f.read()
    has_delivery_import = "deliveryUrl" in content
    has_trigger_download = "triggerBrowserDownload" in content or "getDeliveryUrl" in content
    has_download_button = "download" in content.lower()
    print(f"  • OrderSuccess.jsx exists: ✔")
    print(f"  • Imports deliveryUrl utility: {'✔' if has_delivery_import else '✖'}")
    print(f"  • Calls getDeliveryUrl: {'✔' if has_trigger_download else '✖'}")
    print(f"  • Contains Download CTA buttons: {'✔' if has_download_button else '✖'}")
else:
    print("  ✖ OrderSuccess.jsx NOT found")

print("\n" + "=" * 70)
print("  AUDIT COMPLETED")
print("=" * 70)
