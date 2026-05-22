# SOE Picture Dictionary Web App

React + Vite website for The Sound of Essentials picture dictionary and Rhythm Quest ecosystem.

## Routes

- Home
- Universe
- Heroes
- Listen
- Dictionary
- Science
- Mission
- Join
- Allies

`/characters` redirects to `/heroes` for older links.

## Project Structure

```txt
web/
|-- public/               # Static web assets requested by URL
|-- src/
|   |-- assets/           # Media imported directly by React
|   |-- components/       # Reusable UI components
|   |-- data/             # Static structured app data
|   |-- hooks/            # Custom React hooks
|   |-- i18n/             # i18next config and locale JSON
|   |-- pages/            # Route-level page components
|   |-- remotion/         # Remotion video compositions
|   |-- utils/            # Shared helper functions
|   |-- App.jsx           # Root routes
|   `-- main.jsx          # Browser entry point
|-- index.html
|-- package.json
`-- vite.config.js
```

## Asset Organization

Use `public/` for files referenced by URL. New public assets should follow this shape where practical:

```txt
public/
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

Use `src/assets/` for files imported directly by React:

```txt
src/assets/
|-- heroes/
|-- lands/
|-- logos/
|-- textures/
`-- icons/
```

## Deployment

The app is currently configured for GitHub Pages under `/SOE-Picture-Dictionary/`.

- Vite base: `/SOE-Picture-Dictionary/`
- React Router basename: `/SOE-Picture-Dictionary`
- Dev URL: `http://localhost:5173/SOE-Picture-Dictionary/`

The Vite base is set in `vite.config.js`. The React Router basename is set in `src/main.jsx`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
