# SOE Institutional Memory & Learnings Ledger

> **Purpose:** Permanent record of founder corrections, gate rejections, and architectural decisions. All AI agents working on The Sound of Essentials must review this file before planning checkpoints.

---

## [2026-09-24] Shopify Helix 4-Gate Workflow Deployed

### Gate 1 (Canon & Behavior) Fixes:
1. **Age Range Enforcement:** Locked strictly to **Ages 2–7 (Pre-K through Grade 2)** across all files. Grade 3 is strictly retired.
2. **7 Lands & 15 Heroes Canonical Pairing:**
   - **Harmonia:** Kenji & Aiko
   - **Numeria:** Kwame & Octavia
   - **Vitalis:** Felix & Amara
   - **Celestia:** Elias & Selene
   - **Luminosity:** Athena & Ezra
   - **Aquaria:** Nerissa & Ronan *(Geometria is permanently retired)*
   - **Terrasol:** Vesta & Silas
   - **Lead / Guardian:** Seriphia *(featured: true, The Celestial)*
3. **i18n Parity:** Added complete Spanish (`es.json`) translations for `join`, `assistant`, and `splash` namespaces, ensuring 100% parity with English and French.
4. **Shopify Card-Vaulting Invariant:** Verified that the front-end album is $0 stream, and the order bump/tripwire satisfies the $\ge \$0.50$ vaulting floor required for 1-click upsells.

### Gate 2 (Spatial UI & Design System) Fixes:
1. **Pill Radii:** Added `--radius-pill: 50px;` alias into `:root` in `web/src/index.css`.
2. **Design Tokens:** Backgrounds must use canonical cream (`#faf9f7` / `#fff8f0`) with `#FF6F00` primary orange CTAs.
3. **Mobile Viewport Safety:** No fixed inline pixel widths exceeding 375px; always use fluid scaling or `max-width`.

### Gate 3 (Adversarial Code Critic) Fixes:
1. **ESLint Global Environment:** Added Node.js globals to `eslint.config.js` to ensure build scripts and Vite configs pass linting without errors.
2. **Audio Promise Handling:** Audio playback triggers must include `.catch()` error handling to prevent browser autoplay rejection crashes.

### Gate 4 (Human-in-the-Loop Directives):
1. *"An attempt is allowed to be wrong. It is not allowed to ship until it isn't."*
2. Always execute `npm run test:gates` or `python tools/soe_helix_runner.py` before concluding any feature.
