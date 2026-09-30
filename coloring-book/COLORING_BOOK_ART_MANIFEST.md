# Coloring Book — Art Manifest

40 landscape US-Letter sheets: cover, parent intro, 38 coloring plates.

## Where the art lives

**Masters are not stored here.** They live with the website, tracked in git:

```
web/public/assets/coloring-book/
├── CB_*.png                    38 line-art plates, 5504×3072
└── cover-seriphia-land.jpg     cover illustration
```

One master feeds both the website and this book, so a redrawn plate propagates
everywhere. Never copy them into `coloring-book/` — that is how the two drift.

`art_print/` is **derived** (gitignored): `make_coloring_book_pdf.py` stages the
masters into it as 2600px JPEGs. The art box on an 11×8.5in sheet is ~9.4in
wide, so 2600px is ~277 dpi printed, past what a home printer resolves. Unscaled,
38 masters is ~197 MB, which no browser will lay out — staged, it is ~26 MB.

## Plate order

| # | Title | Master |
|---|-------|--------|
| 01 | Hear the call | `CB_Hearthecall.png` |
| 02 | Seriphia calls | `CB_Seriphiacall.png` |
| 03 | Step onto the path | `CB_Path.png` |
| 04 | The long road | `CB_WordPath.png` |
| 05 | Alphabet jump | `CB_ABCjum.png` |
| 06 | Shapes ahead | `CB_Shapes.png` |
| 07 | Into Numeria | `CB_Numeria.png` |
| 08 | Stepping stones | `CB_Stones.png` |
| 09 | Over the hill | `CB_Hill.png` |
| 10 | A game of tag | `CB_Tag.png` |
| 11 | Take a big breath | `CB_Breath.png` |
| 12 | Listen close | `CB_Hear2.png` |
| 13 | Look how far | `CB_lookhowfar.png` |
| 14 | In the orchard | `CB_Orchard.png` |
| 15 | Field of tulips | `CB_Tulips.png` |
| 16 | Flower crowns | `CB_Flowercrown.png` |
| 17 | An apple for the pony | `CB_Ponyapple.png` |
| 18 | Out to pasture | `CB_Pasture.png` |
| 19 | A horse runs free | `CB_Horse.png` |
| 20 | A friendly hello | `CB_Pethorse.png` |
| 21 | Brushing time | `CB_Brushhorse.png` |
| 22 | Time to rest | `CB_Ponysleep.png` |
| 23 | Le cheval | `CB_LeCheval.png` |
| 24 | Oink! | `CB_Oink.png` |
| 25 | Lunch together | `CB_lunch.png` |
| 26 | Little boats | `CB_Boats.png` |
| 27 | At the water | `CB_water.png` |
| 28 | Aquaria | `CB_Aquaria.png` |
| 29 | Sunset on the shore | `CB_WaveSunset.png` |
| 30 | Terrasol farm | `CB_Terrasol.png` |
| 31 | Keep on learning | `CB_Keeponlearning.png` |
| 32 | Friends of Aquaria | `CB_AquariaDuo.png` |
| 33 | Friends of Celestia | `CB_CelestiaDuo.png` |
| 34 | Friends of Harmonia | `CB_HarmoniaDuo.png` |
| 35 | Friends of Luminosity | `CB_Luminosity Duo.png` |
| 36 | Friends of Terrasol | `CB_TerrasolDuo.png` |
| 37 | Friends of Vitalis | `CB_VitalisDuo.png` |
| 38 | You did it! | `CB_Congrats.png` |

Titles and prompts are authored in `coloring_book_content.json`. Adding a plate
means adding its master to `web/public/assets/coloring-book/` and an entry to
that file — `generate_coloring_book.py --check` fails the build if a referenced
master is missing or the numbering has a gap.

## Origin

Implements the Claude Design document `Rhythm Quest Coloring Book.dc.html`
(project `9a5fbc61-790e-4eae-a8d5-08fb78dd9350`). The design's three props —
palette, page style, page mood — are reproduced exactly. **Ink saver is a local
addition**, not part of the source design.

## Open decision: how far should Ink saver go?

A parent printing all 38 plates at home is the common case, and the page chrome
costs colour ink on every sheet. `[data-ink="saver"]` at the bottom of
`styles/coloring-book.css` currently strips the frame, lightens the footer, and
drops the title, page number and star to `#333`.

That is a defensible default, not a settled one. The question is how much of the
brand must survive an ink-saving print:

- **Keep the accent star and page number coloured.** Small, nearly free, and
  keeps the sheet recognisably SOE.
- **Go fully black.** Cleanest on a mono printer, and a child colouring the page
  will not notice — but a stack of finished pages loses its identity.
- **Drop the footer entirely** rather than lightening it. Saves the most, at the
  cost of the name/date line that makes a finished page feel owned.

The rules are isolated in the last block of the stylesheet and nothing else
depends on them.
