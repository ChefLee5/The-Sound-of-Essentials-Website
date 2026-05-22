# Public Assets

Files in this folder are served directly by Vite and the browser.

## What Belongs Here

- Images, audio, video, fonts, and other static files referenced by URL
- `404.html` and other deployment support files
- `sitemap.xml`, favicons, and public metadata files

## Current Structure

Most existing assets live under `assets/`:

```txt
assets/
|-- characters/
|-- heroes/
|-- lands/
|-- dictionary/
|-- track-art/
|-- book/
|-- scenes/
`-- marketing/
```

Keep existing paths stable unless the app references are updated in the same change.

## What Does Not Belong Here

- React components
- Source-only assets imported by JavaScript
- Generated build output from `npm run build`

Use `src/assets/` for media that must be bundled by React imports.
