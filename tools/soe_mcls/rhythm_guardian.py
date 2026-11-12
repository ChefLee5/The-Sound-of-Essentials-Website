from typing import List, Dict, Any

class RhythmGuardianOptimizer:
    """
    MCLS Pillar 5: 2026 Battle-Tested Dual-Horizon Guardrails:
    - Protects Top-of-Funnel Value Gate (Engine A) from premature kills due to Meta 7-day attribution blindness.
    - Demands strict short-term ROAS for Direct-to-Print Showcase (Engine B).
    """

    def __init__(
        self,
        max_lead_cpa_dollars: float = 2.50,
        min_ctr_percent: float = 0.80,
        min_spend_for_decision_dollars: float = 10.0,
        scale_step_ratio: float = 1.20,
    ):
        self.max_lead_cpa = max_lead_cpa_dollars
        self.min_ctr = min_ctr_percent
        self.min_spend = min_spend_for_decision_dollars
        self.scale_step = scale_step_ratio

    def evaluate_ads(self, ad_metrics: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        decisions: Dict[str, Dict[str, Any]] = {}

        for row in ad_metrics:
            ad_id = row["ad_id"]
            engine_type = row.get("engine_type", "ENGINE_A_VALUE_GATE")
            spend = float(row.get("spend", 0.0))
            leads = int(row.get("leads", 0))
            purchases = int(row.get("purchases", 0))
            ctr = float(row.get("ctr", 0.0))
            current_budget = int(row.get("current_budget_cents", 3000))

            if spend < self.min_spend:
                decisions[ad_id] = {
                    "action": "HOLD",
                    "reason": f"Spend (${spend:.2f}) below learning threshold (${self.min_spend:.2f}).",
                }
                continue

            # Engine A: Top-of-Funnel Value Gate (/listen Free Album)
            if engine_type == "ENGINE_A_VALUE_GATE":
                lead_cpa = (spend / leads) if leads > 0 else 999.0
                if leads == 0 and spend >= (self.min_spend * 1.5):
                    decisions[ad_id] = {
                        "action": "PAUSE",
                        "reason": f"Engine A Stop-Loss: Spend=${spend:.2f} with 0 leads (CTR={ctr:.2f}%).",
                    }
                elif lead_cpa > self.max_lead_cpa and ctr < self.min_ctr:
                    decisions[ad_id] = {
                        "action": "PAUSE",
                        "reason": f"Engine A Fatigue: Lead CPA=${lead_cpa:.2f} (target <= ${self.max_lead_cpa:.2f}), CTR={ctr:.2f}%.",
                    }
                elif leads >= 5 and lead_cpa <= self.max_lead_cpa:
                    new_budget = int(round(current_budget * self.scale_step))
                    decisions[ad_id] = {
                        "action": "SCALE_BUDGET",
                        "new_budget_cents": new_budget,
                        "reason": f"Engine A Winner: Lead CPA=${lead_cpa:.2f} <= ${self.max_lead_cpa:.2f}. Scaling +20%.",
                    }
                else:
                    decisions[ad_id] = {
                        "action": "HOLD",
                        "reason": f"Engine A Active within healthy bounds (CPA=${lead_cpa:.2f}). Preserving 90-day gestation window.",
                    }

            # Engine B: Direct-to-Print Tactile Showcase (/shop)
            else:
                purchase_cpa = (spend / purchases) if purchases > 0 else 999.0
                if purchases == 0 and spend >= 35.0: # Spent book cost with no sale
                    decisions[ad_id] = {
                        "action": "PAUSE",
                        "reason": f"Engine B Stop-Loss: Spent ${spend:.2f} with 0 sales.",
                    }
                elif purchases >= 2 and purchase_cpa <= 25.0:
                    new_budget = int(round(current_budget * self.scale_step))
                    decisions[ad_id] = {
                        "action": "SCALE_BUDGET",
                        "new_budget_cents": new_budget,
                        "reason": f"Engine B Winner: Purchase CPA=${purchase_cpa:.2f}. Scaling +20%.",
                    }
                else:
                    decisions[ad_id] = {
                        "action": "HOLD",
                        "reason": f"Engine B Learning/Testing.",
                    }

        return decisions

    def review_proposal_adversarial(self, proposal: Dict[str, Any]) -> Dict[str, Any]:
        """
        MCLS Pillar 5: Ras Mic 'Review This' Adversarial Gate & Anti-Shiny-Object Advisor.
        Audits any proposed campaign, feature, or creative brief against SOE Canon,
        Anti-Slop Visual Grounding, and Unit Economic / Funnel Focus invariants BEFORE execution.
        """
        import re

        title = str(proposal.get("title", ""))
        description = str(proposal.get("description", ""))
        target_route = str(proposal.get("target_route", ""))
        visual_ref = str(proposal.get("visual_reference", ""))
        unit_key = str(proposal.get("unit_key", "MCLS-STUDIO"))
        combined_text = f"{title} {description} {target_route} {visual_ref}".strip()

        canon_violations: List[str] = []
        slop_warnings: List[str] = []
        shiny_object_flags: List[str] = []

        # Gate 1: SOE Canon Contract
        canon_checks = [
            (r"\bAges?\s*2\s*[-–—]\s*8\b", "Age creep detected: strictly use Ages 2–7 (Pre-K to Grade 2)."),
            (r"\bGrade\s*3\b", "Grade ceiling violation: strictly Pre-K to Grade 2."),
            (r"\b(Marcus|Elena|Reef|Zara|Dara|Sophia|Geometria)\b", "Retired character or land name detected."),
            (r"\bno\s+credit\s+card\s+required\b", "Billing rule violation: never claim 'no credit card required' (card vaulting active)."),
            (r"\bShopify\b", "Stack incompatibility: Shopify is retired; use direct soelearn.com Stripe funnel."),
        ]
        for pattern, msg in canon_checks:
            if re.search(pattern, combined_text, flags=re.IGNORECASE):
                canon_violations.append(msg)

        # Gate 2: Anti-Slop & Canonical Design Lock
        if unit_key == "MCLS-STUDIO" or proposal.get("requires_visual", False):
            if not visual_ref.strip():
                slop_warnings.append("Missing canonical visual reference from 'Reference images/' or 'Canonical Master Visuals/'.")
            if re.search(r"\b(stock\s+photo|generic\s+illustration|purple\s+gradient|claymorphism)\b", combined_text, flags=re.IGNORECASE):
                slop_warnings.append("Design canon breach: generic stock/purple-gradient/claymorphism slop detected.")

        # Gate 3: Anti-Shiny-Object & Funnel Focus Advisor
        valid_funnel_anchors = [
            "/listen", "/workbook", "/rhythm-ready", "/dictionary-sale",
            "/bundle", "/institutions", "/cloud-academy", "/tactile", "/qpc",
            "school_pilot", "llms.txt", "brevo", "slant3d", "build123d",
        ]
        if target_route and not any(anchor in target_route.lower() for anchor in valid_funnel_anchors):
            shiny_object_flags.append(
                f"Off-funnel destination '{target_route}': proposals must route to /listen, /workbook, /dictionary-sale, /institutions, /cloud-academy, or llms.txt."
            )

        distraction_patterns = [
            (r"\b(crypto|synthetic\s+stock|real\s+estate|trucking|dropship)\b", "Shiny Object Drift: unrelated venture keyword detected."),
            (r"\b(linktree|multi-link)\b", "Conversion dilution: single-destination funnel routing required (Lesson #24)."),
        ]
        for pattern, msg in distraction_patterns:
            if re.search(pattern, combined_text, flags=re.IGNORECASE):
                shiny_object_flags.append(msg)

        if canon_violations:
            verdict = "BLOCKED_CANON"
        elif shiny_object_flags or slop_warnings:
            verdict = "SHINY_OBJECT_HOLD" if shiny_object_flags else "CAUTION_SLOP_RISK"
        else:
            verdict = "APPROVED"

        return {
            "verdict": verdict,
            "approved": verdict == "APPROVED",
            "canon_violations": canon_violations,
            "slop_warnings": slop_warnings,
            "shiny_object_flags": shiny_object_flags,
            "guardrails": {
                "max_lead_cpa_dollars": self.max_lead_cpa,
                "min_ctr_percent": self.min_ctr,
                "canonical_age_range": "Ages 2–7",
            },
        }
