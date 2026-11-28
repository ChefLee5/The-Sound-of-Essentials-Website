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
SIGNAL_CAMPAIGNS_PATH = os.path.join(WORKSPACE_ROOT, "leads", "seriphia_signal_campaigns.json")
GLOBAL_ADVOCACY_CSV_PATH = os.path.abspath(
    os.path.join(WORKSPACE_ROOT, "..", "soe-music-advocacy-recon", "03_global_advocacy_targets.csv")
)
GLOBAL_ADVOCACY_LEDGER_PATH = os.path.join(WORKSPACE_ROOT, "leads", "global_advocacy_cohort_ledger.json")
INBOX_TRIAGE_QUEUE_PATH = os.path.join(WORKSPACE_ROOT, "leads", "signal_inbox_triage_queue.json")

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


import csv as _csv
import datetime as _dt
import json as _json
import sys as _sys

INBOX_INTENTS = (
    "UNSUBSCRIBE",
    "CLINICAL_SAMPLE_REQUEST",
    "POD_KIT_INQUIRY",
    "OBJECTION",
    "PILOT_INTEREST",
)

DETERMINISTIC_CROSSWALK_CITATIONS = {
    "Head Start": [
        {
            "title": "Track 1: Sunny Day (90 BPM)",
            "standard": "Head Start ELOF: Emotional and Behavioral Self-Regulation",
            "alignment": "Designed in alignment with calm acoustic transition routines for ages 2 to 7.",
        },
        {
            "title": "Five Neural Pathways Guide",
            "standard": "Head Start ELOF: Phonological Awareness & Attending",
            "alignment": "Designed in alignment with Sound Before Symbols readiness steps.",
        },
    ],
    "Grow Well SG": [
        {
            "title": "Sensory Regulation Guide",
            "standard": "Grow Well SG: Healthy Early Childhood Screen Habits",
            "alignment": "Designed in alignment with offline, zero-screen family and classroom play.",
        }
    ],
    "Jaadui Pitara": [
        {
            "title": "Track 1: Sunny Day (90 BPM)",
            "standard": "NEP Foundational Stage / Jaadui Pitara: Play-Based Learning",
            "alignment": "Designed in alignment with tactile sound and movement discovery.",
        }
    ],
    "Caribbean ECC": [
        {
            "title": "Sensory Regulation Guide",
            "standard": "Caribbean Early Childhood Development: Expressive & Social Readiness",
            "alignment": "Designed in alignment with low-hardware oral rhythm and community storytelling.",
        }
    ],
    "OT/SLP Clinical": [
        {
            "title": "Sensory Regulation Guide",
            "standard": "Pediatric OT/SLP Co-Regulation & Auditory Attending Goals",
            "alignment": "Designed in alignment with 90 BPM prosody and bilateral tactile pacing.",
        }
    ],
}


def load_global_advocacy_targets(csv_path=None):
    """Load and score-sort Global Advocacy target records from CSV."""
    path = csv_path or GLOBAL_ADVOCACY_CSV_PATH
    if not os.path.exists(path):
        return []
    targets = []
    with open(path, "r", encoding="utf-8-sig", newline="") as fh:
        reader = _csv.DictReader(fh)
        for row in reader:
            raw_score = (row.get("Total_Score") or "0").strip()
            try:
                score_val = float(raw_score)
            except ValueError:
                score_val = 0.0
            row["_numeric_score"] = score_val
            targets.append(row)
    targets.sort(key=lambda item: item.get("_numeric_score", 0.0), reverse=True)
    return targets


def _select_global_sequence_id(target_row):
    """Map a global advocacy CSV row to a signal campaign sequence ID."""
    region = (target_row.get("Region") or "").lower()
    country = (target_row.get("Country_Territory") or "").lower()
    mechanism = (target_row.get("Key_Program_or_Mechanism") or "").lower()
    org = (target_row.get("Organization") or "").lower()
    blob = " ".join([region, country, mechanism, org])
    if "singapore" in blob or "grow well" in blob or "ecda" in blob:
        return "global_policy_aligned_singapore"
    if "caribbean" in blob or "jamaica" in blob or "trinidad" in blob or "barbados" in blob:
        return "global_policy_aligned_caribbean"
    if "india" in blob or "jaadui" in blob or "ncert" in blob or "iap" in blob:
        return "global_policy_aligned_india"
    return "b2b_pod_clinic_signal"


def get_global_advocacy_status(csv_path=None, ledger_path=None):
    """Summarize the 126+ Global Advocacy target queue and staged draft count."""
    targets = load_global_advocacy_targets(csv_path=csv_path)
    l_path = ledger_path or GLOBAL_ADVOCACY_LEDGER_PATH
    staged_ids = set()
    if os.path.exists(l_path):
        try:
            with open(l_path, "r", encoding="utf-8") as fh:
                ledger_data = _json.load(fh)
                staged_ids = set(ledger_data.get("staged_ids", []))
        except (OSError, ValueError):
            staged_ids = set()

    by_region = {}
    remaining = 0
    for t in targets:
        reg = (t.get("Region") or "Unspecified").strip()
        by_region[reg] = by_region.get(reg, 0) + 1
        if t.get("ID") not in staged_ids:
            remaining += 1

    return {
        "theatre": "global-advocacy",
        "csv_path": csv_path or GLOBAL_ADVOCACY_CSV_PATH,
        "total_targets": len(targets),
        "staged_count": len(staged_ids),
        "remaining_targets": remaining,
        "regions": by_region,
        "top_5_targets": [
            {
                "id": t.get("ID"),
                "organization": t.get("Organization"),
                "country": t.get("Country_Territory"),
                "category": t.get("Category"),
                "total_score": t.get("Total_Score"),
                "sequence_id": _select_global_sequence_id(t),
            }
            for t in targets[:5]
        ],
    }


def run_global_advocacy_cohort(cohort_size=10, dry_run=True, csv_path=None, ledger_path=None, campaigns_path=None):
    """Stage highest-scoring Global Advocacy briefs (Draft, Never Send)."""
    targets = load_global_advocacy_targets(csv_path=csv_path)
    c_path = campaigns_path or SIGNAL_CAMPAIGNS_PATH
    l_path = ledger_path or GLOBAL_ADVOCACY_LEDGER_PATH

    sequences = {}
    if os.path.exists(c_path):
        with open(c_path, "r", encoding="utf-8") as fh:
            sequences = _json.load(fh).get("sequences", {})

    ledger = {"staged_ids": [], "drafts": []}
    if os.path.exists(l_path):
        try:
            with open(l_path, "r", encoding="utf-8") as fh:
                loaded = _json.load(fh)
                if isinstance(loaded, dict):
                    ledger.update(loaded)
        except (OSError, ValueError):
            pass

    staged_set = set(ledger.get("staged_ids", []))
    queued = [t for t in targets if t.get("ID") not in staged_set][:cohort_size]
    staged_now = []

    for row in queued:
        seq_id = _select_global_sequence_id(row)
        seq = sequences.get(seq_id) or sequences.get("b2b_pod_clinic_signal") or {}
        touches = seq.get("touches", [])
        touch_1 = touches[0] if touches else {
            "subject": "Calm pre-K rhythm routines",
            "body": "Hello Team, explore https://thesoundofessentials.com/signal for children ages 2 to 7.",
        }
        org_name = (row.get("Organization") or "Partner Organization").strip()
        draft_subject = touch_1["subject"].replace("{{organization}}", org_name)[:29]
        draft_body = (
            touch_1["body"]
            .replace("{{contact_name}}", "Curriculum Director")
            .replace("{{organization}}", org_name)
        )
        entry = {
            "id": row.get("ID"),
            "organization": org_name,
            "country": row.get("Country_Territory"),
            "official_url": row.get("Official_URL"),
            "total_score": row.get("Total_Score"),
            "sequence_id": seq_id,
            "subject": draft_subject,
            "draft_body": draft_body,
            "status": "STAGED_FOR_HUMAN_REVIEW",
        }
        staged_now.append(entry)
        if not dry_run:
            ledger.setdefault("staged_ids", []).append(row.get("ID"))
            ledger.setdefault("drafts", []).append(entry)

    if not dry_run and staged_now:
        os.makedirs(os.path.dirname(l_path), exist_ok=True)
        with open(l_path, "w", encoding="utf-8") as fh:
            _json.dump(ledger, fh, indent=2)

    return {
        "theatre": "global-advocacy",
        "dry_run": dry_run,
        "selected_count": len(staged_now),
        "drafts": staged_now,
    }


def classify_inbox_reply(body_text, subject_text=""):
    """Classify an inbound educator/clinic/family reply into one closed intent enum."""
    combined = f"{subject_text or ''} {body_text or ''}".lower()

    unsubscribe_terms = (
        "unsubscribe",
        "remove me",
        "opt out",
        "stop emailing",
        "do not contact",
        "take me off",
    )
    if any(term in combined for term in unsubscribe_terms):
        return "UNSUBSCRIBE"

    clinical_terms = (
        "occupational therapy",
        "speech therapy",
        "slp",
        "clinic",
        "sensory regulation",
        "sample",
        "patient",
        "pediatric",
        "dysregulation",
    )
    if any(term in combined for term in clinical_terms):
        return "CLINICAL_SAMPLE_REQUEST"

    pod_terms = (
        "micro-school",
        "microschool",
        "pod",
        "kit",
        "bulk",
        "workbook",
        "classroom",
        "preschool",
        "cohort",
        "curriculum",
    )
    if any(term in combined for term in pod_terms):
        return "POD_KIT_INQUIRY"

    objection_terms = (
        "no budget",
        "not interested",
        "too expensive",
        "cannot",
        "can't",
        "concerned",
        "approval",
        "screen time policy",
        "not right now",
    )
    if any(term in combined for term in objection_terms):
        return "OBJECTION"

    return "PILOT_INTEREST"


def _fetch_standards_crosswalk(query_text, framework_hint="Head Start"):
    """Query tools/soe_haystack if available, otherwise return deterministic citations."""
    tools_dir = os.path.join(WORKSPACE_ROOT, "tools")
    if tools_dir not in _sys.path:
        _sys.path.insert(0, tools_dir)

    citations = []
    haystack_used = False
    try:
        from soe_haystack.engine import get_haystack_engine

        engine = get_haystack_engine()
        res = engine.crosswalk_standards(f"{framework_hint} {query_text}")
        raw_citations = res.get("curriculum_crosswalk_matches") or []
        for item in raw_citations[:2]:
            title = item.get("title") or item.get("source") or "SOE Rhythm Quest Resource"
            citations.append(
                {
                    "title": title,
                    "standard": f"{framework_hint} Early Learning Readiness",
                    "alignment": "Designed in alignment with zero-screen sensory rhythm benchmarks.",
                }
            )
        if citations:
            haystack_used = True
    except Exception:
        citations = []

    if not citations:
        citations = list(
            DETERMINISTIC_CROSSWALK_CITATIONS.get(
                framework_hint,
                DETERMINISTIC_CROSSWALK_CITATIONS["Head Start"],
            )
        )
    return citations, haystack_used


def triage_inbox_reply(
    body_text,
    subject_text="",
    sender_email="",
    org_name="your team",
    contact_name="Director",
    framework="Head Start",
    stage_queue=False,
):
    """Classify an inbound reply, resolve Haystack citations, and draft a grounded response."""
    intent = classify_inbox_reply(body_text, subject_text)
    citations, haystack_used = _fetch_standards_crosswalk(body_text or subject_text, framework_hint=framework)
    top_cite = citations[0]["title"] if citations else "Track 1: Sunny Day (90 BPM)"

    if intent == "UNSUBSCRIBE":
        reply_subject = "Confirmed removal request"
        draft_reply = (
            f"Hello {contact_name},\n\n"
            "We have removed your address from our outreach list right away. "
            "Your team still has free open access to https://soelearn.com/listen if needed later.\n\n"
            "Respectfully,\n"
            "The Sound of Essentials Institutional Team"
        )
        action = "MARK_SUPPRESSED_AND_STOP"
    elif intent == "CLINICAL_SAMPLE_REQUEST":
        reply_subject = "Sensory guide and free audio"
        draft_reply = (
            f"Hello {contact_name},\n\n"
            f"Thank you for serving young learners at {org_name}. For pediatric OT and SLP sessions (ages 2 to 7), "
            f"our Sensory Regulation Guide pairs calm 90 BPM acoustic rhythm ({top_cite}) with tactile co-regulation.\n\n"
            "Download the printable guide at https://thesoundofessentials.com/downloads/SOE_Sensory_Regulation_Guide.html "
            "and stream all 19 tracks free at https://soelearn.com/listen.\n\n"
            "The Sound of Essentials is an independent curriculum designed in alignment with developmental readiness frameworks.\n\n"
            "Respectfully,\n"
            "The Sound of Essentials Institutional Team"
        )
        action = "STAGE_CLINICAL_SAMPLE_REPLY"
    elif intent == "POD_KIT_INQUIRY":
        reply_subject = "Pod kit and guide links"
        draft_reply = (
            f"Hello {contact_name},\n\n"
            f"Thank you for asking about learning kits for {org_name} (ages 2 to 7). "
            "Teachers can start free today using our Five Neural Pathways Guide at "
            "https://thesoundofessentials.com/downloads/SOE_5_Neural_Pathways_Guide.html and free audio at https://soelearn.com/listen.\n\n"
            "For full rooms, our Digital Workbook is $21, Digital Storybook is $19, Print Workbook is $45, and Print Storybook is $35 "
            "at https://thesoundofessentials.com/signal. Designed in alignment with Head Start ELOF goals.\n\n"
            "Respectfully,\n"
            "The Sound of Essentials Institutional Team"
        )
        action = "STAGE_POD_KIT_REPLY"
    elif intent == "OBJECTION":
        reply_subject = "Free open rhythm access"
        draft_reply = (
            f"Hello {contact_name},\n\n"
            f"Thank you for sharing your priorities at {org_name}. Zero budget or tablet limits are never a barrier here.\n\n"
            "Your team can use our free 19-track album at https://soelearn.com/listen and our free printable guides at "
            "https://thesoundofessentials.com/signal completely offline with no paid subscription required.\n\n"
            "Respectfully,\n"
            "The Sound of Essentials Institutional Team"
        )
        action = "STAGE_NO_PRESSURE_RESOURCE_REPLY"
    else:
        reply_subject = "Your signal starter links"
        draft_reply = (
            f"Hello {contact_name},\n\n"
            f"We appreciate your interest at {org_name}. Based on your note, start with {top_cite} for calm ages 2 to 7 engagement.\n\n"
            "Stream all 19 tracks free at https://soelearn.com/listen and open our printable guides and crosswalks at "
            "https://thesoundofessentials.com/signal. Designed in alignment with " + framework + " readiness goals.\n\n"
            "Respectfully,\n"
            "The Sound of Essentials Institutional Team"
        )
        action = "STAGE_PILOT_REPLY"

    result = {
        "intent": intent,
        "recommended_action": action,
        "draft_never_send": True,
        "sender_email": "info@soelearn.com",
        "recipient_email": sender_email,
        "subject": reply_subject[:29],
        "draft_body": draft_reply,
        "haystack_used": haystack_used,
        "citations": citations,
        "mcls_approval_payload": {
            "channel": "EMAIL_TRIAGE",
            "title": f"[{intent}] Reply Draft for {org_name}",
            "target_url": "https://thesoundofessentials.com/signal",
            "status": "PENDING_APPROVAL",
            "created_at": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        },
    }

    if stage_queue:
        os.makedirs(os.path.dirname(INBOX_TRIAGE_QUEUE_PATH), exist_ok=True)
        existing = []
        if os.path.exists(INBOX_TRIAGE_QUEUE_PATH):
            try:
                with open(INBOX_TRIAGE_QUEUE_PATH, "r", encoding="utf-8") as fh:
                    existing = _json.load(fh)
            except (OSError, ValueError):
                existing = []
        if not isinstance(existing, list):
            existing = []
        existing.append(result)
        with open(INBOX_TRIAGE_QUEUE_PATH, "w", encoding="utf-8") as fh:
            _json.dump(existing, fh, indent=2)

    return result


def dispatch_phase4_cli(argv):
    """Handle Phase 4 subcommands and --theatre flags cleanly."""
    parser = argparse.ArgumentParser(prog="nanobot_outreach_bridge.py")
    sub = parser.add_subparsers(dest="command")

    p_st = sub.add_parser("status")
    p_st.add_argument("--json", action="store_true")
    p_st.add_argument("--theatre", choices=["concord", "global-advocacy"], default="concord")

    p_co = sub.add_parser("run-cohort")
    p_co.add_argument("--pillar", type=int, default=1)
    p_co.add_argument("--size", type=int, default=10)
    p_co.add_argument("--send", action="store_true")
    p_co.add_argument("--theatre", choices=["concord", "global-advocacy"], default="concord")

    p_tr = sub.add_parser("triage-inbox")
    p_tr.add_argument("--body", required=True, help="Inbound reply email text")
    p_tr.add_argument("--subject", default="", help="Inbound email subject")
    p_tr.add_argument("--sender", default="", help="Inbound sender email")
    p_tr.add_argument("--org", default="your team", help="Organization or school name")
    p_tr.add_argument("--name", default="Director", help="Contact person name")
    p_tr.add_argument("--framework", default="Head Start", help="Curriculum alignment hint")
    p_tr.add_argument("--stage", action="store_true", help="Append draft to local triage queue")
    p_tr.add_argument("--json", action="store_true", help="Output raw JSON")

    parsed, unknown = parser.parse_known_args(argv)
    if unknown:
        return None

    if parsed.command == "status" and parsed.theatre == "global-advocacy":
        out = get_global_advocacy_status()
        print(_json.dumps(out, indent=2) if parsed.json else out)
        return 0

    if parsed.command == "run-cohort" and parsed.theatre == "global-advocacy":
        out = run_global_advocacy_cohort(cohort_size=parsed.size, dry_run=not parsed.send)
        print(_json.dumps(out, indent=2))
        return 0

    if parsed.command == "triage-inbox":
        out = triage_inbox_reply(
            body_text=parsed.body,
            subject_text=parsed.subject,
            sender_email=parsed.sender,
            org_name=parsed.org,
            contact_name=parsed.name,
            framework=parsed.framework,
            stage_queue=parsed.stage,
        )
        print(_json.dumps(out, indent=2) if parsed.json else f"[{out['intent']}] {out['subject']}\n\n{out['draft_body']}")
        return 0

    return None


def main():
    if "-h" not in _sys.argv and "--help" not in _sys.argv and (
        (len(_sys.argv) >= 2 and _sys.argv[1] == "triage-inbox")
        or "--theatre" in _sys.argv
    ):
        handled_rc = dispatch_phase4_cli(_sys.argv[1:])
        if handled_rc is not None:
            _sys.exit(handled_rc)

    parser = argparse.ArgumentParser(description="Nanobot Outreach Bridge for The Sound of Essentials")
    subparsers = parser.add_subparsers(dest="command", help="Subcommand to execute")

    # Command: status
    parser_status = subparsers.add_parser("status", help="Get pipeline summary and remaining lead queues")
    parser_status.add_argument("--json", action="store_true", help="Output raw JSON format")
    parser_status.add_argument("--theatre", choices=["concord", "global-advocacy"], default="concord", help="Lead theatre selector")

    # Command: run-cohort
    parser_cohort = subparsers.add_parser("run-cohort", help="Execute an outreach cohort")
    parser_cohort.add_argument("--pillar", type=int, default=1, choices=[1, 2, 3, 4, 5], help="Target pillar (1-5)")
    parser_cohort.add_argument("--size", type=int, default=30, help="Cohort batch size")
    parser_cohort.add_argument("--send", action="store_true", help="Execute live send via Brevo (default is dry-run)")
    parser_cohort.add_argument("--theatre", choices=["concord", "global-advocacy"], default="concord", help="Lead theatre selector")

    # Command: draft-reply
    parser_draft = subparsers.add_parser("draft-reply", help="Generate a grounded reply delivering the gift link")
    parser_draft.add_argument("--school", type=str, default="your center", help="School or center name")
    parser_draft.add_argument("--name", type=str, default="Director", help="Contact person name")
    parser_draft.add_argument("--framework", type=str, default="Head Start", help="State or curriculum framework")

    # Command: triage-inbox
    parser_triage = subparsers.add_parser("triage-inbox", help="Classify inbound reply and stage grounded human-review draft")
    parser_triage.add_argument("--body", type=str, required=True, help="Inbound reply email text")
    parser_triage.add_argument("--subject", type=str, default="", help="Inbound email subject")
    parser_triage.add_argument("--sender", type=str, default="", help="Inbound sender email")
    parser_triage.add_argument("--org", type=str, default="your team", help="Organization or school name")
    parser_triage.add_argument("--name", type=str, default="Director", help="Contact person name")
    parser_triage.add_argument("--framework", type=str, default="Head Start", help="Curriculum alignment hint")
    parser_triage.add_argument("--stage", action="store_true", help="Stage draft in local triage queue")
    parser_triage.add_argument("--json", action="store_true", help="Output raw JSON format")

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
