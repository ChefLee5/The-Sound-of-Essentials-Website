# Adspend.com Leverage Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy Brian Moncada's highest-leverage acquisition, conversion, and operational frameworks from `Adspend.com` into The Sound of Essentials (SOE) ecosystem—specifically the Ethical Heist lead magnet angle, direct DM conversational qualification loop, 4-part YouTube ad script engine, QPC (Qualifier-Pitch-Calendar) B2B institutional funnel, and high-trust curriculum concierge widget.

**Architecture:** The implementation spans three coordinated layers: (1) Frontend Web Platform (`web/`) with a new `/institutions` QPC funnel route, Listen page Ethical Heist reframing, and floating Curriculum Concierge badge; (2) Conversational Lead Layer with a zero-form Instagram/TikTok DM automation bridge delivering master tracks and routing to the $7 card-vaulting bump; and (3) Creative/Ad Intelligence Layer with YouTube Ads 4-part video scripts and placement targeting lists intercepting toddler edutainment channels.

**Tech Stack:** React 19.2, Vite 7.2, React Router 7.13, Vanilla CSS Custom Properties (Tokens), i18next (EN/ES/FR), Node.js Canon Guard (`test:canon`).

---

### Task 1: "Ethical Heist" Angle Reframing for Listen Gate & Lead Magnet

**Files:**
- Modify: `web/src/locales/en.json`
- Modify: `web/src/locales/es.json`
- Modify: `web/src/locales/fr.json`
- Modify: `web/src/pages/Listen.jsx`
- Modify: `web/src/pages/Listen.css`
- Test: `web/scripts/soe-canon-guard.mjs`

**Step 1: Check existing copy and i18n parity in `en.json`, `es.json`, `fr.json`**
Inspect the `listen` section of `web/src/locales/en.json` to identify the current headline and sub-headline for the lead capture gate.

**Step 2: Add canonical Ethical Heist translation keys across EN, ES, FR**
In `web/src/locales/en.json`:
```json
"ethicalHeistBadge": "THE ETHICAL HEIST",
"ethicalHeistTitle": "STEAL The 10-Minute Morning Routine That Displaced Screen Meltdowns Across 500+ Homes",
"ethicalHeistSubtitle": "No fake promises. Just 19 studio-recorded acoustic master tracks and the screen-free tactile blueprint for ages 2–7. Free today.",
"ethicalHeistCta": "STEAL THE BLUEPRINT (FREE ALBUM + COLORING BOOK)"
```
In `web/src/locales/es.json`:
```json
"ethicalHeistBadge": "EL ACCESO PRIVILEGIADO",
"ethicalHeistTitle": "OBTÉN la rutina matutina de 10 minutos que eliminó las rabietas de pantalla en más de 500 hogares",
"ethicalHeistSubtitle": "Sin pantallas. 19 pistas acústicas maestras grabadas en estudio y la guía táctil para edades de 2 a 7 años. Gratis hoy.",
"ethicalHeistCta": "OBTÉN LA GUÍA GRATIS (ÁLBUM + LIBRO DE COLOREAR)"
```
In `web/src/locales/fr.json`:
```json
"ethicalHeistBadge": "L'ACCÈS EXCLUSIF",
"ethicalHeistTitle": "ADOPTEZ la routine matinale de 10 minutes qui a éliminé les crises d'écran dans plus de 500 foyers",
"ethicalHeistSubtitle": "Sans écrans. 19 pistes acoustiques enregistrées en studio et le guide tactile pour les 2–7 ans. Gratuit aujourd'hui.",
"ethicalHeistCta": "OBTENIR LE GUIDE GRATUIT (ALBUM + COLORIAGE)"
```

**Step 3: Update `web/src/pages/Listen.jsx` to render the Ethical Heist Hero Gate**
Add the high-conversion ethical heist headline badge above the email unlock form with gold accent pill styling:
```jsx
<div className="ethical-heist-badge">
  <span className="badge-tag">{t('listen.ethicalHeistBadge')}</span>
  <h2 className="heist-title">{t('listen.ethicalHeistTitle')}</h2>
  <p className="heist-subtitle">{t('listen.ethicalHeistSubtitle')}</p>
</div>
```

**Step 4: Add CSS styles in `web/src/pages/Listen.css` using design tokens**
```css
.ethical-heist-badge {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.ethical-heist-badge .badge-tag {
  display: inline-block;
  background: var(--color-orange);
  color: var(--color-white, #ffffff);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 16px;
  border-radius: var(--radius-xl, 50px);
  margin-bottom: var(--space-xs);
}

.ethical-heist-badge .heist-title {
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 800;
  color: var(--color-text-dark, #1f2937);
  line-height: 1.25;
  margin: var(--space-xs) auto;
  max-width: 760px;
}

.ethical-heist-badge .heist-subtitle {
  font-size: 1.05rem;
  color: var(--color-text-muted, #4b5563);
  max-width: 640px;
  margin: 0 auto;
}
```

**Step 5: Run Canon & i18n Parity Guard**
Run: `npm --prefix web run test:canon`
Expected: Gate 1 PASSED (All 7 checks verified successfully).

**Step 6: Commit changes**
```bash
git add web/src/locales/*.json web/src/pages/Listen.jsx web/src/pages/Listen.css
git commit -m "feat(funnel): deploy ethical heist lead magnet angle on listen gate"
```

---

### Task 2: "No Email Required" DM Conversational Lead Engine

**Files:**
- Create: `docs/social_dm_conversational_funnel.md`
- Create: `web/src/components/DmOptInBridge.jsx`
- Create: `web/src/components/DmOptInBridge.css`
- Modify: `web/src/pages/Listen.jsx`
- Modify: `web/src/locales/en.json`, `es.json`, `fr.json`
- Test: `web/scripts/soe-canon-guard.mjs`

**Step 1: Create the DM Conversational Funnel Blueprint**
Create `docs/social_dm_conversational_funnel.md` documenting:
- Keyword Triggers: `RHYTHM` and `BLUEPRINT` on Instagram & TikTok.
- Flow Stage 1: Auto-DM sends the 19 master tracks streaming link + downloadable PDF Coloring Book in under 5 seconds.
- Flow Stage 2 (Conversational Bridge): 2 minutes later, the bot asks: *"Quick question: Is this for a 2-4 year old or 5-7 year old?"*
- Flow Stage 3 (Card-Vaulting Bridge): Delivers tailored audio recommendation and offers the **$7 Quest Starter Pack** (Physical + Digital In-Cart Bump) vaulted via Stripe checkout link.

**Step 2: Build `DmOptInBridge.jsx` Component**
Create a toggle below the standard email input on `web/src/pages/Listen.jsx` that lets parents choose: *"Rather get it on Instagram without checking email? Click here."*
```jsx
import { useTranslation } from 'react-i18next';
import './DmOptInBridge.css';

export default function DmOptInBridge() {
  const { t } = useTranslation();

  return (
    <div className="dm-optin-bridge">
      <div className="dm-divider">
        <span>{t('listen.orDivider', 'OR')}</span>
      </div>
      <a 
        href="https://ig.me/m/soelearn?text=RHYTHM" 
        target="_blank" 
        rel="noopener noreferrer"
        className="dm-trigger-btn"
        id="dm-instagram-trigger"
      >
        <span className="dm-icon">💬</span>
        <div className="dm-text">
          <strong>{t('listen.dmCtaTitle', 'Send to my Instagram (No Email Required)')}</strong>
          <small>{t('listen.dmCtaSubtitle', 'DM "RHYTHM" to @soelearn & get tracks instantly')}</small>
        </div>
      </a>
    </div>
  );
}
```

**Step 3: Add CSS for `DmOptInBridge.css`**
```css
.dm-optin-bridge {
  margin-top: var(--space-md);
  text-align: center;
  width: 100%;
  max-width: 440px;
  margin-left: auto;
  margin-right: auto;
}

.dm-divider {
  display: flex;
  align-items: center;
  margin: var(--space-sm) 0;
}

.dm-divider::before,
.dm-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dm-divider span {
  padding: 0 var(--space-sm);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-muted, #6b7280);
  text-transform: uppercase;
}

.dm-trigger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: var(--radius-xl, 50px);
  padding: 10px 20px;
  text-decoration: none;
  color: var(--color-text-dark, #1f2937);
  transition: all 0.2s ease;
}

.dm-trigger-btn:hover {
  border-color: var(--color-orange);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 111, 0, 0.12);
}

.dm-icon {
  font-size: 1.3rem;
}

.dm-text {
  text-align: left;
  display: flex;
  flex-direction: column;
}

.dm-text strong {
  font-size: 0.95rem;
  font-weight: 700;
}

.dm-text small {
  font-size: 0.78rem;
  color: var(--color-text-muted, #6b7280);
}
```

**Step 4: Update translation files for parity**
Add `orDivider`, `dmCtaTitle`, `dmCtaSubtitle` across `en.json`, `es.json`, `fr.json`.

**Step 5: Run Canon & i18n Guard**
Run: `npm --prefix web run test:canon`
Expected: Gate 1 PASSED.

**Step 6: Commit**
```bash
git add docs/social_dm_conversational_funnel.md web/src/components/DmOptInBridge.* web/src/pages/Listen.* web/src/locales/*.json
git commit -m "feat(funnel): add zero-email DM conversational lead bridge"
```

---

### Task 3: YouTube Ads 4-Part Script Engine & Placement Hijack

**Files:**
- Create: `docs/youtube_ads_script_playbook.md`
- Create: `docs/youtube_ads_placement_targeting.md`

**Step 1: Write YouTube Ads Placement Targeting Playbook**
Document exact targeting specs in `docs/youtube_ads_placement_targeting.md`:
- Specific Channel Placements: CoComelon, Super Simple Songs, Blippi, Pinkfong, Little Baby Bum, Ms. Rachel, Danny Go.
- Intent Search Keywords: "toddler screen tantrum", "preschool phonics song", "calm morning music for kids", "screen free kindergarten prep", "montessori morning rhythm".
- Demographics: Parents aged 25–44 with children aged 2–7.
- Exclusions: Video games, tween channels, non-family entertainment.

**Step 2: Produce 3 Full 4-Part Production Scripts in `docs/youtube_ads_script_playbook.md`**
Apply Brian Moncada’s 4-part framework strictly aligned with SOE music and visual canon:
1. **Script 1 (The Meltdown Intercept — Hook: 0–5s):**
   - *Visual:* Stylized anime cut of parent cooking dinner while child is captivated by a flashing hyper-saturated tablet. Suddenly screen turns off -> immediate screaming meltdown.
   - *Hook Voiceover:* "If taking the iPad away from your 3-year-old causes a full-blown meltdown every single evening, don't skip this video."
   - *Agitate (5–25s):* "The problem isn't your parenting. It's the 200-BPM sensory overload engineered into modern cartoons spiking your child's dopamine."
   - *Mechanism (25–50s):* "The Sound of Essentials replaces the hyper-stimulation with 19 master acoustic tracks recorded live in studio sessions. Phonics, numbers, and emotional regulation learned through natural acoustic tempo—zero glowing screens."
   - *CTA (50–70s):* "Click below to stream the full 19-track album free today and claim your screen-free tactile morning routine."
2. **Script 2 (The Phonics Gap Intercept):** Focused on Ages 4–6 reading readiness.
3. **Script 3 (The Sanctuary Home Routine):** Focused on homeschool and evening calm-down rhythms.

**Step 3: Verification & Canon Check**
Inspect `docs/youtube_ads_script_playbook.md` to guarantee:
- Strictly Ages 2–7 (no Grade 3+ mentions).
- Zero claims of "live instrumentation/live instruments/live music" (uses canonical phrasing: "originally published music, recorded live in studio sessions").
- Seriphia and canonical heroes properly described in visual storyboard notes.

**Step 4: Commit**
```bash
git add docs/youtube_ads_script_playbook.md docs/youtube_ads_placement_targeting.md
git commit -m "feat(ads): add youtube ads 4-part script engine and placement targeting"
```

---

### Task 4: The QPC (Qualifier-Pitch-Calendar) B2B Funnel for Institutions

**Files:**
- Create: `web/src/pages/InstitutionsQpc.jsx`
- Create: `web/src/pages/InstitutionsQpc.css`
- Modify: `web/src/App.jsx` (Register route `/institutions`)
- Modify: `web/src/components/Navbar.jsx`
- Modify: `web/src/locales/en.json`, `es.json`, `fr.json`
- Test: `web/scripts/soe-canon-guard.mjs`

**Step 1: Write the failing test / canon check**
Verify that a new route `/institutions` passes `test:canon` without breaking hero rosters, pricing models, or banned entity rules.

**Step 2: Build `InstitutionsQpc.jsx` Page Component**
Implement the 3-step interactive QPC structure:
1. **Qualifier Step (Interactive Assessment):**
   - Question 1: Organization Type (Preschool Chain, Head Start Center, Private Pre-K Academy, District Coordinator).
   - Question 2: Number of Classrooms / Students (1–5 rooms, 6–20 rooms, 20+ rooms).
   - Question 3: Current Screen-Free Priority (Urgent, Exploring for Fall, Reviewing Curricula).
2. **Pitch Step (Institutional System Demonstration):**
   - 10–15 Minute Screen-Free Tactile Lesson Extension overview.
   - Head Start ELOF & NAEYC Standards Crosswalk summary.
   - Printable Classroom Educator Packs & Teacher Professional Development modules.
3. **Calendar / Concierge Step (Direct Scheduling):**
   - Direct calendar embed / consultation request form routing leads directly into Brevo Institutional CRM list (List ID 4 from Brevo catalog).

**Step 3: Add CSS Tokens and Styles in `InstitutionsQpc.css`**
- Follow Bright & Playful design tokens (`--color-orange`, `--color-bg-cream`, `--radius-xl: 50px`).
- Responsive card grid for the multi-step qualification questions.

**Step 4: Register Route in `web/src/App.jsx`**
```jsx
const InstitutionsQpc = lazy(() => import('./pages/InstitutionsQpc'));
// Inside Routes:
<Route path="/institutions" element={<AnimatedPage><InstitutionsQpc /></AnimatedPage>} />
```

**Step 5: Add i18n Translation Keys for EN, ES, FR**
Ensure all qualification questions, pitch cards, and booking calls-to-action exist across `en.json`, `es.json`, and `fr.json`.

**Step 6: Run Canon Guard Verification**
Run: `npm --prefix web run test:canon`
Expected: Gate 1 PASSED.

**Step 7: Commit**
```bash
git add web/src/pages/InstitutionsQpc.* web/src/App.jsx web/src/locales/*.json
git commit -m "feat(b2b): implement institutional QPC qualification funnel"
```

---

### Task 5: High-Trust Direct Curriculum Concierge Floating Widget

**Files:**
- Create: `web/src/components/ConciergeBadge.jsx`
- Create: `web/src/components/ConciergeBadge.css`
- Modify: `web/src/pages/RhythmQuestSale.jsx`
- Modify: `web/src/locales/en.json`, `es.json`, `fr.json`
- Test: `web/scripts/soe-canon-guard.mjs`

**Step 1: Build `ConciergeBadge.jsx` Component**
A floating or inline badge on checkout & workbook sales pages establishing instant human trust:
```jsx
import { useTranslation } from 'react-i18next';
import './ConciergeBadge.css';

export default function ConciergeBadge() {
  const { t } = useTranslation();

  return (
    <aside className="curriculum-concierge-badge" aria-label="Curriculum Concierge Support">
      <div className="concierge-avatar">👩🏾‍🏫</div>
      <div className="concierge-info">
        <span className="concierge-status">● {t('concierge.online', 'Educator Concierge Active')}</span>
        <p className="concierge-copy">
          {t('concierge.text', 'Have questions about ages 2–7 readiness? Text our curriculum team directly: ')}
          <a href="sms:+18005557498" className="concierge-phone">1-800-555-RHYTHM</a>
        </p>
      </div>
    </aside>
  );
}
```

**Step 2: Add CSS in `ConciergeBadge.css`**
- Design token integration with subtle shadow, cream background, and green active indicator.

**Step 3: Integrate into `RhythmQuestSale.jsx` near the Order Summary**
Mount `<ConciergeBadge />` right above the final checkout button to eliminate last-second buyer hesitation.

**Step 4: Add i18n keys across all 3 locales**
Update `en.json`, `es.json`, and `fr.json`.

**Step 5: Run Full Test Suite**
Run: `npm --prefix web run test:canon`
Expected: Gate 1 PASSED.

**Step 6: Commit**
```bash
git add web/src/components/ConciergeBadge.* web/src/pages/RhythmQuestSale.jsx web/src/locales/*.json
git commit -m "feat(ui): add high-trust direct curriculum concierge badge"
```

---

## Plan Verification & Delivery Checklist
- [ ] Gate 1 (`npm --prefix web run test:canon`) passes with zero warnings.
- [ ] No mention of banned entities or age-creep (strictly Ages 2–7).
- [ ] Music canon strictly preserved (19 master acoustic tracks recorded live in studio sessions; zero claims of "live instrumentation/live music").
- [ ] Complete i18n parity verified across `en.json`, `es.json`, and `fr.json`.
- [ ] Card vaulting and direct Stripe payment architecture preserved.
