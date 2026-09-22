# CONSTRAINTS.md — The Sound of Essentials: Rhythm Quest

> **Engineering & Brand Contract:** This document establishes the non-negotiable quality bar, canonical identity rules, and performance thresholds for all AI coding agents and human contributors working on this codebase.

---

## 1. Canonical Demographic & Brand Constraints

* **Strict Age Range:** **Ages 2–7 (Toddler, Pre-K to Grade 2)**.
  * *Floor:* Never reference "Grade 3", "Age 8", or older ages. All historical references beyond age 7 are strictly retired.
* **Persona & Organizational Hierarchy:**
  * **Artist Collective:** SOE is an artist collective of musicians, vocalists, and educators.
  * **Founder (L.D. Murray):** Strategic background role only. L.D. Murray is *not* an on-camera performer or musical talent.
  * **Lead Marketer (Seriphia):** Seriphia is the sovereign guide, "An Eternal Learning Mother," and the primary front-facing voice teaching early learners and inspiring parents.
  * **15 Hero Mentors:** Early learners learn directly from the 15 characters mapped across the 7 Lands. (Gabriel / Lil G is the unreleased 16th character).
* **Factual & Narrative Integrity:**
  * **Zero Fabricated Statistics:** Never invent clinical percentages or studies. Attribute claims strictly to established pedagogical neuroscience (Dalcroze, Orff, Kodály).
  * **Emotional Anchor:** Always preserve the spirit: *"Crafted by a father's heart and a mother's love."*

---

## 2. Design System Constraints (July 2026 Canon)

* **Palette Tokens:**
  * Background: Cream `#FFF8F0`
  * Accent / Primary CTA: Vibrant Orange `#FF6F00`
  * Secondary Accents: Land-specific color tokens (Harmonia `#d4a843`, Numeria `#7fb685`, Vitalis `#c4785a`, Luminosity `#d4897a`, Aquaria `#5ba4c9`, Terrasol `#5fb685`, Celestia `#9678c4`).
  * *Retired:* Indigo `#4F46E5`, deep purple themes, and claymorphic pill styles are strictly retired.
* **Border Radii:** 50px pill radius (`border-radius: 9999px` or `50px`) for buttons and interactive badges.
* **Typography:**
  * Primary Headings: Fredoka / Bricolage Grotesque
  * Body Text: Inter
  * *Retired:* Baloo 2 and Comic Neue are retired.

---

## 3. Web Performance Thresholds (Core Web Vitals)

Every deploy must adhere to the following performance floors:

| Metric | Target Floor | Action if Breached |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | **≤ 2.5s** | Optimize hero images (WebP/AVIF), defer non-critical JS |
| **INP** (Interaction to Next Paint) | **≤ 200ms** | Profile main thread, break long tasks (>50ms) into microtasks |
| **CLS** (Cumulative Layout Shift) | **≤ 0.1** | Explicit `width` and `height` on all images and media containers |

* **Audio Asset Streaming:**
  * The 19 album tracks must be lazy-loaded on user intent (play/preview). Never preload all 19 audio assets on initial page load.
* **Canvas Animations:**
  * Background canvas animations (starfields, ambient waves) must listen to `document.visibilityState` and pause `requestAnimationFrame` when the tab is hidden or off-screen.

---

## 4. Code Health & Anti-Regression Watchlist

* **Zero Silencing:** No new `@ts-ignore`, `eslint-disable`, or `@ts-nocheck` comments to mask type/lint failures.
* **Zero Stripping:** Never delete or comment out existing assertions or tests to make a suite pass.
* **Clarity Over Cleverness:** Prefer readable, explicit mapping over dense multi-layer ternary chains or premature abstraction layers.
* **Machine Discovery Endpoints:**
  * Ensure `/llms.txt`, `/llms-full.txt`, `/.well-known/ai.txt`, and `/ai/summary.json` remain updated whenever routes or product catalogs change.
