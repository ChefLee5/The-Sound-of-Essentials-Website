# SOE UI Prompt Blueprints & Component System

> **Canonical UI Generation Guide for The Sound of Essentials: Rhythm Quest**  
> Adapted from the high-converting layout architecture of VibePrompts, strictly harmonized with SOE design constraints, React 19, and Vanilla CSS tokens.

---

## 1. Architectural Translation Protocol (Prompts Over Frameworks)

Third-party component catalogs (like VibePrompts) rely on Tailwind CSS utility classes and generic neutral palettes. 
Per **[AGENTS.md](file:///c:/Users/ldmur/Downloads/The-Sound-of-Essentials-Website/AGENTS.md)** and **[CONSTRAINTS.md](file:///c:/Users/ldmur/Downloads/The-Sound-of-Essentials-Website/CONSTRAINTS.md)**:
1. **No Tailwind CSS:** All components must use **React 19 + Vanilla CSS** (`v2.css`, `index.css`, or scoped component `.css`).
2. **Canonical Palette:** Cream canvas (`#FFF8F0`), warm orange accents (`#FF6F00`), 7 Land accent tokens, and deep charcoal text (`#1E1E2F`). Claymorphic pill styles and retired purples/indigos are forbidden.
3. **Pill Radii:** Buttons and interactive badges must use **50px pill radius** (`border-radius: 9999px` or `50px`).
4. **Typography:** Fredoka / Bricolage Grotesque for headings; Inter for body copy.
5. **Canon Guardrails:** Ages 2–7 strictly, zero fabricated stats, *"crafted by a father's heart and a mother's love"*, and zero refund/guarantee language on digital assets.

**The Workflow:**  
Never copy raw Tailwind markup. Instead, take the **Natural Language Functional Specification** below and prompt Antigravity or your AI agent with the SOE System Harness (Section 4).

---

## 2. Core High-Leverage Blueprints

### Blueprint 01: Two-Path Audience Split CTA (`BP-01`)
* **Use Case:** Ending manifesto pages, mission statements, or homepages to cleanly route dual audiences (D2C Families vs. B2B Institutional Consortia).
* **Reference Pattern:** `vibeprompts.dev/cta/cta-two-path-cta-split/`

```markdown
### Prompt Specification
Create a responsive two-path conversion card grid for The Sound of Essentials using React and Vanilla CSS tokens.
Centre a max-w-5xl container with an overarching section heading ("Choose Your Path in the Quest") and subtext establishing that SOE serves both living rooms and classrooms.
Inside, render two distinct side-by-side cards with subtle rounded borders (border-radius: 24px) and soft cream/card background:

Card 1 (For Families & Homeschoolers):
- Badge: "For Families & Homeschool" in warm orange pill
- Headline: "Bring the Sanctuary Home"
- Description: "Access the complete 19-track acoustic album 100% free, plus screen-free tactile workbooks and companion storybooks designed for ages 2 to 7."
- Benefit list with 3 checkmark points: Free 19-Track Album Download, Tactile Story & Phonics Literature, Zero Algorithmic Screen Time.
- CTA Button: Solid pill button (#FF6F00) linking to /listen or /v2/join ("Start the Family Quest →").

Card 2 (For Schools, Clinics & Early Childhood Consortia):
- Badge: "For Educators & Consortia" in sage/vitalis green pill
- Headline: "Equip Your Classrooms"
- Description: "Turnkey 10–15 minute music-powered sensory lessons aligned with Head Start ELOF, NAEYC, and state early learning standards."
- Benefit list with 3 checkmark points: State DOE & Consortia Procurement Alignment, ELOF Multi-Institutional Crosswalks, Non-Tech Screen-Free Classroom Kits.
- CTA Button: Outlined pill button with dark border linking to /education-sovereignty or institutional contact ("Request Institutional Review Kit →").

Finish with a shared reassurance footer: "Acoustic music and tactile literature crafted by a father's heart and a mother's love."
```

---

### Blueprint 02: Cultural Delta Before-and-After Split (`BP-02`)
* **Use Case:** Feature sections, advertorial bridges, and mission manifesto chapters detailing the transition from dopamine traps to acoustic sanctuary.
* **Reference Pattern:** `vibeprompts.dev/features/features-before-and-after-split/`

```markdown
### Prompt Specification
Create an asymmetric comparison split component for The Sound of Essentials contrasting standard digital media against the SOE sanctuary using React and Vanilla CSS.
Structure as a 2-column comparison within a max-w-6xl container:

Left Column (The Status Quo: "The Algorithmic Trap"):
- Header badge: "What Modern Media Built" in muted charcoal
- Title: "Overstimulation & Watch-Time Loops"
- Body: "Flashing screens, rapid scene changes, autoplay traps, and dopamine harvesting engineered to keep children sedentary and glued to glass."
- 3 negative consequence chips with subtle red/muted warning accents: Sensory overload & tantrums, Passive consumption over active motor skills, Algorithmic behavioral conditioning.

Right Column (The SOE Sanctuary: "The Acoustic Quest"):
- Header badge: "What Children Deserve" in bright orange (#FF6F00) pill
- Title: "A Calm, Whole-Body Sanctuary"
- Body: "Acoustic rhythms, soothing organic instrumentation, embodied movement, and tactile storybooks designed by educators for developing minds ages 2 to 7."
- 3 positive outcome chips with soft green/gold accents: Regulated nervous systems, Whole-body phonics & beat mastery, Screen-free tactile memory.

Footer: Full-width quote strip with centered italics: "Not the algorithm. The child."
```

---

### Blueprint 03: Sticky Bottom Non-Intrusive Offer Bar (`BP-03`)
* **Use Case:** Persistent bottom strip on long-form articles, music listening pages, and documentation to deliver the free album without disrupting the reading flow.
* **Reference Pattern:** `vibeprompts.dev/cta/cta-sticky-bottom-conversion-bar/`

```markdown
### Prompt Specification
Create a sticky bottom conversion banner in React and Vanilla CSS for The Sound of Essentials.
Position fixed at the bottom edge (z-index: 999), spanning full width with a backdrop blur and soft cream background (#FFF8F0 at 95% opacity) bordered by a subtle 1px top border (#E5DFD7).
Inside a max-w-5xl container:
- Left: An album cover thumbnail with rounded corners (48x48px) and a pulsing music note badge.
- Center: Headline "Gift Your Family the 19-Track Rhythm Quest Album" paired with subtitle "100% free acoustic early learning music for ages 2–7. No ads, no screens."
- Right: A flex row containing:
  - An instant download CTA pill button (#FF6F00) opening the download gate modal or navigating to /listen.
  - A subtle dismiss "✕" icon button that stores a sessionStorage dismissal flag so it does not reappear during the active session.
Ensure responsive collapse on mobile: stack text and button vertically or compact to a single tap target with proper safe-area padding.
```

---

### Blueprint 04: Exit-Intent Value Modal (`BP-04`)
* **Use Case:** Capturing departing visitors on landing pages or advertorials by offering the Free Coloring Book or Album Download before bounce.
* **Reference Pattern:** `vibeprompts.dev/cta/cta-exit-intent-offer-modal/`

```markdown
### Prompt Specification
Create an exit-intent modal dialog in React and Vanilla CSS for The Sound of Essentials.
Trigger on mouseleave toward the browser viewport top on desktop (with a 10-second initial cooldown, fired once per session).
Render an accessible dialog modal with backdrop blur overlay:
- Content Card: Centered card with 24px border radius, white/cream fill, and subtle shadow.
- Header Visual: Illustration of the Rhythm Quest Free Coloring Book or Seriphia Sovereign Guide character.
- Eyebrow: "Before You Journey On" in orange uppercase pill.
- Title: "Take the Rhythm Quest Coloring Book With You"
- Body: "Printable screen-free tactile sheets introducing the 7 Lands and acoustic heroes for early learners ages 2 to 7. Delivered instantly to your inbox."
- Form: Inline email input and a gold/orange pill submit button ("Send My Free Gift →").
- Assurance: "Instant digital delivery. Zero spam, ever. Your family's sanctuary is respected."
- Close mechanism: Clear '✕' in top right and Esc key listener with focus trapping.
```

---

### Blueprint 05: Institutional Procurement & Review Inquiry (`BP-05`)
* **Use Case:** Capturing school district superintendents, Head Start directors, and State DOE consortium leaders on enterprise and sovereignty pages.
* **Reference Pattern:** `vibeprompts.dev/contact/contact-procurement-review-request/`

```markdown
### Prompt Specification
Create an institutional procurement inquiry panel for State DOEs and Early Childhood Consortia using React and Vanilla CSS.
Centre a max-w-3xl card with a structured form:
- Eyebrow: "Institutional & State Consortia Review"
- Headline: "Request an Educational Concord Procurement Packet"
- Description: "Direct licensing, ELOF/NAEYC crosswalk matrices, and turnkey screen-free classroom packages for Pre-K through Grade 2."
- Form Fields:
  1. Full Name & Institutional Title
  2. School District, Consortium, or Agency Name
  3. Work Email (.edu, .gov, or institutional domain)
  4. Program Type (Dropdown: Head Start Consortium, Public School District Pre-K, Private/Independent ECE, State DOE Consortia)
  5. Student / Classroom Count Range (Dropdown: 1–10 classrooms, 11–50 classrooms, 51–250 classrooms, 250+ classrooms / Statewide)
  6. Information Requested (Multi-checkbox: ELOF / NAEYC Standards Crosswalk, Screen-Free Tactile Classroom Kits, Professional Development & Teacher Guides)
- Submit CTA: Solid pill button (#FF6F00) "Submit Institutional Request →"
- Compliance Note: "Compliant with state early learning standard reporting and federal screen-free classroom initiatives."
```

---

### Blueprint 06: 5 Core Domains & 7 Lands Tactile Bento Grid (`BP-06`)
* **Use Case:** Curriculum exploration, interactive world-building pages, and learning science showcases.
* **Reference Pattern:** `vibeprompts.dev/features/features-bento-grid/`

```markdown
### Prompt Specification
Create an asymmetric 5-tile Bento Grid in React and Vanilla CSS showcasing the 5 Core Domains of The Sound of Essentials.
Layout in a responsive grid (2 large feature cards, 3 compact cards):

Tile 1 (Large - Language & Phonics):
- Land: Harmonia (Color accent: #d4a843)
- Hero Mentors: Melody & Rhythm
- Visual: Soundwave and acoustic guitar icon
- Copy: "Whole-body phonemic awareness taught through call-and-response vocal melodies."

Tile 2 (Large - Cognitive & Numeracy):
- Land: Numeria (Color accent: #7fb685)
- Hero Mentors: Count & Beat
- Visual: Metronome and rhythm beat markers
- Copy: "Counting in beats and intervals. Math experienced as rhythm before symbols."

Tile 3 (Standard - Physical & Somatic Movement):
- Land: Vitalis (Color accent: #c4785a)
- Copy: "Stretching, motor coordination, and somatic self-regulation set to grounding tempos."

Tile 4 (Standard - Scientific & Natural Discovery):
- Land: Aquaria & Terrasol (Color accent: #5ba4c9)
- Copy: "Observing habitats, seasons, and elements through auditory exploration."

Tile 5 (Standard - Social-Emotional Sanctuary):
- Land: Celestia & Luminosity (Color accent: #9678c4)
- Copy: "Co-regulation, gentle lullabies, and emotional sanctuary guided by Seriphia."

Each tile features a 20px radius, hover elevation (-4px translateY), domain color top-border, and clickable exploration link.
```

---

### Blueprint 07: Audio-First Acoustic Track Showcase (`BP-07`)
* **Use Case:** Music page (`/listen` or `/v2/listen`), land explorations, and interactive curriculum samples.
* **Reference Pattern:** `vibeprompts.dev/blog/blog-podcast-episode-list/`

```markdown
### Prompt Specification
Create an acoustic track list item component for The Sound of Essentials using React and Vanilla CSS.
Strict Constraint: Audio streams must be lazy-loaded on user intent (play/preview click), never preloaded.
Card Structure:
- Left: Circular play/pause toggle button (44px) with animated audio waveform bars when active.
- Center Left: Track number pill ("Track 03"), Title ("Let's Stretch"), and Land badge ("Vitalis • Physical Domain").
- Center Right: Duration timestamp ("2:45") and acoustic instrument tag ("Acoustic Guitar & Djembe").
- Right: Action buttons:
  - "Read Lyrics" expandable toggle
  - "Gift Track" share link
Expandable Drawer:
When "Read Lyrics" is active, smoothly slide down a tactile card section containing clean verse/chorus lyrics, early developmental skill notes, and suggested classroom movement extensions.
```

---

### Blueprint 08: Neuro-Affirming Accordion FAQ (`BP-08`)
* **Use Case:** Eliminating parent and educator objections on curriculum, screen-free philosophy, and digital downloads.
* **Reference Pattern:** `vibeprompts.dev/faq/faq-accordion-list/`

```markdown
### Prompt Specification
Create a clean, accessible FAQ accordion using semantic HTML5 <details> and <summary> tags in React and Vanilla CSS for The Sound of Essentials.
Container: Centered max-w-3xl with generous whitespace and cream background.
Card Items:
- Border-radius: 16px with subtle border (#E8E2D9) and warm hover state.
- Summary element styled as a flex row with custom rotating "+" / "−" indicator in orange.
- Answers written in calm, authoritative educator voice:
  1. "Is there really zero screen time required?" (Explains acoustic music + physical workbooks).
  2. "What ages is The Sound of Essentials designed for?" (Strictly reinforces Ages 2–7: Toddler, Pre-K through Grade 2).
  3. "How does acoustic music help with focus and emotional regulation?" (Touches on nervous system co-regulation, Dalcroze/Orff pedagogy without fake stats).
  4. "How do digital downloads work?" (Instant access on phones/tablets, printable PDF workbook pages, lifetime access, dedicated family support).
```

---

## 3. Digital Assurance & Policy Contract

Per **Rule 1 of AGENTS.md**, digital products (Workbooks, Dictionaries, Bundles, and Album Downloads) carry **zero returns / no money-back guarantees**.

When generating sales badges, guarantee blocks, or checkout assurance footers, **always** use this standardized reassurance copy:

```html
<div class="soe-digital-assurance">
  <div class="soe-assurance-badge">✨ Instant Digital Sanctuary</div>
  <p class="soe-assurance-text">
    Immediate download access delivered to your inbox upon purchase. 
    Optimized for home printing and all mobile & tablet readers. 
    Lifetime family access with dedicated customer care.
  </p>
</div>
```

---

## 4. Antigravity System Harness (Copy-Paste Prompt Template)

When prompting an AI assistant or writing new components for `The-Sound-of-Essentials-Website`, prepend this block:

```text
You are building a component for The Sound of Essentials: Rhythm Quest.
STRICT TECHNICAL CONSTRAINTS:
1. Framework: React 19 + Vanilla CSS (NO Tailwind CSS).
2. Design Tokens: Canvas #FFF8F0, Accent Orange #FF6F00, Pill Radius 50px (border-radius: 9999px).
3. Headings: Fredoka / Bricolage Grotesque. Body: Inter.
4. Audience Canon: Strictly Ages 2–7 (Toddler, Pre-K to Grade 2).
5. Persona Canon: Seriphia is the Sovereign Guide; L.D. Murray is strategic founder only.
6. Assurance: Never mention "money-back guarantee" or refunds for digital downloads.
7. Tone: Calm, tactile, screen-free sanctuary crafted by a father's heart and a mother's love.

BLUEPRINT TO IMPLEMENT:
[Insert Blueprint Name & Prompt Specification from SOE_UI_PROMPT_BLUEPRINTS.md]
```
