# SOE Autonomous 50-State DOE Standards Alignment & Curriculum Crosswalk Engine

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an autonomous, 50-state standards alignment and crosswalk engine that maps all 19 SOE tracks, 7 Lands, 400 workbook activities, and Picture Dictionary assets to Head Start ELOF, NAEYC, and all 50 State Early Childhood Frameworks—with dedicated focus on the **28 State-Approved Curriculum Adoption States**, the **16 Open-Territory District Adoption States**, and **Head Start/Title I across all 50 states**.

**Architecture:** A modular Python engine with typed Pydantic data models for the SOE catalog, national standards (ELOF, NAEYC), and a comprehensive 50-state early learning standards taxonomy. The engine consumes canonical catalog data (`tracks.json`), maps developmental neurology and pedagogical objectives to specific standard codes, and renders multi-format deliverables (validated JSON, structured Markdown, and print-ready styled HTML/PDF exhibits for any state).

**Tech Stack:** Python 3.12+, Pydantic v2, Jinja2 (HTML templating), `uv` package management, Markdown/JSON exporters.

---

## 🏛️ The 50-State Institutional Landscape

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SOE 50-STATE PROCUREMENT QUALIFICATION MAP                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TIER 1: THE 28 STATE-APPROVED CURRICULUM STATES (Centralized DOE Approval)             │
│ • TX, CA, FL, GA, NC, MI, TN, AR, OH, PA, VA, MD, AL, SC, LA, OK, CO, NJ, IN, AZ,   │
│   MO, KY, NM, UT, NV, MS, WV, DE                                                       │
│ • Procurement Mechanism: Formal State DOE Approved Curriculum Lists, HQIM (High-Quality│
│   Instructional Materials) reviews, and statewide Pre-K grant adoptions.              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: THE 16 OPEN-TERRITORY / LOCAL DISTRICT STATES (Direct LEA Procurement)        │
│ • NY, IL, MA, WA, OR, WI, MN, CT, IA, KS, ME, NE, RI, VT, HI, AK (+ DC)               │
│ • Procurement Mechanism: No state-level veto. Local School Districts (LEAs), Universal │
│   Pre-K (UPK) consortia, and ESCs adopt curricula directly based on state alignment.   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: THE 6 FEDERAL HEAD START & TITLE I PRIMARY STATES                              │
│ • ID, WY, MT, ND, SD, NH                                                               │
│ • Procurement Mechanism: Federal Head Start ELOF compliance, Title I Part A early      │
│   childhood set-asides, and regional childcare/tribal consortia.                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ UNIVERSAL OVERLAY: ALL 50 STATES QUALIFY THROUGH HEAD START & NAEYC                    │
│ • Head Start (1,600+ regional grantees nationwide) mandates ELOF alignment.           │
│ • NAEYC (thousands of accredited private & community centers) mandates DAP standards.  │
│ • SOE qualifies for 100% of US early childhood funding streams.                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Task 1: 50-State Taxonomy & Standards Data Models

**Files:**
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/models.py`
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/state_registry.py`
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/taxonomy.py`
- Test: `The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_taxonomy.py`

**Step 1: Write the failing test**
Create test validating all 50 states are cataloged with their procurement tier (Tier 1 Approved List [28 states], Tier 2 Local District [16 states], Tier 3 Head Start/Title I [6 states]), along with Head Start ELOF and NAEYC taxonomy codes.

**Step 2: Run test to verify it fails**
Run: `uv run --with pytest pytest The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_taxonomy.py`
Expected: FAIL with `ModuleNotFoundError` or missing taxonomy codes.

**Step 3: Write minimal implementation**
Implement Pydantic schemas:
- `StateProfile(code, name, tier, procurement_type, standards_framework, doe_agency_name, approved_list_required)`
- `StandardCode(framework, domain, code, title, description, age_band)`
- `NeurologicalImpact(mechanism, developmental_readiness, classroom_application)`
- `TrackAlignment(track_id, slug, title, land, bpm, primary_domain, elof_codes, naeyc_codes, state_codes, neurological_impact, lesson_extension_summary)`
- Populate the complete 50-State Registry:
  - 28 Tier 1 States with their exact standards frameworks (e.g. TX TPG, CA PTKLF, FL FELDS, GA GELDS, NC NC-FVDLS, MI GSRP, etc.)
  - 16 Tier 2 Open-Territory States (e.g. NY NYS-ELG, IL IELDS, etc.)
  - 6 Tier 3 States (Federal ELOF focus)

**Step 4: Run test to verify it passes**
Run: `uv run --with pytest pytest The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_taxonomy.py`
Expected: PASS (50/50 states validated, 28/28 Tier 1 approved-list states cataloged).

---

### Task 2: Complete 19-Track Pedagogical & Neurological Crosswalk Engine

**Files:**
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/engine.py`
- Test: `The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_engine.py`

**Step 1: Write the failing test**
Test that `engine.generate_master_crosswalk()` loads all 19 tracks from `web/src/data/tracks.json`, maps 100% of tracks to at least 1 ELOF code, 1 NAEYC code, and relevant state standard benchmarks, and includes concrete neurological justifications (vagal calming, bilateral integration, phonemic awareness).

**Step 2: Run test to verify it fails**
Run: `uv run --with pytest pytest The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_engine.py`
Expected: FAIL.

**Step 3: Write minimal implementation**
Map all 19 tracks:
- Track 1 (Sunny Day): Terrasol / ELOF P-ATL.1 (Emotional Regulation) / NAEYC 2.D (Social-Emotional Vagal Calming).
- Track 2 (Days of the Week): Celestia / ELOF P-MATH.8 (Time, Temporal Patterns) / NAEYC 2.F (Math).
- Track 3 (Alphabet Song Remix): Harmonia / ELOF P-LIT.1, P-LIT.3 (Phonological & Alphabet) / NAEYC 2.B (Language).
- Track 4 (Horses Interlude): Terrasol / ELOF P-SCI.2 (Living Things, Animal Discrimination) / NAEYC 2.G (Science).
- Track 5 (Le Cheval): Luminosity / ELOF P-LC.4 (Multilingual Vocabulary & Cultural Literacy) / NAEYC 2.B (Language).
- Track 6 (Let's Stretch): Vitalis / ELOF P-PMP.1 (Gross Motor, Bilateral Midline Integration) / NAEYC 2.C (Physical).
- Track 7 (Drill Time): Vitalis / ELOF P-PMP.2 (Cardiovascular & Rhythmic Motor Coordination).
- Tracks 8–19 (Sound of Essentials, Animals, Living Food, Manners, Counting Claps, Month to Month, Know Yourself, Shapes, etc.): Complete canonical mappings across all 7 Lands.

**Step 4: Run test to verify it passes**
Run: `uv run --with pytest pytest The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_engine.py`
Expected: PASS with 19/19 tracks validated.

---

### Task 3: 50-State Multi-Format Exporters (Master Markdown, JSON Database, & Printable Exhibits)

**Files:**
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/renderers.py`
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/templates/procurement_exhibit.html`
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/templates/state_procurement_index.md`
- Test: `The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_renderers.py`

**Step 1: Write the failing test**
Verify that the renderers generate:
1. `50_STATES_PROCUREMENT_INDEX.md` (listing all 50 states and their qualification pathway).
2. `STANDARDS_CROSSWALK_MASTER.md` & `.json` (full 19-track matrix).
3. State-specific procurement exhibits (e.g. for any selected state like TX, CA, FL, GA, NC, or NY).

**Step 2: Run test to verify it fails**
Run: `uv run --with pytest pytest The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_renderers.py`
Expected: FAIL.

**Step 3: Write minimal implementation**
- `export_50_state_index(filepath)`: Comprehensive breakdown of all 50 states, detailing their Pre-K funding, adoption mechanism, and qualifying SOE programs.
- `export_json(filepath)`: Machine-readable data feed for state reporting.
- `export_markdown(filepath)`: Rich comparative tables with clean alignment keys.
- `export_html_exhibit(filepath, state_code)`: Professional, printable institutional procurement dossier with SOE branding (Fredoka/Inter typography, warm cream `#FFF8F0` and gold `#FF6F00` accents, formal state procurement disclaimers, and executive signature block).

**Step 4: Run test to verify it passes**
Run: `uv run --with pytest pytest The-Sound-of-Essentials-Eco-System/tools/standards/tests/test_renderers.py`
Expected: PASS.

---

### Task 4: CLI Integration into `soe-curriculum-cli`

**Files:**
- Create: `The-Sound-of-Essentials-Eco-System/tools/standards/cli.py`
- Modify: `C:\Users\ldmur\.gemini\config\skills\soe-curriculum-cli\SKILL.md`

Expose CLI commands:
- `standards states`: Displays table of all 50 states with their procurement tier and frameworks.
- `standards export --format [md|json|html|all] --state [all|<code>] --outdir <path>`: Generates all requested deliverables.
- `standards rfp-brief --track <slug>`: Prints instant 1-page justification for any individual track.

---

### Task 5: End-to-End Execution & Artifact Delivery

**Generated Deliverables:**
1. `50_STATES_PROCUREMENT_INDEX.md`: Master 50-State Procurement Dossier classifying all 50 states by tier, adoption cycle, and SOE qualification pathway.
2. `STANDARDS_CROSSWALK_MASTER.md`: Master 19-track crosswalk table with all standard codes and neurological proofs.
3. `STANDARDS_CROSSWALK_MASTER.json`: Strict JSON database of alignments.
4. `SOE_State_DOE_Procurement_Exhibit.html`: Standalone, publication-ready printable institutional procurement exhibit template configured for state bid submissions.
