"""
Multi-Format Standards & Procurement Renderers for The Sound of Essentials.
Exports:
- 50_STATES_PROCUREMENT_INDEX.md
- STANDARDS_CROSSWALK_MASTER.md
- STANDARDS_CROSSWALK_MASTER.json
- Standalone Printable HTML Procurement Exhibits (configurable for any of the 50 states)
"""

import json
import os
from typing import Optional, List, Dict
from pathlib import Path

from tools.standards.engine import StandardsEngine
from tools.standards.state_registry import STATES_REGISTRY, get_state, get_states_by_tier, get_all_states
from tools.standards.taxonomy import ELOF_TAXONOMY, NAEYC_TAXONOMY

class StandardsRenderer:
    def __init__(self, engine: Optional[StandardsEngine] = None):
        self.engine = engine or StandardsEngine()
        self.crosswalk = self.engine.generate_master_crosswalk()

    def export_50_state_index(self, output_path: str):
        """Generates comprehensive 50-State Procurement Dossier in Markdown."""
        tier_1 = get_states_by_tier(1)
        tier_2 = [s for s in get_states_by_tier(2) if s.code != "DC"]
        tier_3 = get_states_by_tier(3)
        dc_state = get_state("DC")

        lines = [
            "# The Sound of Essentials: 50-State Early Childhood Procurement Index",
            "",
            "> **Canonical Horizon:** Stage 3 Enterprise B2B — State Department of Education Procurement Roadmap  ",
            "> **Universal Accreditations:** Head Start Early Learning Outcomes Framework (ELOF) & NAEYC DAP Standards  ",
            "> **Target Cohort:** Ages 2–7 (Infant/Toddler, Pre-K, TK, Kindergarten, Grade 1)",
            "",
            "---",
            "",
            "## 📊 Executive Procurement Summary",
            "",
            "| Procurement Tier | State Count | Primary Decision Gate | SOE Qualification Pathway |",
            "| :--- | :--- | :--- | :--- |",
            f"| **Tier 1: State-Approved Curriculum States** | **{len(tier_1)} States** | State DOE Board / Centralized Approved List | Direct inclusion on State Approved Instructional Materials & HQIM lists |",
            f"| **Tier 2: Open-Territory / Local Control** | **{len(tier_2)} States (+ DC)** | Local School Districts (LEAs) & UPK Consortia | Direct superintendent / early childhood coordinator curriculum adoptions |",
            f"| **Tier 3: Federal Head Start / Title I Primary** | **{len(tier_3)} States** | Regional Head Start Grantees & Title I Set-Asides | Turnkey ELOF compliance packets and tribal/community grant bids |",
            "",
            "> **Universal Market Reality:** Because every SOE asset is anchored in the federal **Head Start ELOF** and **NAEYC** indicators, **The Sound of Essentials qualifies for 100% of US early childhood public funding streams across all 50 states.**",
            "",
            "---",
            "",
            f"## 🏛️ Tier 1: {len(tier_1)} State-Approved Curriculum States (Centralized DOE Approval)",
            "",
            "These states require formal state-level submission, proclamation reviews, or inclusion on state department early childhood approved lists to access dedicated state Pre-K line items.",
            "",
            "| State | Code | State Pre-K Program Name | State Standards Framework | Key Priority Focus |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ]

        for s in sorted(tier_1, key=lambda x: x.name):
            priorities = ", ".join(s.key_priorities[:2])
            lines.append(f"| **{s.name}** | `{s.code}` | {s.prek_program_name} | {s.standards_framework} | {priorities} |")

        lines.extend([
            "",
            "---",
            "",
            f"## 🏫 Tier 2: {len(tier_2)} Open-Territory / Local District States (+ DC)",
            "",
            "In these states, there is **no state-level curriculum veto**. Individual school districts (LEAs), Universal Pre-K consortia, and educational service agencies make 100% of curriculum adoption decisions locally based on state guidelines.",
            "",
            "| State | Code | State Pre-K Program Name | State Standards Framework | Key Priority Focus |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ])

        tier_2_with_dc = sorted(tier_2 + ([dc_state] if dc_state else []), key=lambda x: x.name)
        for s in tier_2_with_dc:
            priorities = ", ".join(s.key_priorities[:2])
            lines.append(f"| **{s.name}** | `{s.code}` | {s.prek_program_name} | {s.standards_framework} | {priorities} |")

        lines.extend([
            "",
            "---",
            "",
            f"## 🌲 Tier 3: {len(tier_3)} Federal Head Start & Title I States",
            "",
            "In these states with emerging or targeted state pre-k, procurement is driven directly by federal Head Start grantees (ELOF mandate), Title I Part A early childhood set-asides, and regional childcare/tribal councils.",
            "",
            "| State | Code | Program / Grantee Structure | Standards Framework | Key Priority Focus |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ])

        for s in sorted(tier_3, key=lambda x: x.name):
            priorities = ", ".join(s.key_priorities[:2])
            lines.append(f"| **{s.name}** | `{s.code}` | {s.prek_program_name} | {s.standards_framework} | {priorities} |")

        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    def export_markdown(self, output_path: str):
        """Exports the complete 19-track Master Standards Crosswalk Matrix in Markdown."""
        lines = [
            "# The Sound of Essentials: Master Standards Crosswalk Matrix (19 Tracks)",
            "",
            "> **Canonical Pedagogical Baseline:** 19 Tracks across 7 Lands & 5 Core Domains  ",
            "> **Accreditation Mappings:** Head Start ELOF, NAEYC, and State Early Learning Standards",
            "",
            "---",
            "",
            "## 📋 Master 19-Track Crosswalk Table",
            "",
            "| # | Track Title | Land | BPM | ELOF Codes | NAEYC | Neurological Mechanism |",
            "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |"
        ]

        for t in self.crosswalk:
            elof = ", ".join(t.elof_codes)
            naeyc = ", ".join(t.naeyc_codes)
            neuro = t.neurological_impact.mechanism.split(":")[0] if ":" in t.neurological_impact.mechanism else t.neurological_impact.mechanism[:60]
            lines.append(f"| {t.track_id} | **{t.title}** | {t.land} | {t.bpm} | `{elof}` | `{naeyc}` | {neuro} |")

        lines.extend([
            "",
            "---",
            "",
            "## 🧠 Neurological & Pedagogical Deep-Dive Exhibit",
            ""
        ])

        for t in self.crosswalk:
            lines.extend([
                f"### Track {t.track_id}: {t.title} ({t.land})",
                f"- **Tempo & Rhythm:** {t.bpm} BPM | **Primary Domain:** {t.primary_domain}",
                f"- **Head Start ELOF:** {', '.join(t.elof_codes)}",
                f"- **NAEYC Standards:** {', '.join(t.naeyc_codes)}",
                f"- **Neurological Mechanism:** {t.neurological_impact.mechanism}",
                f"- **Developmental Readiness:** {t.neurological_impact.developmental_readiness}",
                f"- **Classroom Application:** {t.neurological_impact.classroom_application}",
                f"- **10-Minute Tactile Lesson Ritual:** {t.tactile_extension_summary}",
                f"- **Target Skill Milestones:** {', '.join(t.target_skills)}",
                ""
            ])

        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))

    def export_json(self, output_path: str):
        """Exports complete machine-readable crosswalk database with 50 states."""
        all_states = [s.dict() for s in get_all_states()]
        tracks_data = [t.dict() for t in self.crosswalk]

        payload = {
            "program_name": "The Sound of Essentials: Rhythm Quest",
            "curriculum_version": "2026.1",
            "age_band": "Ages 2-7",
            "total_tracks": len(tracks_data),
            "total_states_cataloged": len(all_states),
            "tier_summary": {
                "tier_1_approved_list_states": len([s for s in all_states if s["tier"] == 1]),
                "tier_2_local_district_states": len([s for s in all_states if s["tier"] == 2]),
                "tier_3_head_start_title_1_states": len([s for s in all_states if s["tier"] == 3])
            },
            "states": all_states,
            "tracks": tracks_data
        }

        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)

    def export_html_exhibit(self, output_path: str, state_code: str = "TX"):
        """Renders a self-contained, publication-ready printable HTML procurement exhibit."""
        state = get_state(state_code) or get_state("TX")

        # HTML construction with responsive, print-ready CSS
        rows_html = []
        for t in self.crosswalk:
            state_indicators = t.state_codes.get(state.code, ["Aligned to State Core Domain"])
            indicators_str = "<br>".join([f"<span class='badge state-badge'>{ind}</span>" for ind in state_indicators])
            elof_badges = " ".join([f"<span class='badge elof-badge'>{c}</span>" for c in t.elof_codes])
            naeyc_badges = " ".join([f"<span class='badge naeyc-badge'>{c}</span>" for c in t.naeyc_codes])
            
            vagal_icon = "<span style='color:#059669; font-weight:bold;'>&#10003; Yes</span>" if t.neurological_impact.vagal_regulation else "—"
            bilateral_icon = "<span style='color:#059669; font-weight:bold;'>&#10003; Yes</span>" if t.neurological_impact.bilateral_integration else "—"

            rows_html.append(f"""
            <tr>
              <td class="text-center font-bold">{t.track_id}</td>
              <td>
                <div class="track-title">{t.title}</div>
                <div class="track-meta">Land of {t.land} • {t.bpm} BPM</div>
              </td>
              <td>{elof_badges}</td>
              <td>{naeyc_badges}</td>
              <td>{indicators_str}</td>
              <td>
                <div class="mechanism-text">{t.neurological_impact.mechanism}</div>
                <div class="ritual-box"><strong>Ritual:</strong> {t.tactile_extension_summary}</div>
              </td>
              <td class="text-center">{vagal_icon}</td>
              <td class="text-center">{bilateral_icon}</td>
            </tr>
            """)

        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SOE Curriculum Procurement Compliance Exhibit — State of {state.name}</title>
  <style>
    :root {{
      --primary: #1E293B;
      --accent: #FF6F00;
      --bg-cream: #FFFDF9;
      --card-bg: #FFFFFF;
      --border: #E2E8F0;
      --text-muted: #64748B;
      --elof-color: #2563EB;
      --naeyc-color: #059669;
      --state-color: #D97706;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg-cream);
      color: var(--primary);
      line-height: 1.5;
      padding: 30px;
    }}
    .container {{
      max-width: 1200px;
      margin: 0 auto;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      padding: 40px;
    }}
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid var(--accent);
      padding-bottom: 25px;
      margin-bottom: 30px;
    }}
    .brand-title {{
      font-size: 26px;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.5px;
    }}
    .brand-subtitle {{
      font-size: 14px;
      color: var(--accent);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }}
    .doc-meta {{
      text-align: right;
      font-size: 13px;
      color: var(--text-muted);
    }}
    .state-banner {{
      background: #FFF7ED;
      border: 1px solid #FFEDD5;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 30px;
      display: flex;
      gap: 20px;
    }}
    .state-banner-col {{ flex: 1; }}
    .state-banner-label {{ font-size: 11px; text-transform: uppercase; font-weight: 700; color: #9A3412; letter-spacing: 0.5px; }}
    .state-banner-val {{ font-size: 15px; font-weight: 600; color: #7C2D12; margin-top: 2px; }}

    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 30px;
    }}
    th {{
      background: #F8FAFC;
      color: var(--primary);
      text-align: left;
      padding: 12px 10px;
      border-bottom: 2px solid var(--border);
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    td {{
      padding: 12px 10px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }}
    tr:nth-child(even) {{ background: #FAFAFA; }}
    .text-center {{ text-align: center; }}
    .font-bold {{ font-weight: 700; }}
    .track-title {{ font-size: 14px; font-weight: 700; color: var(--primary); }}
    .track-meta {{ font-size: 11px; color: var(--text-muted); margin-top: 2px; }}
    .mechanism-text {{ font-size: 12px; line-height: 1.4; color: #334155; }}
    .ritual-box {{ font-size: 11px; margin-top: 6px; padding: 6px 8px; background: #F1F5F9; border-radius: 4px; color: #1E293B; }}

    .badge {{
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 3px;
    }}
    .elof-badge {{ background: #DBEAFE; color: var(--elof-color); }}
    .naeyc-badge {{ background: #D1FAE5; color: var(--naeyc-color); }}
    .state-badge {{ background: #FEF3C7; color: var(--state-color); }}

    .signoff-section {{
      margin-top: 40px;
      padding-top: 25px;
      border-top: 2px dashed var(--border);
      display: flex;
      justify-content: space-between;
    }}
    .signoff-box {{ width: 45%; }}
    .signoff-line {{ border-bottom: 1px solid var(--primary); height: 40px; margin-bottom: 6px; }}
    .signoff-label {{ font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }}

    @media print {{
      body {{ background: #FFF; padding: 0; }}
      .container {{ border: none; box-shadow: none; padding: 0; }}
      tr {{ page-break-inside: avoid; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand-title">The Sound of Essentials: Rhythm Quest</div>
        <div class="brand-subtitle">State Curriculum Procurement Compliance Exhibit</div>
      </div>
      <div class="doc-meta">
        <div><strong>Exhibit Document:</strong> SOE-DOE-EVAL-{state.code}-2026</div>
        <div><strong>Accreditation:</strong> ELOF / NAEYC / {state.framework_acronym}</div>
        <div><strong>Target Age:</strong> 2–7 Years (Infant, Toddler, Pre-K, TK, K)</div>
      </div>
    </div>

    <div class="state-banner">
      <div class="state-banner-col">
        <div class="state-banner-label">Target State Authority</div>
        <div class="state-banner-val">{state.doe_agency_name}</div>
      </div>
      <div class="state-banner-col">
        <div class="state-banner-label">Accreditation Framework</div>
        <div class="state-banner-val">{state.standards_framework}</div>
      </div>
      <div class="state-banner-col">
        <div class="state-banner-label">Target State Grant / Program</div>
        <div class="state-banner-val">{state.prek_program_name}</div>
      </div>
      <div class="state-banner-col">
        <div class="state-banner-label">Procurement Pathway</div>
        <div class="state-banner-val">Tier {state.tier} ({state.procurement_type[:28]}...)</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 4%;">#</th>
          <th style="width: 18%;">Track & Land</th>
          <th style="width: 12%;">Head Start ELOF</th>
          <th style="width: 8%;">NAEYC</th>
          <th style="width: 14%;">{state.code} State Benchmark</th>
          <th style="width: 34%;">Neurological Mechanism & 10-Min Ritual</th>
          <th style="width: 5%;">Vagal Calm</th>
          <th style="width: 5%;">Bilateral</th>
        </tr>
      </thead>
      <tbody>
        {"".join(rows_html)}
      </tbody>
    </table>

    <div class="signoff-section">
      <div class="signoff-box">
        <div class="signoff-line"></div>
        <div class="signoff-label">Prepared By: Curriculum & Neurodevelopment Review Board (SOE)</div>
      </div>
      <div class="signoff-box">
        <div class="signoff-line"></div>
        <div class="signoff-label">Verified For State Submission: Date & Official Seal</div>
      </div>
    </div>
  </div>
</body>
</html>
"""
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html_content)
