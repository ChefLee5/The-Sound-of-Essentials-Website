# Higgsfield-style framework for Sound of Essentials

Reference inspected: https://higgsfield.ai/supercomputer/apps/9991a265-6f28-44ee-95ac-fa4b7a3c54ba/view

Inspection date: 2026-07-11

## What the public shell reveals

The linked app preview is sign-in gated, so this is an extraction of the public application shell and compiled runtime signals rather than the private app source.

- **Framework:** Next.js App Router in production. Evidence includes `_next/static` asset paths, `framework`, `main-app`, `webpack`, `app/...`, and `self.__next_f` runtime markers.
- **Styling:** Tailwind-style utility classes, including responsive prefixes (`md:`), arbitrary values (`z-[50]`), viewport sizing (`h-dvh`), and grid-area utilities.
- **Component primitives:** Radix UI is present in generated IDs such as `radix-...-trigger-*`.
- **Auth:** Clerk is loaded for the sign-in flow.
- **Client state:** Valtio is loaded as a shared state layer.
- **Observability:** Sentry and Google Analytics are loaded; Toastify-style notification regions are part of the shell.
- **Visual foundation:** dark theme with body background `rgb(21, 21, 23)`, near-white text `rgb(247, 247, 248)`, and neon-lime brand accent `rgb(209, 254, 23)`.
- **Desktop shell:** sticky top navigation, compact header height, full-height main region, dark canvas, and an overflow-hidden app viewport.
- **Mobile shell:** a separate mobile navigation block is rendered and desktop navigation is hidden at the breakpoint.

## Recommended SOE translation

The Sound of Essentials project already has a working Vite + React 19 application, React Router, route-level lazy loading, Framer Motion, GSAP, and Spline support. Keep that foundation and reproduce the interaction model rather than importing the reference site's compiled Next.js files.

### Shell hierarchy

```text
App
└── BrowserRouter
    └── SOEShell
        ├── DesktopHeader
        │   ├── Brand mark
        │   ├── Primary navigation
        │   ├── Context/action controls
        │   └── Account or join CTA
        ├── MobileHeader
        ├── MainViewport
        │   ├── RouteOutlet
        │   ├── AmbientCanvas / hero media
        │   ├── ToastRegion
        │   └── Optional side panel or player
        └── Footer
```

### Suggested file layout

```text
src/
├── app/
│   ├── AppShell.jsx
│   ├── routes.jsx
│   └── navigation.js
├── components/
│   ├── shell/DesktopHeader.jsx
│   ├── shell/MobileHeader.jsx
│   ├── shell/CommandPanel.jsx
│   ├── shell/ToastRegion.jsx
│   ├── media/MediaCard.jsx
│   ├── media/MediaRail.jsx
│   └── motion/Reveal.jsx
├── pages/
│   ├── Home.jsx
│   ├── Universe.jsx
│   ├── Listen.jsx
│   ├── Science.jsx
│   └── Join.jsx
├── state/
│   ├── appStore.js
│   └── playerStore.js
└── styles/
    ├── tokens.css
    ├── shell.css
    └── motion.css
```

## Reusable design tokens

```css
:root {
  --soe-ink: #151517;
  --soe-surface: #202023;
  --soe-surface-raised: #2a2a2f;
  --soe-text: #f7f7f8;
  --soe-text-muted: #a5a5ad;
  --soe-accent: #d1fe17;
  --soe-accent-ink: #171b00;
  --soe-border: rgba(247, 247, 248, 0.12);
  --soe-header-height: 3.25rem;
  --soe-content-max: 90rem;
  --soe-radius-sm: 0.5rem;
  --soe-radius-md: 0.875rem;
  --soe-ease: cubic-bezier(.22, 1, .36, 1);
}

body {
  background: var(--soe-ink);
  color: var(--soe-text);
}

.soe-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: var(--soe-header-height) 1fr auto;
  overflow-x: hidden;
}

.soe-main-viewport {
  min-width: 0;
  min-height: calc(100dvh - var(--soe-header-height));
  overflow: hidden;
  background: var(--soe-ink);
}
```

## Interaction model to replicate

1. **Persistent shell:** keep navigation mounted while route content changes.
2. **Route transitions:** animate only the route outlet so the header feels stable.
3. **Full-bleed media:** let hero video, Spline, or artwork occupy the viewport; place readable content in a constrained overlay layer.
4. **Dense control surfaces:** use compact dark cards with a clear active state in neon lime.
5. **Responsive split:** desktop gets a full navigation bar; mobile gets a dedicated compact header and bottom/action controls.
6. **Async surfaces:** keep loading, toast, and modal regions mounted at the shell level so they are not recreated on navigation.
7. **Media-first content:** represent audio, video, books, characters, and learning worlds as cards/rails with one obvious primary action.

## SOE-specific adaptation

Use the reference's product-like shell for the Sound of Essentials ecosystem, but keep SOE's warmer educational identity in the content layer:

- keep the dark shell and lime active states for the application/chrome;
- use SOE artwork, sky, water, and world colors inside hero scenes and content cards;
- make the primary routes `Universe`, `Listen`, `Science`, `Mission`, `Heroes`, and `Join`;
- reserve sign-in for optional saved progress, playlists, or parent/educator dashboards;
- keep the current React Router lazy imports and Framer Motion transitions;
- use the existing media assets under `public/assets` rather than remote reference assets.

## What not to copy

- Do not copy `_next/static` chunks or minified CSS from Higgsfield.
- Do not reproduce Higgsfield branding, labels, or private app content.
- Do not add Clerk, Valtio, Sentry, or Toastify unless SOE needs those product capabilities; the current project can implement the same shell with React state and its existing animation stack.
- Do not force the marketing site into an app-only viewport. Use the full-height shell for interactive areas and normal document flow for story, science, and purchase pages.

## Implementation starting point

Create an `SOEShell` around the existing route tree, move the current V2 navigation into the persistent header, and add a `MainViewport` wrapper with the tokens above. Then migrate one route—recommended: `Listen`—to validate the dark shell, media rail, responsive controls, and route transition before applying the pattern across the site.
