# Remotion

Remotion video compositions and video-only helpers belong here.

## What Belongs Here

- Video composition components
- Timed animation sequences for generated videos
- Video-specific layout, copy, and metadata

## Naming

Use PascalCase for composition files.

```txt
SOETrailer.jsx
LyricVideo.jsx
HeroTeaser.jsx
```

## What Does Not Belong Here

- Website route pages
- Shared app components
- Static assets that should live in `web/public/`
- Build output or rendered video files

If a component is used by both the web app and a video, put the shared piece in `src/components/`.
