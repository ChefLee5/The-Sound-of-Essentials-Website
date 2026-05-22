# i18n

Internationalization setup and locale files belong here.

## What Belongs Here

- `config.js` for i18next setup
- Locale JSON files in `locales/`
- Translation keys for visible UI text

## Naming

Use BCP 47 language tags for locale files.

```txt
locales/en.json
locales/es.json
locales/fr.json
```

Use dotted, feature-based keys in components.

```js
t('navbar.heroes')
t('media.audio_title_1')
```

## What Does Not Belong Here

- Static data that does not need translation
- Component logic
- Large content files better managed in `src/data/`

Avoid hardcoding visible text in components when the text appears in the app UI.
