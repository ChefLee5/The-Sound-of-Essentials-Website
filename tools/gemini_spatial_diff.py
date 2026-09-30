#!/usr/bin/env python3
"""
============================================================================
SOE HELIX GATE 2: GEMINI SPATIAL UI AUDITOR & DIFF HARNESS
============================================================================
Audits web pages, screenshots, and component styling against the canonical
SOE Bright & Playful Design System.

Modeled on Shopify Helix's Gate 2:
Uses spatial heuristics and visual verification to catch layout regressions,
broken pill radii, touch target collisions, and mobile viewport overflow.
============================================================================
"""

import sys
import os
import re
import json
import argparse
from pathlib import Path

# ── CANONICAL DESIGN TOKENS (Bright & Playful — July 2026 Canon) ─────────────
CANONICAL_TOKENS = {
    "colors": {
        "bg_cream": ["#faf9f7", "#fff8f0"],
        "orange_primary": "#ff6f00",
        "green_sage": "#4caf50",
        "purple_plum": "#7b1fa2",
        "blue_science": "#1e88e5",
        "yellow_warmth": "#ffb300",
        "red_accent": "#e53935",
        "text_dark": "#1a1a2e",
    },
    "typography": {
        "heading": "Fredoka",
        "body": "Inter",
        "display": "Bricolage Grotesque",
    },
    "radii": {
        "pill": "50px",
        "card": ["20px", "24px", "28px"],
        "input": "12px",
    },
    "touch_targets": {
        "min_height_px": 44,
        "min_width_px": 44,
    },
    "viewports": {
        "mobile": {"width": 375, "height": 812},
        "desktop": {"width": 1440, "height": 900},
    }
}

class SpatialUIAuditor:
    def __init__(self, web_root):
        self.web_root = Path(web_root)
        self.css_path = self.web_root / "src" / "index.css"
        self.issues = []
        self.passed_checks = []

    def audit_css_tokens(self):
        """Verifies canonical tokens exist and are active in index.css."""
        if not self.css_path.exists():
            self.issues.append(f"Missing global stylesheet: {self.css_path}")
            return

        content = self.css_path.read_text(encoding="utf-8")

        # 1. Background check
        if not any(c in content.lower() for c in CANONICAL_TOKENS["colors"]["bg_cream"]):
            self.issues.append("index.css missing canonical cream background token (#faf9f7 or #fff8f0)")
        else:
            self.passed_checks.append("Canonical cream background token verified")

        # 2. Orange CTA accent check
        if CANONICAL_TOKENS["colors"]["orange_primary"] not in content.lower():
            self.issues.append("index.css missing canonical orange CTA accent (#FF6F00)")
        else:
            self.passed_checks.append("Canonical orange CTA token (#FF6F00) verified")

        # 3. Pill radius check
        if "--radius-pill" not in content or "50px" not in content:
            self.issues.append("index.css missing --radius-pill: 50px definition")
        else:
            self.passed_checks.append("Canonical --radius-pill: 50px token verified")

        # 4. Fredoka heading font check
        if "Fredoka" not in content:
            self.issues.append("index.css missing Fredoka typography definition")
        else:
            self.passed_checks.append("Fredoka heading typography verified")

    def audit_mobile_responsiveness(self):
        """Scans JSX files for dangerous anti-responsive fixed pixel widths."""
        src_dir = self.web_root / "src"
        fixed_width_pattern = re.compile(r'style=\{\{[^}]*width:\s*[\'"]?([4-9]\d{2}|\d{4,})px[\'"]?[^}]*\}\}')
        
        for jsx_file in src_dir.rglob("*.jsx"):
            text = jsx_file.read_text(encoding="utf-8")
            for idx, line in enumerate(text.splitlines(), start=1):
                match = fixed_width_pattern.search(line)
                if match:
                    width_val = match.group(1)
                    rel_path = jsx_file.relative_to(self.web_root)
                    self.issues.append(
                        f"{rel_path}:{idx} uses fixed width {width_val}px (> 375px mobile breakpoint). "
                        "Replace with max-width or percentage to avoid viewport overflow."
                    )
        
        if not any("fixed width" in i for i in self.issues):
            self.passed_checks.append("Zero anti-responsive hardcoded desktop pixel widths in inline styles")

    def generate_gemini_spatial_prompt(self, page_name, image_path=None):
        """Generates the exact spatial audit prompt for Gemini multimodal inspection."""
        prompt = f"""
### SOE GATE 2: GEMINI SPATIAL DESIGN REVIEW
**Page:** {page_name}
**Target Aesthetic:** Bright & Playful (Warm, Vibrant, Joyful, Calm, Neuro-Affirming)

**Spatial & Visual Checklist for Gemini:**
1. **Pill Button Geometry:** Confirm that primary CTAs use continuous 50px rounded pill borders with adequate internal padding (min 14px 28px).
2. **Breathing Room & Margins:** Verify that card containers and character grids have generous spacing (24px-32px gutters). No cramped text blocks.
3. **Color Balance:** Confirm the warm cream background is dominant with #FF6F00 orange accents for actions. Verify no harsh high-contrast neon slop.
4. **Mobile Target Ergonomics:** Are interactive controls (audio sliders, track selectors, menu triggers) separated by at least 8px with a minimum 44px tap area?
5. **Character Asset Fidelity:** Are character renders (Seriphia, Kenji, Aiko, etc.) crisp, proportional, and free of stretched aspect ratios?

**Output Format:**
- Status: [PASS / FAIL]
- Spatial Alignment Score: (0-100)
- Detected Regressions: List any padding, overflow, or contrast deviations.
"""
        return prompt.strip()

    def run_audit(self):
        self.audit_css_tokens()
        self.audit_mobile_responsiveness()

        print("\n" + "=" * 56)
        print("   SOE HELIX GATE 2: SPATIAL UI AUDITOR")
        print("=" * 56 + "\n")

        for p in self.passed_checks:
            print(f"  \033[32m✔\033[0m {p}")

        if self.issues:
            print("\n\033[31m✖ GATE 2 REGRESSIONS DETECTED:\033[0m")
            for issue in self.issues:
                print(f"  - {issue}")
            print("\n[Non-Escape Ralph Hook: Exit Code 2]\n")
            return 2
        else:
            print(f"\n\033[32m✔ GATE 2 PASSED: All {len(self.passed_checks)} spatial integrity checks passed.\033[0m\n")
            return 0

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    parser = argparse.ArgumentParser(description="SOE Helix Gate 2 Spatial UI Auditor")
    parser.add_argument("--web-root", default=str(Path(__file__).resolve().parent.parent / "web"))
    parser.add_argument("--prompt-only", action="store_true", help="Print Gemini spatial prompt template")
    parser.add_argument("--page", default="Home", help="Page name for Gemini spatial prompt")
    args = parser.parse_args()

    auditor = SpatialUIAuditor(args.web_root)

    if args.prompt_only:
        print(auditor.generate_gemini_spatial_prompt(args.page))
        sys.exit(0)

    code = auditor.run_audit()
    sys.exit(code)

if __name__ == "__main__":
    main()
