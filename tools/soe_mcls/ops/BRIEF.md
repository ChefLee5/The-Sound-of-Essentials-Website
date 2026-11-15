# SOE-MCLS Operations Brief

## Recurring Loops
1. **MCLS-PULSE (9:00 AM & 5:00 PM PT):**
   - Scan X (`socialfetch` / `apify`) + parenting/educator Reddit (`r/Parenting`, `r/ECEProfessionals`, `r/Teachers`) for live receipts on phonics vs. three-cueing, screen-time delays, and teacher burnout.
   - Output: 3-topic brief in `The Vault/Marketing/MCLS_Pulse_YYYY-MM-DD.md` with verbatim receipts, `Get X Without Y` Wave 3 Meta Ad hooks for `https://soelearn.com/listen`, canonical visual references (`The Sound of Essentials Image Assets/Canonical Master Visuals/`), and human-reviewed Sanctuary Dispatch outlines.
2. **MCLS-RECON Competitor Watch (Weekly):**
   - Approved URLs: `abcmouse.com`, `readingeggs.com`, `hookedonphonics.com` pricing/curriculum pages vs. `web/public/*-alternatives.html`.
   - Use `check_snapshot_change()` before running LLM analysis (`unchanged` = skip, `changed` = update comparison, `check_failed` = record `blocked` after 2 attempts).
3. **MCLS-STUDIO Video Iteration Pipeline (On Demand / Batch Reels):**
   - Pipeline stages: **(1)** SOE Studio Track + Voiceover -> **SRT** beat timestamps (`Layer 1 Ache -> Layer 2 Solution -> Layer 3 Invitation`), **(2)** Tactile Three.js Atlas seed (`PAPER_POPUP`, `SOFT_CLAY`, `TINY_DIORAMA`, `MARBLE_RUN`, `PAINTED_STORYBOOK`, `EXPLODED_BUNDLE`, `SPOTLIGHT_STAGE`, `LOW_POLY_PAPER`), **(3)** Direct code iteration (`beat_scene_changes`, `physics_and_camera_fixes`, `#FFF8F0`/`#FF6F00` palette lock) via `mcls_forge_video_iteration` or `dispatch.js` (`action: "build_video_iteration"`) + `web/src/remotion/TactileExplainer.jsx`, **(4)** Crystallize finalized styles into reusable skill presets.

## Non-Negotiable Constraints
- Strictly **Ages 2–7 (Pre-K to Grade 2)**, `"Crafted by a father's heart and a mother's love"`, **`4,000+ words`** (never `4,232`), zero retired names, zero Shopify, zero `"no credit card required"`.
- Every finished brief must pass `verify_evidence_checklist()` (`ACCEPTED`, 0 `FAIL`/`UNKNOWN`) before staging.

