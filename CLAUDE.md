# CLAUDE.md — The Sound of Essentials: Rhythm Quest

> **Universal Directive:** When processing questions or formulating responses, **collapse all alternatives that do not include or advance the stated objective.** Do not present, explore, or hedge with divergent options. Every recommendation, code suggestion, and design decision must pass through a single filter: *does this serve the objective?*

---

## 1. Single Source of Truth (`.agents/core/`)

All canonical data models, pricing contracts, and design tokens live in `.agents/core/`. **Never hardcode or duplicate these values**:

- **World Model, 7 Lands, 15 Heroes & Banned Entities:** [`.agents/core/canon.json`](file:///c:/Users/ldmur/Downloads/The%20Sound%20of%20Essentials%20Image%20Assets/The-Sound-of-Essentials-Eco-System/.agents/core/canon.json)
- **Product Catalog, Pricing & Card Vaulting:** [`.agents/core/pricing.json`](file:///c:/Users/ldmur/Downloads/The%20Sound%20of%20Essentials%20Image%20Assets/The-Sound-of-Essentials-Eco-System/.agents/core/pricing.json)
- **Design Tokens (Colors, Radii, Typography):** [`.agents/core/tokens.json`](file:///c:/Users/ldmur/Downloads/The%20Sound%20of%20Essentials%20Image%20Assets/The-Sound-of-Essentials-Eco-System/.agents/core/tokens.json)
- **Brand Voice & 5 Cultural Deltas:** [`.agents/soe-digital-brain/`](file:///c:/Users/ldmur/Downloads/The%20Sound%20of%20Essentials%20Image%20Assets/.agents/soe-digital-brain)

---

## 2. Automated Quality Enforcement (The Helix Gates)

Every code update, component addition, or curriculum pipeline change **MUST** pass Gate 1 before completion:

```bash
# In web/ directory:
npm run test:canon        # Validates lands, heroes, card vaulting, banned entities, and i18n parity
npm run test:gates        # Runs canon guard + ESLint
# Or full pipeline runner:
python tools/soe_helix_runner.py
```

*Note: Gate 1 fails with **Exit Code 2** (Non-Escape Ralph Hook) if any check fails.*

---

## 3. Tech Stack & Architecture

- **Web Platform:** React 19.2 + Vite 7.2 + React Router 7.13 (`web/`)
- **Animation:** Framer Motion 12 + Anime.js 4 + Canvas 2D (`SplineBackground.jsx`)
- **Styling:** Vanilla CSS with custom properties (`web/src/index.css`). **No TailwindCSS.**
- **Internationalization:** i18next across English (`en.json`), Spanish (`es.json`), and French (`fr.json`).
- **Payments:** Direct Stripe API with card vaulting. **Shopify is strictly retired.**

---

## 4. Key Engineering Conventions

1. **Ages 2–7 Strict Boundary:** Target audience is strictly Ages 2–7 (Pre-K to Grade 2). Grade 3 and older age references are banned.
2. **Design Tokens First:** Always reference CSS variables (`--color-orange`, `--color-bg-cream`, `--radius-xl: 50px` for pills). Never hardcode ad-hoc hex colors.
3. **i18n Parity:** Every user-facing string must use `useTranslation()`. Keys must exist across `en.json`, `es.json`, and `fr.json`.
4. **Route Code-Splitting:** All pages are lazy-loaded via `React.lazy()` with `<CubeLoader>` fallback in `App.jsx`.
5. **Multi-Repo Synchronization:** After schema or data updates, run `npm run sync:ecosystem` to synchronize the core schemas across all repositories.
