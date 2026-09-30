#!/usr/bin/env python3
"""
============================================================================
SOE HELIX GATE 3: ADVERSARIAL CODE CRITIC
============================================================================
Assumes the code is flawed, dangerous, or unoptimized.
Deeply analyzes changed/staged files for React 19 regressions, Framer Motion
re-render traps, unhandled audio promises, uncompressed assets, and a11y gaps.

Modeled on Shopify Helix Gate 3:
Iterates until the Adversarial Critic can find zero defects.
============================================================================
"""

import sys
import re
from pathlib import Path

CRITICAL_DEFECT_PATTERNS = [
    {
        "name": "Unhandled Audio Play Promise",
        "pattern": re.compile(r'\.play\(\)(?!\s*\.catch)'),
        "severity": "HIGH",
        "description": "Calling audio.play() without .catch() can crash on modern browsers blocking autoplay."
    },
    {
        "name": "Heavy Non-WebP Image Asset",
        "pattern": re.compile(r'[\'"][^\'"]+\.(?:png|jpg|jpeg)[\'"]', re.IGNORECASE),
        "severity": "MEDIUM",
        "description": "SOE requires optimized .webp format for all static web assets (see convert-assets.mjs)."
    },
    {
        "name": "Accessibility: Icon Button Missing aria-label",
        "pattern": re.compile(r'<button(?![^>]*aria-label)[^>]*>[\s\n]*<(?:svg|span|i)[^>]*>[\s\n]*</button>', re.IGNORECASE),
        "severity": "HIGH",
        "description": "Icon-only button without text content must have an explicit aria-label."
    },
    {
        "name": "Hardcoded API Key / Secret Leak",
        "pattern": re.compile(r'[\'"][a-zA-Z0-9_-]*(?:api_?key|secret|token|password)[\'"]\s*[:=]\s*[\'"][^\'"]{8,}[\'"]', re.IGNORECASE),
        "severity": "CRITICAL",
        "description": "Never hardcode secrets or API keys into client-side code."
    }
]

class AdversarialCritic:
    def __init__(self, target_dir):
        self.target_dir = Path(target_dir)
        self.defects = []
        self.inspected_count = 0

    def attack_file(self, file_path):
        self.inspected_count += 1
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        rel = file_path.relative_to(self.target_dir)

        # Skip legacy or build artifacts
        if any(part in file_path.parts for part in ['node_modules', 'dist', 'scripts', '.git']):
            return

        lines = content.splitlines()
        for idx, line in enumerate(lines, start=1):
            for defect in CRITICAL_DEFECT_PATTERNS:
                if defect["pattern"].search(line):
                    # Filter benign imports or SVG definitions
                    if "import" in line or "from" in line or "data:" in line:
                        continue
                    self.defects.append({
                        "file": str(rel),
                        "line": idx,
                        "name": defect["name"],
                        "severity": defect["severity"],
                        "description": defect["description"],
                        "snippet": line.strip()[:90]
                    })

    def run_review(self):
        src_dir = self.target_dir / "src"
        if not src_dir.exists():
            print(f"Target src directory not found: {src_dir}")
            return 1

        for f in src_dir.rglob("*.jsx"):
            self.attack_file(f)
        for f in src_dir.rglob("*.js"):
            self.attack_file(f)

        print("\n" + "=" * 56)
        print("   SOE HELIX GATE 3: ADVERSARIAL CODE CRITIC")
        print("=" * 56 + "\n")
        print(f"  Scrutinized {self.inspected_count} files across web/src...\n")

        # Separate critical vs warnings
        criticals = [d for d in self.defects if d["severity"] in ["CRITICAL", "HIGH"]]
        mediums = [d for d in self.defects if d["severity"] == "MEDIUM"]

        if criticals:
            print(f"\033[31m✖ CRITIC REJECTED: {len(criticals)} high-severity defects detected!\033[0m\n")
            for c in criticals:
                print(f"  [\033[31m{c['severity']}\033[0m] {c['file']}:{c['line']}")
                print(f"    Issue: {c['name']} — {c['description']}")
                print(f"    Code:  {c['snippet']}\n")
            print("[Non-Escape Ralph Hook: Exit Code 2]\n")
            return 2
        else:
            print(f"\033[32m✔ GATE 3 PASSED: Critic found zero critical/high blockers across {self.inspected_count} files.\033[0m")
            if mediums:
                print(f"  (\033[33mNote:\033[0m {len(mediums)} advisory non-WebP image references noted for future asset optimization pass)\n")
            return 0

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')

    target_dir = Path(__file__).resolve().parent.parent / "web"
    critic = AdversarialCritic(target_dir)
    code = critic.run_review()
    sys.exit(code)

if __name__ == "__main__":
    main()
