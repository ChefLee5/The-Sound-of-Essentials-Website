"""
SOE-MCLS Lean Operations Harness ("Meat, No Bones" — adapted from @Greshamtrade).

Provides five deterministic primitives that cut wasted tokens/credits and prevent
unverified outputs across MCLS-PULSE, MCLS-RECON, and MCLS-CONCORD:
  1. Snapshot diffing with explicit 3-state outcomes (changed / unchanged / check_failed).
  2. Targeted passage extraction instead of full-page dumps or blind truncation.
  3. Fact-level freshness checks that preserve original checked_at timestamps.
  4. Single-owner, max-2-attempt run-log.csv checkpointing.
  5. Evidence-backed PASS / FAIL / UNKNOWN "done" gate + <=400-word HANDOFF.md writer.
"""

from __future__ import annotations

import csv
import hashlib
import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence


RUN_LOG_FIELDS = [
    "task_id",
    "owner",
    "status",
    "source_outcome",
    "retries",
    "correction_passes",
    "evidence_path",
    "error",
    "updated_at",
]

MAX_TOTAL_ATTEMPTS = 2  # 1 initial attempt + 1 targeted retry (max 1 retry)
MAX_HANDOFF_WORDS = 400


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _utc_iso(dt: Optional[datetime] = None) -> str:
    return (dt or _utc_now()).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def normalize_for_diff(raw_text: str) -> str:
    """Strip cosmetic HTML/whitespace churn so harmless page updates stay 'unchanged'."""
    text = raw_text or ""
    text = re.sub(r"<script[\s\S]*?</script>", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"<nav[\s\S]*?</nav>", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"<footer[\s\S]*?</footer>", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"<!--[\s\S]*?-->", " ", text)
    text = re.sub(r"\bnonce=[\"'][^\"']+[\"']", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def compute_content_hash(raw_text: str) -> str:
    """Return a SHA-256 digest over normalized content."""
    normalized = normalize_for_diff(raw_text)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def extract_needed_sections(
    text: str,
    keywords: Sequence[str],
    context_lines: int = 1,
    max_chars: int = 4000,
) -> Dict[str, Any]:
    """
    Pull only lines/paragraphs matching required keywords (preserving URLs, units,
    and billing terms) rather than blindly truncating from the top of a document.
    """
    clean = normalize_for_diff(text) if "<" in (text or "") and ">" in (text or "") else (text or "")
    lines = [ln.strip() for ln in re.split(r"(?:\r?\n)+|(?<=[.!?])\s+(?=[A-Z0-9$])", clean) if ln.strip()]
    if not keywords:
        joined = "\n".join(lines)[:max_chars]
        return {"matched_count": len(lines), "truncated": len("\n".join(lines)) > max_chars, "excerpt": joined}

    kw_lower = [k.lower() for k in keywords if k.strip()]
    picked_indices = set()
    for idx, line in enumerate(lines):
        low = line.lower()
        if any(k in low for k in kw_lower):
            for j in range(max(0, idx - context_lines), min(len(lines), idx + context_lines + 1)):
                picked_indices.add(j)

    selected = [lines[i] for i in sorted(picked_indices)]
    full_excerpt = "\n".join(selected)
    truncated = len(full_excerpt) > max_chars
    return {
        "matched_count": len(selected),
        "truncated": truncated,
        "excerpt": full_excerpt[:max_chars],
    }


def is_snapshot_fresh(snapshot: Optional[Dict[str, Any]], refresh_hours: float = 24.0, now: Optional[datetime] = None) -> bool:
    """Return True if snapshot exists, succeeded, and is within refresh_hours."""
    if not snapshot or snapshot.get("source_outcome") == "check_failed":
        return False
    checked_at_raw = snapshot.get("checked_at")
    if not checked_at_raw:
        return False
    try:
        checked_at = datetime.fromisoformat(str(checked_at_raw).replace("Z", "+00:00"))
    except ValueError:
        return False
    ref_now = now or _utc_now()
    return (ref_now - checked_at) <= timedelta(hours=refresh_hours)


def check_snapshot_change(
    target_id: str,
    sources_dir: Path,
    fetched_text: Optional[str],
    source_url: str,
    fetch_error: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Compare newly fetched content against the last successful snapshot.
    Distinguishes 'unchanged', 'changed', and 'check_failed'.
    A failed fetch NEVER updates latest.json or counts as 'unchanged'.
    """
    target_dir = Path(sources_dir) / target_id
    target_dir.mkdir(parents=True, exist_ok=True)
    latest_path = target_dir / "latest.json"

    prior: Optional[Dict[str, Any]] = None
    if latest_path.exists():
        try:
            prior = json.loads(latest_path.read_text(encoding="utf-8"))
        except Exception:
            prior = None

    if fetch_error or fetched_text is None:
        return {
            "target_id": target_id,
            "source_url": source_url,
            "source_outcome": "check_failed",
            "changed": False,
            "checked_at": prior.get("checked_at") if prior else None,
            "error": fetch_error or "Empty response",
            "snapshot_path": str(latest_path) if prior else None,
        }

    new_hash = compute_content_hash(fetched_text)
    now_iso = _utc_iso()

    if prior and prior.get("content_hash") == new_hash:
        # Preserve original checked_at of the verified snapshot and return unchanged
        return {
            "target_id": target_id,
            "source_url": source_url,
            "source_outcome": "unchanged",
            "changed": False,
            "content_hash": new_hash,
            "checked_at": prior.get("checked_at", now_iso),
            "last_polled_at": now_iso,
            "snapshot_path": str(latest_path),
        }

    snapshot_record = {
        "target_id": target_id,
        "source_url": source_url,
        "source_outcome": "changed",
        "content_hash": new_hash,
        "checked_at": now_iso,
        "raw_length": len(fetched_text),
        "normalized_excerpt": normalize_for_diff(fetched_text)[:4000],
    }
    latest_path.write_text(json.dumps(snapshot_record, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    return {
        "target_id": target_id,
        "source_url": source_url,
        "source_outcome": "changed",
        "changed": True,
        "content_hash": new_hash,
        "checked_at": now_iso,
        "snapshot_path": str(latest_path),
    }


class RunLedger:
    """Single-owner, max-2-attempt checkpoint ledger backed by run-log.csv."""

    def __init__(self, csv_path: Path):
        self.csv_path = Path(csv_path)
        self.csv_path.parent.mkdir(parents=True, exist_ok=True)

    def read_rows(self) -> Dict[str, Dict[str, str]]:
        if not self.csv_path.exists():
            return {}
        rows: Dict[str, Dict[str, str]] = {}
        with self.csv_path.open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                tid = (row.get("task_id") or "").strip()
                if tid:
                    rows[tid] = row
        return rows

    def should_run(self, task_id: str) -> Dict[str, Any]:
        """Skip accepted tasks and block tasks that already exhausted MAX_TOTAL_ATTEMPTS."""
        rows = self.read_rows()
        row = rows.get(task_id)
        if not row:
            return {"run": True, "reason": "new_task", "attempts_used": 0}
        status = (row.get("status") or "").strip().lower()
        retries = int(row.get("retries") or 0)
        attempts_used = 1 + retries
        if status == "accepted":
            return {"run": False, "reason": "already_accepted", "attempts_used": attempts_used}
        if attempts_used >= MAX_TOTAL_ATTEMPTS:
            return {"run": False, "reason": "max_attempts_reached", "attempts_used": attempts_used}
        return {"run": True, "reason": f"resume_{status or 'pending'}", "attempts_used": attempts_used}

    def record(
        self,
        task_id: str,
        owner: str,
        status: str,
        source_outcome: str,
        evidence_path: str = "",
        error: str = "",
        correction_passes: int = 0,
        is_retry: bool = False,
    ) -> Dict[str, str]:
        rows = self.read_rows()
        existing = rows.get(task_id)
        prev_retries = int(existing.get("retries") or 0) if existing else 0
        retries = prev_retries + (1 if is_retry else 0)

        # Enforce hard stopping rule after 2 total attempts (1 initial + 1 retry)
        final_status = status
        if status in {"failed", "check_failed"} and (1 + retries) >= MAX_TOTAL_ATTEMPTS:
            final_status = "blocked"

        record = {
            "task_id": task_id,
            "owner": owner,
            "status": final_status,
            "source_outcome": source_outcome,
            "retries": str(retries),
            "correction_passes": str(correction_passes),
            "evidence_path": evidence_path,
            "error": error[:240],
            "updated_at": _utc_iso(),
        }
        rows[task_id] = record

        with self.csv_path.open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=RUN_LOG_FIELDS)
            writer.writeheader()
            for tid in sorted(rows.keys()):
                writer.writerow({k: rows[tid].get(k, "") for k in RUN_LOG_FIELDS})
        return record


def verify_evidence_checklist(
    content_text: str,
    source_urls: Optional[Sequence[str]] = None,
    evidence_paths: Optional[Sequence[str]] = None,
    checked_at: Optional[str] = None,
    canon_checker=None,
) -> Dict[str, Any]:
    """
    Evaluate a finished brief against explicit PASS / FAIL / UNKNOWN checks.
    Returns verdict='ACCEPTED' only when all required checks are PASS.
    """
    checks: Dict[str, Dict[str, Any]] = {}

    # 1. Real source URLs present (reject empty or .example placeholders)
    urls = [u.strip() for u in (source_urls or []) if u and u.strip()]
    if not urls:
        urls = re.findall(r"https?://[^\s\)\]>\"']+", content_text or "")
    has_placeholder = any(".example" in u.lower() for u in urls)
    if not urls:
        checks["source_urls"] = {"state": "FAIL", "detail": "No source URLs found."}
    elif has_placeholder:
        checks["source_urls"] = {"state": "FAIL", "detail": "Placeholder .example URL detected."}
    else:
        checks["source_urls"] = {"state": "PASS", "detail": f"{len(urls)} live URL(s) linked."}

    # 2. Checked timestamp recorded
    if checked_at and str(checked_at).strip():
        checks["checked_at"] = {"state": "PASS", "detail": str(checked_at).strip()}
    else:
        checks["checked_at"] = {"state": "UNKNOWN", "detail": "checked_at timestamp not provided."}

    # 3. Evidence paths exist on disk (if provided)
    ev_paths = [p.strip() for p in (evidence_paths or []) if p and p.strip()]
    if not ev_paths:
        checks["evidence_files"] = {"state": "UNKNOWN", "detail": "No local evidence_paths supplied."}
    else:
        missing = [p for p in ev_paths if not Path(p).exists()]
        if missing:
            checks["evidence_files"] = {"state": "FAIL", "detail": f"Missing evidence file(s): {', '.join(missing)}"}
        else:
            checks["evidence_files"] = {"state": "PASS", "detail": f"{len(ev_paths)} evidence file(s) verified on disk."}

    # 4. SOE Canon & Marketing Compliance
    if canon_checker is not None:
        canon_res = canon_checker(content_text or "")
    else:
        # Lightweight inline fallback matching Helix Gate 1 core invariants
        violations: List[str] = []
        if re.search(r"\bAges?\s*2\s*[-–—]\s*8\b", content_text or "", re.IGNORECASE):
            violations.append("Age creep: use Ages 2–7.")
        if re.search(r"\b4,?232\b", content_text or ""):
            violations.append("Use '4,000+ words' instead of literal 4,232.")
        if re.search(r"\b(Marcus|Elena|Reef|Zara|Dara|Sophia|Geometria|Shopify)\b", content_text or "", re.IGNORECASE):
            violations.append("Retired entity or Shopify reference detected.")
        if re.search(r"\bno\s+credit\s+card\s+required\b", content_text or "", re.IGNORECASE):
            violations.append("Never claim 'no credit card required'.")
        canon_res = {"passed": len(violations) == 0, "violations": violations}

    if canon_res.get("passed"):
        checks["canon_compliance"] = {"state": "PASS", "detail": "0 SOE canon violations."}
    else:
        checks["canon_compliance"] = {
            "state": "FAIL",
            "detail": "; ".join(canon_res.get("violations", [])),
        }

    states = [c["state"] for c in checks.values()]
    if "FAIL" in states:
        verdict = "NEEDS_REVIEW"
    elif "UNKNOWN" in states:
        verdict = "NEEDS_REVIEW"
    else:
        verdict = "ACCEPTED"

    return {
        "verdict": verdict,
        "accepted": verdict == "ACCEPTED",
        "checks": checks,
    }


def write_handoff(
    handoff_path: Path,
    goal: str,
    owner: str,
    completed: Sequence[str],
    unresolved: Sequence[str],
    next_action: str,
    evidence_paths: Sequence[str],
) -> Dict[str, Any]:
    """Write a compact <=400-word HANDOFF.md referencing evidence paths instead of copying dumps."""
    lines = [
        "# MCLS Operations Handoff",
        f"Updated: {_utc_iso()}",
        f"Owner: {owner}",
        f"Goal: {goal}",
        "",
        "## Complete",
        *[f"- {item}" for item in (completed or ["None yet."])],
        "",
        "## Unresolved / Blocked",
        *[f"- {item}" for item in (unresolved or ["None."])],
        "",
        "## Next Action",
        next_action.strip(),
        "",
        "## Evidence Paths",
        *[f"- `{p}`" for p in (evidence_paths or [])],
    ]
    body = "\n".join(lines).strip() + "\n"
    words = body.split()
    if len(words) > MAX_HANDOFF_WORDS:
        raise ValueError(f"HANDOFF.md exceeds {MAX_HANDOFF_WORDS} words ({len(words)} words). Keep links only.")

    out = Path(handoff_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(body, encoding="utf-8")
    return {"path": str(out), "word_count": len(words)}

