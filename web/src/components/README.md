# Components

Reusable React UI belongs here.

## What Belongs Here

- Shared layout components such as `Navbar` and `Footer`
- Animation wrappers such as `AnimatedPage` and `SplashScreen`
- Reusable media and visual components
- Small UI pieces that can be used by more than one page

## Naming

Use PascalCase for component files.

```txt
Navbar.jsx
Footer.jsx
AnimatedPage.jsx
```

## What Does Not Belong Here

- Route-level pages; put those in `src/pages/`
- Static content data; put that in `src/data/`
- Translation files; put those in `src/i18n/`
- One-off code that only makes sense inside a single page

Keep components focused and pass page-specific content through props or data files.
