import json
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
SCRIPTS_DIR = REPO_ROOT / "scripts"
WORKSPACE_PARENT = REPO_ROOT.parent

if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import nanobot_outreach_bridge as bridge  # noqa: E402


BANNED_SUBSTRINGS = [
    "—",
    "--",
    "shopify",
    "l.d. murray",
    "lee murray",
    "money-back",
    "refund",
    "no credit card required",
    "live instrumentation",
    "live acoustic",
    "memecoin",
    "shitcoin",
    "delve",
    "testament",
    "tapestry",
    "seamless",
    "game-changer",
    "holistic",
    "elevate",
    "foster",
    "100% policy-backed",
    "100% head start-backed",
    "government-approved",
    "star wars",
    "princess leia",
    "luke skywalker",
    "obi-wan",
]

BANNED_WORD_RE = re.compile(r"\bcharacter(?:s)?\b", re.IGNORECASE)
URL_RE = re.compile(r"https?://[^\s,)\"']*[^\s.,;:!?)\"']")


def _assert_clean_copy(text: str, label: str) -> None:
    lower = text.lower()
    for bad in BANNED_SUBSTRINGS:
        assert bad not in lower, f"{label} contains banned substring: {bad!r}"
    assert not BANNED_WORD_RE.search(text), f"{label} contains banned word 'character(s)'"
    for url in URL_RE.findall(text):
        assert (
            url.startswith("https://thesoundofessentials.com/")
            or url.startswith("https://soelearn.com/")
        ), f"{label} contains non-SOE URL: {url}"


def test_seriphia_signal_campaigns_strict_lint() -> None:
    campaigns_path = REPO_ROOT / "leads" / "seriphia_signal_campaigns.json"
    assert campaigns_path.exists()
    data = json.loads(campaigns_path.read_text(encoding="utf-8"))

    assert data["sender"]["brevo_sender_id"] == 2
    assert data["sender"]["email"] == "info@soelearn.com"
    assert data["guardrails"]["touch_cap"] == 3

    sequences = data["sequences"]
    expected_ids = {
        "d2c_seriphia_signal",
        "b2b_pod_clinic_signal",
        "global_policy_aligned_singapore",
        "global_policy_aligned_caribbean",
        "global_policy_aligned_india",
    }
    assert expected_ids.issubset(set(sequences.keys()))

    for seq_id, seq in sequences.items():
        touches = seq["touches"]
        assert len(touches) == 3, f"{seq_id} must follow 3-touch hard cap"
        for idx, touch in enumerate(touches, start=1):
            assert touch["touch"] == idx
            subject = touch["subject"]
            body = touch["body"]
            assert len(subject) < 30, f"{seq_id} touch {idx} subject >= 30 chars: {subject!r} ({len(subject)})"
            _assert_clean_copy(subject, f"{seq_id}.touch_{idx}.subject")
            _assert_clean_copy(body, f"{seq_id}.touch_{idx}.body")

            # Check <= 20 words per prose sentence (excluding greeting/signoff lines and bare URLs)
            for raw_line in body.splitlines():
                line = raw_line.strip()
                if not line or line.startswith("Hello ") or line.startswith("Respectfully") or line.startswith("With "):
                    continue
                line_no_urls = URL_RE.sub("url", line)
                for sentence in re.split(r"[.!?]+", line_no_urls):
                    cleaned = sentence.strip()
                    if not cleaned:
                        continue
                    wc = len(cleaned.split())
                    assert wc <= 20, f"{seq_id} touch {idx} sentence > 20 words ({wc}): {sentence!r}"

        if seq_id != "d2c_seriphia_signal":
            touch1_words = len(touches[0]["body"].split())
            assert 60 <= touch1_words <= 90, (
                f"{seq_id} B2B Touch 1 must be 60-90 words, got {touch1_words}"
            )


def test_global_advocacy_csv_ranking_and_dry_run() -> None:
    status = bridge.get_global_advocacy_status()
    assert status["theatre"] == "global-advocacy"
    assert status["total_targets"] == 126
    top5 = status["top_5_targets"]
    assert len(top5) == 5
    scores = [float(item["total_score"]) for item in top5]
    assert scores == sorted(scores, reverse=True)

    staged = bridge.run_global_advocacy_cohort(cohort_size=5, dry_run=True)
    assert staged["dry_run"] is True
    assert staged["selected_count"] == 5
    for draft in staged["drafts"]:
        assert draft["status"] == "STAGED_FOR_HUMAN_REVIEW"
        assert len(draft["subject"]) < 30
        _assert_clean_copy(draft["draft_body"], f"global_draft:{draft['id']}")


def test_triage_inbox_classification_and_grounded_drafts() -> None:
    cases = [
        ("Please remove me and unsubscribe our center.", "UNSUBSCRIBE"),
        ("Can our pediatric occupational therapy clinic request sensory regulation sample pages?", "CLINICAL_SAMPLE_REQUEST"),
        ("We run a micro-school pod and want classroom kit workbook pricing.", "POD_KIT_INQUIRY"),
        ("We have no budget right now due to strict screen time policy approval.", "OBJECTION"),
        ("Sounds wonderful, please share the pilot starter info for our pre-K.", "PILOT_INTEREST"),
    ]
    for body, expected_intent in cases:
        assert bridge.classify_inbox_reply(body) == expected_intent
        res = bridge.triage_inbox_reply(
            body_text=body,
            sender_email="director@example.org",
            org_name="Oakridge Early Learning",
            contact_name="Maria",
            framework="Head Start",
            stage_queue=False,
        )
        assert res["intent"] == expected_intent
        assert res["draft_never_send"] is True
        assert res["sender_email"] == "info@soelearn.com"
        assert len(res["subject"]) < 30
        assert res["mcls_approval_payload"]["status"] == "PENDING_APPROVAL"
        assert isinstance(res["citations"], list) and len(res["citations"]) >= 1
        _assert_clean_copy(res["subject"], f"triage:{expected_intent}:subject")
        _assert_clean_copy(res["draft_body"], f"triage:{expected_intent}:body")


def test_heartbeat_and_cron_registry_wired() -> None:
    heartbeat_text = (REPO_ROOT / "HEARTBEAT.md").read_text(encoding="utf-8")
    assert "triage-inbox" in heartbeat_text
    assert "--theatre global-advocacy" in heartbeat_text
    assert "40% Google / 25% Pinterest / 20% X.com / 15% Reddit" in heartbeat_text

    cron_path = WORKSPACE_PARENT / "autonomous-systems-stack" / "config" / "cron_registry.json"
    cron_data = json.loads(cron_path.read_text(encoding="utf-8"))
    ids = {r["id"]: r for r in cron_data["routines"]}
    assert "rt-signal-global-stage" in ids and ids["rt-signal-global-stage"]["enabled"] is True
    assert "rt-inbox-reply-triage" in ids and ids["rt-inbox-reply-triage"]["enabled"] is True
