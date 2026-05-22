# Assets

This folder is for media that React imports directly.

## What Belongs Here

- Hero art used through `import` statements
- Land or world imagery bundled into components
- Logos and brand marks imported by React
- Texture files for visual components
- SVG icons that are part of the source bundle

## Naming

Use lowercase kebab-case for files and folders.

```txt
heroes/kenji-profile.png
lands/harmonia-background.webp
logos/soe-logo-gold.svg
icons/play-button.svg
```

## What Does Not Belong Here

- Large audio or video files
- Downloadable files
- Favicons and web app icons
- Static assets referenced by URL
- Generated build output

Use `web/public/` for files the browser should request directly by URL.
