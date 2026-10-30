# The Length Club — Pre-Launch Site

Pre-launch landing page for **The Length Club**, an assisted stretching studio opening in Zürich. Static HTML/CSS/JS — no build step. Visitors can join the waitlist to get founding rates and the opening date.

## Connect the waitlist form (required before launch)

The form posts to [Formspree](https://formspree.io). Until it's connected, submissions show a "not connected" message.

1. Create a free account at [formspree.io](https://formspree.io) and add a new form.
2. Copy the form's ID (the 8-character code in the endpoint URL, e.g. `https://formspree.io/f/abcd1234`).
3. In `index.html`, replace `FORMSPREE_ID` with your ID:

   ```html
   <form ... action="https://formspree.io/f/abcd1234" method="POST">
   ```

Submissions then arrive in your Formspree dashboard and email inbox.

## Hosting & deployment

The site is served by GitHub Pages (**Settings → Pages → Source: "GitHub Actions"**). The `Deploy to GitHub Pages` workflow runs on every push to `main`.

## Custom domain: length.club

The domain is registered at Infomaniak. To connect it:

1. **DNS at Infomaniak** (Domain → DNS zone for `length.club`), add these records:

   | Type  | Name / Source | Target |
   |-------|---------------|--------|
   | A     | `@` (apex)    | `185.199.108.153` |
   | A     | `@` (apex)    | `185.199.109.153` |
   | A     | `@` (apex)    | `185.199.110.153` |
   | A     | `@` (apex)    | `185.199.111.153` |
   | CNAME | `www`         | `aboutali.github.io.` |

   Remove any conflicting default A/AAAA records Infomaniak put on `@` (e.g. a parking page or web redirect).

2. **GitHub**: repo **Settings → Pages → Custom domain** → enter `length.club` → Save. Wait for the DNS check to pass (can take up to an hour while DNS propagates), then tick **Enforce HTTPS**.

3. Done — the site serves at `https://length.club` and `www.length.club` redirects to it.

## Pilot booking page (/book/)

`https://length.club/book/` is a bilingual (DE/EN) page where employees of a pilot company scan a QR code from an office poster and request a stretch slot. It is not linked from the landing page and carries `noindex`. Requests go to the same Formspree form as the waitlist, marked with `form: pilot-booking`. Each request carries these fields: `_subject` ("Pilot booking – {company}"), `company`, `date`, `slot`, `lang`, `name`, `email`, `injury_ack` and `waitlist_optin`. The page collects no health details.

**Set up a new company:** edit `book/config.js` (every field has a comment) and commit.

| Field | Meaning |
|-------|---------|
| `open` | `true` shows the form. `false` shows "Booking is closed". |
| `company` | Name in the headline and the email subject. |
| `location` | Building, floor and room. |
| `slotMinutes` | Length of each slot. End times are calculated from it. |
| `days` | One entry per day: `date` (`YYYY-MM-DD`) and `slots` (start times, `"HH:MM"`). |

Change the company, dates and slot times in `book/config.js`. All page texts are in the `STRINGS` dictionary at the top of `book/book.js`.

**Limitation:** a static page cannot hide slots that others already took. Two people can request the same slot. The team confirms each request by email and offers another slot when needed. Set `open: false` once the day is full.

## Internal material

Outreach texts, print files, social media material and team scripts live in the private repo `aboutali/thelengthclub-internal`. Keep this repo limited to the website. The deploy workflow publishes only the files listed in `.github/workflows/deploy.yml`.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Languages and search engines

The page exists in English (`index.html`, `/`) and German (`de/index.html`, `/de/`). Keep both in step: a text change in one page needs the same change in the other.

- German follows `BRAND_VOICE.md` in the internal repo: du on the whole page, `ss` instead of `ß`, «quotes».
- Both pages link each other with `hreflang`. Google then shows each searcher the page in their language.
- `<html lang>` picks the form and menu messages in `js/main.js`.
- The hidden form field `lang` tells you which page a waitlist entry came from.
- Each page carries structured data (JSON-LD) for Google. Add the street address there once the studio has one.
- `sitemap.xml` lists both pages. Update `<lastmod>` after a larger text change.
- `robots.txt` allows all crawlers and points to the sitemap.

## Structure

```
index.html                   — the entire page (English)
de/index.html                — the entire page (German)
robots.txt                   — crawler rules and sitemap link
sitemap.xml                  — page list for Google Search Console
css/styles.css               — styles (brand tokens as CSS custom properties)
js/main.js                   — mobile nav, waitlist form, scroll reveal
img/                         — website photos (WebP, two widths each; credits below)
book/index.html              — pilot booking page (/book/)
book/config.js               — per-company settings for the booking page
book/book.js                 — booking page logic and DE/EN strings
book/book.css                — booking page additions to css/styles.css
favicon.svg                  — TLC favicon
og-image.png                 — link preview image (source: social/facebook in the internal repo)
.github/workflows/deploy.yml — GitHub Pages deployment
```

## Photo credits

The website photos in `img/` come from [Unsplash](https://unsplash.com) and are free under the [Unsplash License](https://unsplash.com/license). No Unsplash+ images. The people in them are stock models, not our practitioners or clients: never caption them as such. Replace them with our own photos as soon as we have them.

Each photo is cropped and exported in two widths, for example `who-run-600.webp` and `who-run-900.webp`.

| File | Photographer | Source |
|------|--------------|--------|
| `hero-main` | Annie Spratt | https://unsplash.com/photos/oQfSHQ2Uaic |
| `hero-small` | Vitaly Gariev | https://unsplash.com/photos/TLycVTiLFwY |
| `session` | Performance Medicine | https://unsplash.com/photos/KCLuRlZxITU |
| `who-desk` | Vitaly Gariev | https://unsplash.com/photos/SLx8Cz7MNBE |
| `who-run` | Sweet Life | https://unsplash.com/photos/ob3Jmh3r3KU |
| `who-sport` | Laura Lauch | https://unsplash.com/photos/ie1Az_w14FE |
| `who-busy` | Vitaly Gariev | https://unsplash.com/photos/iIND9RdVU7o |
| `who-travel` | Ged Mullen-Buick | https://unsplash.com/photos/OTELLziRE6M |
| `who-age` | Vitaly Gariev | https://unsplash.com/photos/VpGeuzRDYAo |
| `companies` | CoWomen | https://unsplash.com/photos/ZKHksse8tUU |

**Note on fonts:** the brand font is TT Commons (commercial license). The site currently uses the free Google Font [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) as a stand-in — swap it in `index.html` and `css/styles.css` once a TT Commons web license is available.
