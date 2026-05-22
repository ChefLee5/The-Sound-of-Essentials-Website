# Pages

Route-level page components belong here.

## What Belongs Here

- Top-level pages mounted from `App.jsx`
- Page-specific CSS files
- Route-only helper components that are not reused elsewhere

## Naming

Use PascalCase for page components.

```txt
Home.jsx
Heroes.jsx
DictionarySale.jsx
Listen.jsx
```

Keep paired CSS next to the page when it is only used by that route.

## What Does Not Belong Here

- Shared layout, media, or UI components
- Static data shared by multiple routes
- Global utilities

Move reusable UI to `src/components/`, shared data to `src/data/`, and shared helpers to `src/utils/`.
