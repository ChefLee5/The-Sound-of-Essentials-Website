The Sound of Essentials Website
private website and production source repository for The Sound of Essentials and the SOE Rhythm Quest learning ecosystem.

The project brings together the React/Vite marketing site, multilingual learning pages, music and product data, ebook source files, workbook source files, and the shared visual system used across the brand.

What This Includes
React + Vite website for the public SOE experience
Rhythm Quest pages for the universe, heroes, listening experience, products, science, mission, join flow, and allies
Product data for the Picture Dictionary, Summer Stretch Workbook, Full Quest Bundle, and Rhythm Quest album
Ebook source content, generated XHTML pages, posters, and production scripts
Workbook source data, generated XHTML pages, images, and production scripts
Brand and design-system references for The Sound of Essentials
Learning World
The SOE ecosystem is organized around seven learning lands and 15 hero characters, guided by Seriphia.

Harmonia: language and manners
Numeria: numbers and mathematics
Vitalis: physical and motor skills
Celestia: time and seasons
Luminosity: advanced language
Geometria: shapes and spatial reasoning
Terrasol: science and nature
The website currently supports English, Spanish, and French locale files in web/src/i18n/locales/.

Project Structure
.
|-- design-system/        # Brand and visual system references
|-- ebook/                # Picture Dictionary EPUB/PDF source and generated pages
|-- web/                  # React + Vite website
`-- workbook/             # Workbook source, generated pages, and production assets
The active website lives in web/.

Web App Structure
web/
|-- public/               # Static assets served directly by URL
|-- scripts/              # Content and Coda utility scripts
|-- src/
|   |-- assets/           # Media imported directly by React
|   |-- components/       # Reusable UI components
|   |-- data/             # Static product, hero, land, track, and gallery data
|   |-- hooks/            # Custom React hooks
|   |-- i18n/             # i18next config and locale JSON
|   |-- pages/            # Route-level pages
|   |-- remotion/         # Remotion video compositions
|   `-- utils/            # Shared helper functions
|-- index.html
|-- package.json
`-- vite.config.js
Website Routes
/
/universe
/heroes
/listen
/dictionary
/science
/mission
/join
/allies
/player
Legacy routes redirect as needed. For example, /characters redirects to /heroes, and /media redirects to /listen.

Getting Started
git clone https://github.com/ChefLee5/The-Sound-of-Essentials-Website.git
cd The-Sound-of-Essentials-Website/web
npm install
npm run dev
Local development starts on Vite's default port:

http://localhost:5173/SOE-Picture-Dictionary/
Web Commands
Run these from web/.

npm run dev      # Start the local Vite dev server
npm run build    # Create a production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
Deployment Notes
The web app is currently configured for GitHub Pages under the /SOE-Picture-Dictionary/ base path.

Vite base: /SOE-Picture-Dictionary/
React Router basename: /SOE-Picture-Dictionary
Vite config: web/vite.config.js
Router entry point: web/src/main.jsx
If the production repository name or GitHub Pages path changes, update both web/vite.config.js and web/src/main.jsx.

Asset Organization
Use web/public/ for files requested directly by URL. Existing public assets live primarily under web/public/assets/.

web/public/assets/
|-- backgrounds/
|-- book/
|-- characters/
|-- coloring-book/
|-- dictionary/
|-- duos/
|-- heroes/
|-- lands/
|-- marketing/
|-- media/
|-- scenes/
|-- shapes/
`-- track-art/
Use web/src/assets/ only for media imported directly by React.

Content Sources
Product metadata: web/src/data/products.json
Hero metadata: web/src/data/heroes.json
Land metadata: web/src/data/lands.json
Track metadata: web/src/data/tracks.json
Locale files: web/src/i18n/locales/
Ebook source markdown: ebook/content/
Workbook source JSON: workbook/workbook_content.json
Production Assets
The repository includes generated ebook and workbook assets alongside source data. Keep generated files in sync with their source files when changing the Picture Dictionary or workbook content.

Useful script entry points include:

ebook/generate_pages.py
ebook/build_epub.py
ebook/make_pdf.py
workbook/generate_workbook.py
Related Repository
The-Sound-of-Essentials-Eco-System|   `-- loops/
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
