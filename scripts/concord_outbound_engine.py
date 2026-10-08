#!/usr/bin/env python3
"""
Concord Outbound Director: B2B Institutional Outreach Engine
The Sound of Essentials: Rhythm Quest (soelearn.com)

Orchestrates 1,208 validated institutional leads across 5 Pillars.
Features:
- Ingests leads into Brevo lists with custom attributes
- Batches leads into 30-lead cohorts sorted by score
- Dispatches Touch 1 templates with Sender ID 2 (info@soelearn.com)
- Maintains strict ledger in leads/concord_outbound_ledger.json
- Supports dry-run and live execution modes
"""

import os
import sys
import json
import time
import argparse
import urllib.request
import urllib.error
from datetime import datetime

# Windows Console UTF-8 compatibility
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Directory Paths
WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LEADS_JSON_PATH = os.path.join(WORKSPACE_ROOT, "leads", "concord_master_leads_1209.json")
LEDGER_PATH = os.path.join(WORKSPACE_ROOT, "leads", "concord_outbound_ledger.json")

# Brevo Configuration
def _load_brevo_key():
    key = os.environ.get("BREVO_API_KEY")
    if key:
        return key
    for p in [os.path.join(WORKSPACE_ROOT, "web", ".env"), os.path.join(WORKSPACE_ROOT, ".env")]:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("BREVO_API_KEY="):
                            return line.strip().split("=", 1)[1].strip("\"'")
            except Exception:
                pass
    return ""

BREVO_API_KEY = _load_brevo_key()
SENDER_EMAIL = "info@soelearn.com"
SENDER_NAME = "The Sound of Essentials"
SENDER_ID = 2

# Mapping of Pillars to Brevo List IDs and Template IDs
PILLAR_CONFIG = {
    "Pillar I: Children's Music & Arts": {
        "list_id": 4,
        "template_id": 7,  # SOE B2B 01: The music curriculum your families will talk about at pickup
        "alt_template_id": 12, # Kindermusik segment
        "name": "Pillar I (Music & Arts)"
    },
    "Pillar III: Child Development": {
        "list_id": 5,
        "template_id": 8,  # SOE B2B 02: Structured, calming intervention tool designed for the developing brain
        "name": "Pillar III (Child Development & Clinics)"
    },
    "Pillar II: Homeschool Families": {
        "list_id": 6,
        "template_id": 13, # SOE B2B 07: Stage-based, sensory-rich, neuro-affirming
        "name": "Pillar II (Homeschool Families)"
    },
    "Pillar IV: Holistic Family Lifestyle": {
        "list_id": 7,
        "template_id": 16, # SOE B2B 10: Bedtime audio sanctuary & grounding
        "name": "Pillar IV (Holistic & Nature)"
    },
    "Pillar V: Multicultural & Bilingual Education": {
        "list_id": 8,
        "template_id": 11, # SOE B2B 05: Spanish/French cultural packages
        "name": "Pillar V (Multicultural & Bilingual)"
    }
}

def load_leads():
    if not os.path.exists(LEADS_JSON_PATH):
        raise FileNotFoundError(f"Leads JSON not found at: {LEADS_JSON_PATH}")
    with open(LEADS_JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_ledger():
    if os.path.exists(LEDGER_PATH):
        try:
            with open(LEDGER_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"dispatched": {}, "history": []}

def save_ledger(ledger):
    os.makedirs(os.path.dirname(LEDGER_PATH), exist_ok=True)
    with open(LEDGER_PATH, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=2, ensure_ascii=False)

def import_contact_to_brevo(lead, list_id):
    """
    Imports or updates a single contact in Brevo using the contacts API.
    """
    url = "https://api.brevo.com/v3/contacts"
    
    # Format attributes safely
    attributes = {
        "ORGANIZATION": lead.get("name", "")[:100],
        "PILLAR": lead.get("pillar", "")[:100],
        "CONCORD_TIER": lead.get("tier", "")[:50],
        "FRAMEWORK": lead.get("framework", "")[:100],
        "BIO_HOOK": (lead.get("hook") or lead.get("narrative") or "")[:200]
    }
    
    contact_name = lead.get("contact_name")
    if contact_name and contact_name.lower() != "director" and contact_name.lower() != "clinical director":
        parts = contact_name.split()
        if len(parts) >= 2:
            attributes["FIRSTNAME"] = parts[0]
            attributes["LASTNAME"] = " ".join(parts[1:])
        elif len(parts) == 1:
            attributes["FIRSTNAME"] = parts[0]

    payload = {
        "email": lead.get("email").strip().lower(),
        "attributes": attributes,
        "listIds": [list_id],
        "updateEnabled": True
    }

    headers = {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return {"status": response.status, "data": res_body}
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        return {"status": e.code, "error": True, "details": err_msg}
    except Exception as e:
        return {"status": 500, "error": True, "details": str(e)}

def send_transactional_template(lead, template_id):
    """
    Dispatches a transactional email template via Brevo SMTP API using Sender ID 2.
    """
    url = "https://api.brevo.com/v3/smtp/email"
    
    contact_name = lead.get("contact_name") or "Director"
    if contact_name in ["Director", "Clinical Director", "Executive Director"]:
        salutation = f"to the {contact_name} at {lead.get('name')}"
        first_name = "Director"
    else:
        salutation = f"to {contact_name}"
        first_name = contact_name.split()[0] if contact_name else "Director"

    payload = {
        "templateId": template_id,
        "to": [
            {
                "email": lead.get("email").strip().lower(),
                "name": contact_name
            }
        ],
        "sender": {
            "id": SENDER_ID
        },
        "params": {
            "ORGANIZATION": lead.get("name", ""),
            "FIRSTNAME": first_name,
            "CONTACT_NAME": contact_name,
            "FRAMEWORK": lead.get("framework", "Curriculum"),
            "PILLAR": lead.get("pillar", "")
        }
    }

    headers = {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body)
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        return {"status": e.code, "error": True, "details": err_msg}
    except Exception as e:
        return {"status": 500, "error": True, "details": str(e)}

def run_cohort(pillar_key, cohort_size=30, dry_run=True):
    print("\n========================================================")
    print("      CONCORD OUTBOUND DIRECTOR: COHORT RUNNER           ")
    print("========================================================")
    
    cfg = PILLAR_CONFIG.get(pillar_key)
    if not cfg:
        print(f"Error: Unknown pillar key: {pillar_key}")
        return

    leads = load_leads()
    ledger = load_ledger()
    dispatched_map = ledger.get("dispatched", {})

    pillar_leads = [
        l for l in leads 
        if l.get("pillar") == pillar_key 
        and "@" in l.get("email", "")
        and not any(x in l.get("email") for x in [".contact", ".prospect", ".placeholder", "placeholder"])
    ]

    # Sort descending by score
    pillar_leads.sort(key=lambda x: x.get("score", 0), reverse=True)

    # Filter out already dispatched leads
    candidates = []
    for l in pillar_leads:
        em = l.get("email").strip().lower()
        if em not in dispatched_map:
            candidates.append(l)
        if len(candidates) >= cohort_size:
            break

    list_id = cfg["list_id"]
    template_id = cfg["template_id"]

    print(f"Target Pillar: {cfg['name']}")
    print(f"Brevo List ID: {list_id}")
    print(f"Brevo Template ID: {template_id}")
    print(f"Mode: {'[DRY RUN - SIMULATION]' if dry_run else '[LIVE DISPATCH]'}")
    print(f"Cohort Size Selected: {len(candidates)} of {len(pillar_leads)} total pillar leads")
    print("--------------------------------------------------------\n")

    if not candidates:
        print("No new leads to dispatch in this cohort. All leads already contacted or invalid emails.")
        return

    processed = 0
    for idx, lead in enumerate(candidates, 1):
        email = lead.get("email").strip().lower()
        org_name = lead.get("name")
        contact_name = lead.get("contact_name")
        score = lead.get("score")
        framework = lead.get("framework")

        print(f"[{idx}/{len(candidates)}] {org_name} ({email}) | Score: {score} | Framework: {framework}")

        if dry_run:
            print(f"    -> [SIMULATED] Brevo sync to List {list_id}")
            print(f"    -> [SIMULATED] Dispatched Template {template_id} to {email}")
            processed += 1
        else:
            # 1. Sync contact into Brevo list
            c_resp = import_contact_to_brevo(lead, list_id)
            if c_resp.get("error"):
                print(f"    -> Brevo contact sync note: {c_resp.get('details')}")

            # 2. Dispatch Touch 1 email
            send_resp = send_transactional_template(lead, template_id)
            if send_resp.get("error"):
                print(f"    -> FAILED TO SEND: {send_resp.get('details')}")
            else:
                msg_id = send_resp.get("messageId", "sent")
                print(f"    -> SUCCESS: Sent Template {template_id} (MessageId: {msg_id})")

                # Update Ledger
                dispatched_map[email] = {
                    "lead_id": lead.get("id"),
                    "name": org_name,
                    "pillar": pillar_key,
                    "template_id": template_id,
                    "dispatched_at": datetime.utcnow().isoformat(),
                    "message_id": msg_id
                }
                ledger["history"].append({
                    "email": email,
                    "lead_id": lead.get("id"),
                    "template_id": template_id,
                    "timestamp": datetime.utcnow().isoformat()
                })
                save_ledger(ledger)
                processed += 1
                time.sleep(0.5) # respectful pacing

    print(f"\n========================================================")
    print(f"Cohort Summary: {processed} leads processed in {cfg['name']}")
    print(f"Dispatched Ledger Saved: {LEDGER_PATH}")
    print(f"========================================================\n")

def main():
    parser = argparse.ArgumentParser(description="Concord Outbound Director: B2B Institutional Engine")
    parser.add_argument("--pillar", choices=["1", "3", "2", "4", "5"], default="1", 
                        help="Pillar number to target (1=Music, 3=ChildDev/Clinics, 2=Homeschool, 4=Holistic, 5=Multicultural)")
    parser.add_argument("--size", type=int, default=30, help="Cohort size (default 30)")
    parser.add_argument("--send", action="store_true", help="Execute live send (defaults to dry-run)")
    args = parser.parse_args()

    pillar_map = {
        "1": "Pillar I: Children's Music & Arts",
        "3": "Pillar III: Child Development",
        "2": "Pillar II: Homeschool Families",
        "4": "Pillar IV: Holistic Family Lifestyle",
        "5": "Pillar V: Multicultural & Bilingual Education"
    }

    selected_pillar = pillar_map[args.pillar]
    run_cohort(selected_pillar, cohort_size=args.size, dry_run=not args.send)

if __name__ == "__main__":
    main()
