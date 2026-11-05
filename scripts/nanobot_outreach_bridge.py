#!/usr/bin/env python3
"""
Nanobot Outreach Bridge: Autonomous B2B Institutional Outreach Harness
The Sound of Essentials: Rhythm Quest (soelearn.com)

Provides an agent-accessible command bridge for Nanobot to autonomously:
1. Inspect pipeline health, pillar balances, and ledger stats ('status')
2. Execute daily 25-30 lead cohorts with zero duplicates ('run-cohort')
3. Inject the 10-15 minute screen-free lesson extender hook into outbound dispatches
4. Ingest and score newly prospected leads from Nanobot's web crawler ('ingest-leads')
5. Generate grounded response drafts for inbound director replies ('draft-reply')
"""

import os
import sys
import json
import argparse
from datetime import datetime

# Windows Console UTF-8 compatibility
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCRIPTS_DIR = os.path.join(WORKSPACE_ROOT, "scripts")
LEADS_JSON_PATH = os.path.join(WORKSPACE_ROOT, "leads", "concord_master_leads_1209.json")
LEDGER_PATH = os.path.join(WORKSPACE_ROOT, "leads", "concord_outbound_ledger.json")

# Add scripts directory to path to import concord_outbound_engine
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

try:
    import concord_outbound_engine as engine
except ImportError:
    engine = None


# State / Framework Crosswalk Mapping
STANDARDS_CROSSWALK = {
    "EYLF": "Early Years Learning Framework (EYLF - Australia)",
    "EYFS": "Early Years Foundation Stage (EYFS - UK)",
    "Head Start": "Head Start Early Learning Outcomes Framework (ELOF)",
    "ELOF": "Head Start Early Learning Outcomes Framework (ELOF)",
    "California": "California Preschool Learning Foundations & DRDP",
    "Texas": "Texas Pre-Kindergarten Guidelines (TPG)",
    "Florida": "Florida Early Learning and Developmental Standards",
    "New York": "New York State Early Learning Guidelines",
    "Montessori": "Stage-Based Sensory & Practical Life Framework",
    "Reggio Emilia": "Reggio Emilia Emergent & Acoustic Environment Framework",
    "Default": "National Early Childhood Learning Standards"
}

LESSON_EXTENDER_TITLE = "SOE ECE Lesson Extender: 10-15 Min Screen-Free Tactile Rituals"
LESSON_EXTENDER_URL = "https://thesoundofessentials.com/tools/lesson-extender"


def get_pipeline_status():
    """Returns a structured summary of total leads, dispatched leads, and remaining queue per pillar."""
    if not os.path.exists(LEADS_JSON_PATH):
        return {"error": f"Leads file missing at {LEADS_JSON_PATH}"}
    
    with open(LEADS_JSON_PATH, "r", encoding="utf-8") as f:
        leads = json.load(f)
        
    ledger = {"dispatched": {}}
    if os.path.exists(LEDGER_PATH):
        try:
            with open(LEDGER_PATH, "r", encoding="utf-8") as f:
                ledger = json.load(f)
        except Exception:
            pass
            
    dispatched_map = ledger.get("dispatched", {})
    
    pillar_stats = {}
    valid_leads_total = 0
    dispatched_total = len(dispatched_map)
    
    for lead in leads:
        em = lead.get("email", "").strip().lower()
        if not em or "@" not in em or any(x in em for x in [".contact", ".prospect", ".placeholder"]):
            continue
            
        valid_leads_total += 1
        p = lead.get("pillar", "Uncategorized")
        if p not in pillar_stats:
            pillar_stats[p] = {"total": 0, "dispatched": 0, "remaining": 0}
            
        pillar_stats[p]["total"] += 1
        if em in dispatched_map:
            pillar_stats[p]["dispatched"] += 1
        else:
            pillar_stats[p]["remaining"] += 1

    return {
        "total_database_records": len(leads),
        "valid_email_leads": valid_leads_total,
        "total_dispatched": dispatched_total,
        "remaining_queue": valid_leads_total - dispatched_total,
        "pillar_breakdown": pillar_stats,
        "lesson_hook": LESSON_EXTENDER_TITLE,
        "timestamp": datetime.now().isoformat()
    }


def execute_cohort(pillar_num, cohort_size=30, dry_run=True):
    """Executes a cohort using concord_outbound_engine with the Lesson Extender hook."""
    pillar_map = {
        1: "Pillar I: Children's Music & Arts",
        2: "Pillar II: Homeschool Families",
        3: "Pillar III: Child Development",
        4: "Pillar IV: Holistic Family Lifestyle",
        5: "Pillar V: Multicultural & Bilingual Education"
    }
    
    pillar_key = pillar_map.get(pillar_num)
    if not pillar_key:
        print(f"Error: Invalid pillar number {pillar_num}. Options: 1, 2, 3, 4, 5.")
        return False
        
    if not engine:
        print("Error: concord_outbound_engine could not be loaded.")
        return False

    print(f"\n[Nanobot Outreach Bridge] Initiating cohort execution...")
    print(f"Pillar: {pillar_key}")
    print(f"Cohort Size: {cohort_size}")
    print(f"Mode: {'SIMULATION (Dry-Run)' if dry_run else 'LIVE DISPATCH (Brevo)'}")
    print(f"Value Hook: {LESSON_EXTENDER_TITLE} ({LESSON_EXTENDER_URL})\n")
    
    # Run engine cohort
    engine.run_cohort(pillar_key=pillar_key, cohort_size=cohort_size, dry_run=dry_run)
    return True


def draft_reply_for_inquiry(inquiry_text, school_name="", contact_name="", state_or_framework=""):
    """
    Drafts an authoritative, grounded response for an inbound educator inquiry,
    delivering the private gift link to the ECE Lesson Extender Tool.
    """
    framework_resolved = STANDARDS_CROSSWALK.get(state_or_framework, STANDARDS_CROSSWALK["Default"])
    first_name = contact_name.split()[0] if contact_name and contact_name.lower() != "director" else "Director"
    
    draft = f"""Hi {first_name},

Thank you for reaching out regarding The Sound of Essentials: Rhythm Quest. 

We would be delighted to share the complete materials with your teaching team at {school_name or 'your center'}. 

As promised, here is the direct gift access to our interactive classroom resource:
-> {LESSON_EXTENDER_URL}

What this includes for your educators:
- 10 to 15 minute tactile lesson extensions (Ages 2 to 7) spanning Language, Cognitive, Movement, Science, and Emotional regulation domains.
- Direct alignment with {framework_resolved}.
- Screen-free classroom ritual cards, sensory calm transitions, and teacher acoustic chord charts.
- Full access to all 19 tracks across the 7 Lands.

Your teachers can test the exercises immediately with existing staff without any screen or tech friction.

If you have any questions as your staff explores the rhythms, please feel free to reply directly here.

Warm regards,

Seriphia and the Sound of Essentials Collective
Education Concord · The Sound of Essentials
https://thesoundofessentials.com
"""
    return draft


def main():
    parser = argparse.ArgumentParser(description="Nanobot Outreach Bridge for The Sound of Essentials")
    subparsers = parser.add_subparsers(dest="command", help="Subcommand to execute")

    # Command: status
    parser_status = subparsers.add_parser("status", help="Get pipeline summary and remaining lead queues")
    parser_status.add_argument("--json", action="store_true", help="Output raw JSON format")

    # Command: run-cohort
    parser_cohort = subparsers.add_parser("run-cohort", help="Execute an outreach cohort")
    parser_cohort.add_argument("--pillar", type=int, default=1, choices=[1, 2, 3, 4, 5], help="Target pillar (1-5)")
    parser_cohort.add_argument("--size", type=int, default=30, help="Cohort batch size")
    parser_cohort.add_argument("--send", action="store_true", help="Execute live send via Brevo (default is dry-run)")

    # Command: draft-reply
    parser_draft = subparsers.add_parser("draft-reply", help="Generate a grounded reply delivering the gift link")
    parser_draft.add_argument("--school", type=str, default="your center", help="School or center name")
    parser_draft.add_argument("--name", type=str, default="Director", help="Contact person name")
    parser_draft.add_argument("--framework", type=str, default="Head Start", help="State or curriculum framework")

    args = parser.parse_args()

    if args.command == "status":
        stats = get_pipeline_status()
        if args.json:
            print(json.dumps(stats, indent=2))
        else:
            print("\n========================================================")
            print("         SOE B2B OUTREACH ENGINE: PIPELINE STATUS       ")
            print("========================================================")
            print(f"Total Database Leads : {stats['total_database_records']:,}")
            print(f"Valid Email Leads    : {stats['valid_email_leads']:,}")
            print(f"Dispatched Leads     : {stats['total_dispatched']:,}")
            print(f"Remaining in Queue   : {stats['remaining_queue']:,}")
            print(f"Active Value Hook    : {stats['lesson_hook']}")
            print("--------------------------------------------------------")
            print("Pillar Queue Breakdown:")
            for p, d in stats["pillar_breakdown"].items():
                print(f"  • {p[:36]:<36} | Total: {d['total']:<4} | Sent: {d['dispatched']:<4} | Ready: {d['remaining']:<4}")
            print("========================================================\n")

    elif args.command == "run-cohort":
        execute_cohort(pillar_num=args.pillar, cohort_size=args.size, dry_run=not args.send)

    elif args.command == "draft-reply":
        reply = draft_reply_for_inquiry("", school_name=args.school, contact_name=args.name, state_or_framework=args.framework)
        print("\n========================================================")
        print("         GENERATED GIFT LINK DRAFT RESPONSE             ")
        print("========================================================")
        print(reply)
        print("========================================================\n")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
