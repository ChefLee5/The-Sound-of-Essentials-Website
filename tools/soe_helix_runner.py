#!/usr/bin/env python3
"""
============================================================================
SOE HELIX: FULL 4-GATE PIPELINE RUNNER
============================================================================
Orchestrates the entire automated Shopify Helix validation pipeline:
  [Gate 1] Behavior & Canon Guard (World model, card vaulting, banned terms, i18n)
  [Gate 2] Spatial UI Auditor (Bright & Playful design tokens, pill radii, mobile)
  [Gate 3] Adversarial Code Critic (Anti-patterns, unhandled promises, a11y)
  [Gate 4] Human Acceptance Prompt & Learnings Logging

Modeled on Shopify's internal Helix system.
Exits with code 2 if any gate fails (Ralph Loop / Non-Escape Enforcer).
============================================================================
"""

import sys
import subprocess
from pathlib import Path

ECO_ROOT = Path(__file__).resolve().parent.parent
WEB_ROOT = ECO_ROOT / "web"
TOOLS_ROOT = ECO_ROOT / "tools"

def run_step(step_name, cmd, cwd):
    print(f"\n\033[1m\033[34m▶ Running {step_name}...\033[0m")
    res = subprocess.run(cmd, cwd=cwd, shell=True)
    if res.returncode != 0:
        print(f"\n\033[31m✖ {step_name} FAILED with exit code {res.returncode}.\033[0m")
        return False
    return True

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')

    print("\n" + "=" * 60)
    print("   THE SOUND OF ESSENTIALS — HELIX 4-GATE ORCHESTRATOR   ")
    print("=" * 60)

    # 1. Gate 1: Canon & Behavior Guard
    if not run_step("Gate 1: Canon & Behavior Guard", "node scripts/soe-canon-guard.mjs", WEB_ROOT):
        sys.exit(2)

    # 2. Gate 2: Spatial UI Auditor
    if not run_step("Gate 2: Spatial UI Auditor", f'python "{TOOLS_ROOT / "gemini_spatial_diff.py"}"', ECO_ROOT):
        sys.exit(2)

    # 3. Gate 3: Adversarial Code Critic
    if not run_step("Gate 3: Adversarial Code Critic", f'python "{TOOLS_ROOT / "adversarial_code_review.py"}"', ECO_ROOT):
        sys.exit(2)

    # 4. Code Linting Pass
    if not run_step("Code Linter (ESLint)", "npm run lint", WEB_ROOT):
        sys.exit(2)

    print("\n" + "=" * 60)
    print("\033[32m✔ ALL AUTOMATED GATES (1, 2, 3) PASSED GREEN!\033[0m")
    print("\033[36mProceed to Gate 4: Human-in-the-Loop review.\033[0m")
    print("=" * 60 + "\n")
    sys.exit(0)

if __name__ == "__main__":
    main()
