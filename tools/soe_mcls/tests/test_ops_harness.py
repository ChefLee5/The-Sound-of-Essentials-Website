from datetime import datetime, timedelta, timezone
from pathlib import Path

from soe_mcls.mcp_server import execute_tool, verify_canon_text
from soe_mcls.ops_harness import (
    MAX_HANDOFF_WORDS,
    RunLedger,
    check_snapshot_change,
    extract_needed_sections,
    is_snapshot_fresh,
    verify_evidence_checklist,
    write_handoff,
)


def test_snapshot_diff_unchanged_changed_and_failed(tmp_path: Path):
    sources = tmp_path / "sources"
    html_v1 = "<html><nav>Menu</nav><main><h1>Plan</h1><p>$24/mo billed annually</p></main><footer>2026</footer></html>"
    html_cosmetic = "<html><nav>New Menu</nav><main><h1>Plan</h1><p>$24/mo   billed annually</p></main><footer>Updated</footer></html>"
    html_v2 = "<html><nav>Menu</nav><main><h1>Plan</h1><p>$19/mo billed annually</p></main></html>"

    r1 = check_snapshot_change("abcmouse", sources, html_v1, "https://abcmouse.com/pricing")
    assert r1["source_outcome"] == "changed"
    assert r1["changed"] is True

    # Cosmetic nav/footer/whitespace change -> unchanged, preserves original checked_at
    r2 = check_snapshot_change("abcmouse", sources, html_cosmetic, "https://abcmouse.com/pricing")
    assert r2["source_outcome"] == "unchanged"
    assert r2["changed"] is False
    assert r2["checked_at"] == r1["checked_at"]

    # Failed fetch NEVER counts as unchanged
    r_fail = check_snapshot_change("abcmouse", sources, None, "https://abcmouse.com/pricing", fetch_error="HTTP 503")
    assert r_fail["source_outcome"] == "check_failed"
    assert r_fail["changed"] is False

    # Actual price change -> changed
    r3 = check_snapshot_change("abcmouse", sources, html_v2, "https://abcmouse.com/pricing")
    assert r3["source_outcome"] == "changed"
    assert r3["changed"] is True


def test_targeted_extraction_and_freshness():
    text = "Intro noise.\nFooter legal.\nAnnual plan costs $24/user/month billed annually with 5 seats.\nMore filler."
    extracted = extract_needed_sections(text, keywords=["billed annually", "seats"], context_lines=0)
    assert "$24/user/month billed annually" in extracted["excerpt"]
    assert "Intro noise" not in extracted["excerpt"]

    now = datetime(2026, 11, 13, 18, 0, tzinfo=timezone.utc)
    fresh_snap = {"source_outcome": "changed", "checked_at": (now - timedelta(hours=6)).isoformat()}
    stale_snap = {"source_outcome": "changed", "checked_at": (now - timedelta(hours=30)).isoformat()}
    failed_snap = {"source_outcome": "check_failed", "checked_at": now.isoformat()}

    assert is_snapshot_fresh(fresh_snap, refresh_hours=12, now=now) is True
    assert is_snapshot_fresh(stale_snap, refresh_hours=12, now=now) is False
    assert is_snapshot_fresh(failed_snap, refresh_hours=12, now=now) is False


def test_run_ledger_max_two_attempts_and_skip_accepted(tmp_path: Path):
    ledger = RunLedger(tmp_path / "run-log.csv")

    # Accepted task is never reprocessed
    ledger.record("2026-11-13-pulse-am", "MCLS-PULSE", "accepted", "changed", evidence_path="brief.md")
    assert ledger.should_run("2026-11-13-pulse-am")["run"] is False

    # Failing task: attempt 1 -> failed, attempt 2 (retry) -> blocked
    r1 = ledger.record("harbor-check", "MCLS-RECON", "failed", "check_failed", error="Timeout 1")
    assert r1["status"] == "failed"
    assert ledger.should_run("harbor-check")["run"] is True

    r2 = ledger.record("harbor-check", "MCLS-RECON", "failed", "check_failed", error="Timeout 2", is_retry=True)
    assert r2["status"] == "blocked"
    assert ledger.should_run("harbor-check")["run"] is False
    assert ledger.should_run("harbor-check")["reason"] == "max_attempts_reached"


def test_evidence_checklist_and_compact_handoff(tmp_path: Path):
    ev = tmp_path / "evidence.md"
    ev.write_text("Receipt verified.", encoding="utf-8")

    bad = verify_evidence_checklist(
        content_text="Check https://northstar.example/pricing for our 4,232-word dictionary.",
        evidence_paths=[str(tmp_path / "missing.md")],
        checked_at="",
        canon_checker=verify_canon_text,
    )
    assert bad["verdict"] == "NEEDS_REVIEW"
    assert bad["checks"]["source_urls"]["state"] == "FAIL"
    assert bad["checks"]["evidence_files"]["state"] == "FAIL"
    assert bad["checks"]["canon_compliance"]["state"] == "FAIL"
    assert bad["checks"]["checked_at"]["state"] == "UNKNOWN"

    good = verify_evidence_checklist(
        content_text="Verified at https://soelearn.com/listen with 4,000+ words for Ages 2–7.",
        evidence_paths=[str(ev)],
        checked_at="2026-11-13T17:58:00Z",
        canon_checker=verify_canon_text,
    )
    assert good["verdict"] == "ACCEPTED"
    assert good["accepted"] is True

    # MCP server exposes mcls_verify_done_checklist cleanly
    mcp_res = execute_tool("mcls_verify_done_checklist", {
        "content_text": "Verified at https://soelearn.com/listen with 4,000+ words for Ages 2–7.",
        "evidence_paths": [str(ev)],
        "checked_at": "2026-11-13T17:58:00Z",
    })
    assert mcp_res["accepted"] is True

    handoff = write_handoff(
        tmp_path / "HANDOFF.md",
        goal="Daily Pulse",
        owner="MCLS-PULSE",
        completed=["Pulse AM"],
        unresolved=["None"],
        next_action="Run Pulse PM.",
        evidence_paths=[str(ev)],
    )
    assert handoff["word_count"] <= MAX_HANDOFF_WORDS

