# Corporate print collateral — office pilot

Print pieces for the office stretching pilot with larger Zürich companies.
Six files, each in German and English. Same brand tokens and Hanken Grotesk as
the Instagram templates (`social/instagram/templates/ig.css`).

| Piece | Format | Audience | Files |
| --- | --- | --- | --- |
| Pilot one-pager | A4 portrait, 1 page | HR / people / workplace health (DE uses "Sie") | `onepager-de`, `onepager-en` |
| Office poster | A3 portrait, 1 page | Employees (DE uses "du") | `poster-de`, `poster-en` |
| Take-home card | A6 portrait, 2 pages (front, back) | Employees (DE uses "du") | `card-de`, `card-en` |

## Layout of this folder

```
corporate/print/
  generate.js          renders everything (PDF + PNG preview + QR SVGs)
  verify.py            optional check of the finished PDFs (size, QR decode)
  package.json         dependencies: qrcode, pdf-lib
  templates/
    print.css          shared tokens, @font-face, page classes
    fonts/             Hanken Grotesk woff2 (copied from the Instagram templates)
    onepager-{de,en}.html   poster-{de,en}.html   card-{de,en}.html
    qr/book.svg        QR for https://length.club/book/  (generated)
    qr/home.svg        QR for https://length.club        (generated)
  pdf/                 print-ready PDFs, exact page size, backgrounds on
  preview/             PNG previews (card has -front and -back)
```

## Re-render

```bash
cd corporate/print && npm install     # once: qrcode, pdf-lib
node corporate/print/generate.js      # from the repo root; renders all 6 templates x 2 languages
node corporate/print/generate.js poster   # only files whose name contains "poster"
```

Needs Playwright with Chromium (local install or global, same as
`social/instagram/generate.js`). Each run also rewrites the QR SVGs from the
URLs at the top of `generate.js` (`QR_CODES`). To change a QR target, edit it
there, and change the printed URL text in the templates too.

Optional check of the result: `pip install pymupdf zxing-cpp pillow`, then
`python3 corporate/print/verify.py`.

## Edit the poster placeholders

Open `templates/poster-de.html` (or `poster-en.html`) and find the comment
`EDIT HERE`. The line below it is the date/time/room pill:

```html
<p class="when" id="when">[Datum] · [Zeit] · [Raum]</p>
```

Replace the text inside the tag, for example
`Di 14. Oktober · 12:00–15:00 · Raum 3.02`, then run `node corporate/print/generate.js poster`.
Keep it to one line of about 40 characters; the pill grows with the text and
the layout leaves room for that. Text sizes are set in `.when` in the same
file.

## Notes

- Page sizes are exact (A4 210x297 mm, A3 297x420 mm, A6 105x148 mm). Chromium
  rounds PDF pages up to whole pixels, so `generate.js` trims the PDF boxes back
  to the exact size afterwards.
- No bleed. Backgrounds and ring motifs run to the page edge. A desktop printer
  leaves a white margin there; a print shop needs a bleed added (or ask for
  "fit to page with margin").
- All text sits at least 8 mm from the page edge. Body text is 10 pt or more on
  A4 and 8 pt or more on A6.
- Fonts are embedded by Chromium as Type 3 (variable font). They print fine, but
  a print shop preflight may prefer TrueType/OpenType.
- Vocabulary: EN "practitioner", DE "Stretching-Coach". German uses Swiss
  spelling ("ss", never the sharp s). "Betriebliches Gesundheitsmanagement (BGM)"
  appears in the German one-pager only.
- The desk stretches on the card are numbered items. Line-drawn pictograms were
  tried and dropped; they did not reach an acceptable quality.
