# 🎵 SOE: Rhythm Quest — Website

**The Sound of Essentials: Rhythm Quest companion web app.**
A multilingual, music-driven educational experience built with React + Vite.
Designed for the developing brain — not the algorithm.

---

## What This Is

The SOE: Rhythm Quest website is the public-facing hub for the Sound of Essentials universe. It introduces learners, parents, and educators to the world of Rhythm Quest — its 7 themed Lands, 14 original characters, the science behind the curriculum, and the multimedia resources that power the learning experience.

By the numbers:

- 🌍 **7 Lands** spanning language, math, science, travel, health, community, and time
- 🧑‍🤝‍🧑 **14 characters** (+ Seriphia, the hidden Easter-egg guide)
- 🌐 **3 languages** — English, Spanish, and French (full i18n)
- 📄 **8 pages** — Home, Universe, Heroes, Mission, Science, Media Room, Dictionary, Join the Quest
- 🎬 **Cinematic splash screen** with particle effects and audio visualizer
- 📱 **Fully responsive** — mobile-first with smooth page transitions

---

## The 7 Lands

| Land | Theme | Characters |
|------|-------|------------|
| 🎵 **Harmonia** | Language, Culture & Daily Life | Kenji & Aiko |
| 🔢 **Numeria** | Math, Numbers & Money | Silas & Vesta |
| 🌿 **TerraSol** | Nature, Science & Environment | Felix & Amara |
| 🌊 **Aquaria** | Travel, Transportation & World | Ezra & Athena |
| 💪 **Vitalis** | Health, Body & Wellness | Kwame & Octavia |
| 📚 **Sophia** | Community, Work & Life Skills | Marcus & Elena |
| 🔭 **Celestia** | Time, Space & The Universe | Elias & Selene |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router 7 |
| Animation | Framer Motion · Anime.js |
| 3D | Spline |
| i18n | i18next + browser language detection |
| Video | Remotion player |
| Styling | Vanilla CSS with custom design tokens |

---

## Project Structure

```
web/
├── public/              # Static assets (images, fonts, favicons)
├── src/
│   ├── assets/          # Imported media (logos, textures, characters)
│   ├── components/      # Reusable UI (Navbar, Footer, SplashScreen…)
│   ├── data/            # Static data files
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # i18n config + locale JSON (en · es · fr)
│   ├── pages/           # Route-level page components
│   │   └── Dictionary/  # Interactive picture dictionary browser
│   ├── remotion/        # Remotion video compositions
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Root app with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global design system & tokens
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

```bash
git clone https://github.com/ChefLee5/SOE-Website.git
cd SOE-Website/web
npm install
npm run dev
```

Opens at `http://localhost:5173/SOE-Website/`

---

## Related Repositories

| Repository | Description |
|------------|-------------|
| [SOE-Picture-Dictionary](https://github.com/ChefLee5/SOE-Picture-Dictionary) | EPUB picture dictionary — 157 scenes, 4,232 words |
| [The-Sound-of-Essentials-Eco-System](https://github.com/ChefLee5/The-Sound-of-Essentials-Eco-System) | Broader SOE ecosystem and tooling |

---

© 2026 The Sound of Essentials. All rights reserved.
