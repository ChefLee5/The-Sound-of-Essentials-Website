# SOE Picture Dictionary

Main repository for The Sound of Essentials picture dictionary, companion website, ebook source, workbook source, and supporting design system.

## What This Is

SOE Picture Dictionary is the public-facing home for the Rhythm Quest learning ecosystem and the source of the picture dictionary product. It combines a React/Vite website with ebook and workbook production assets.

By the numbers:

- 7 lands spanning language, math, science, travel, health, community, and time
- 15 heroes, including Seriphia as the guide
- 3 active website languages: English, Spanish, and French
- Website routes for Home, Universe, Heroes, Listen, Dictionary, Science, Mission, Join, and Allies
- Ebook and workbook source content kept alongside the web experience

## Project Structure

```txt
.
|-- design-system/        # Brand and visual system references
|-- ebook/                # Picture dictionary EPUB/PDF source and generated pages
|-- web/                  # React + Vite website
`-- workbook/             # Workbook source and generated EPUB content
```

The active website lives in `web/`.

## Web App Structure

```txt
web/
|-- public/               # Static web assets requested by URL
|-- src/
|   |-- assets/           # Media imported directly by React
|   |-- components/       # Reusable UI components
|   |-- data/             # Static structured app data
|   |-- hooks/            # Custom React hooks
|   |-- i18n/             # i18next config and locale JSON
|   |-- pages/            # Route-level pages
|   |-- remotion/         # Remotion video compositions
|   `-- utils/            # Shared helper functions
|-- index.html
|-- package.json
`-- vite.config.js
```

## Asset Organization

Use `web/public/` for files that the browser requests directly by URL. Prefer this shape for new public assets:

```txt
web/public/
|-- favicon/
|-- images/
|   |-- heroes/
|   |-- lands/
|   |-- backgrounds/
|   |-- logos/
|   `-- ui/
|-- audio/
|   |-- music/
|   |-- sfx/
|   `-- voiceover/
|-- video/
|   |-- trailers/
|   `-- loops/
`-- fonts/
```

Existing public assets currently live under `web/public/assets/`; keep links stable when moving or replacing production media.

Use `web/src/assets/` only for media imported by React:

```txt
web/src/assets/
|-- heroes/
|-- lands/
|-- logos/
|-- textures/
`-- icons/
```

## Deployment Notes

This repo is configured for GitHub Pages under the `SOE-Picture-Dictionary` path.

- Vite base: `/SOE-Picture-Dictionary/`
- React Router basename: `/SOE-Picture-Dictionary`
- Local dev URL after `npm run dev`: `http://localhost:5173/SOE-Picture-Dictionary/`

If the GitHub Pages repo name changes, update both `web/vite.config.js` and `web/src/main.jsx`.

## Getting Started

```bash
git clone https://github.com/ChefLee5/SOE-Picture-Dictionary.git
cd SOE-Picture-Dictionary/web
npm install
npm run dev
```

## Related Repositories

- [The-Sound-of-Essentials-Eco-System](https://github.com/ChefLee5/The-Sound-of-Essentials-Eco-System)
