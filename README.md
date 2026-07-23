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

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html                   — the entire page
css/styles.css               — styles (brand tokens as CSS custom properties)
js/main.js                   — mobile nav, waitlist form, scroll reveal
favicon.svg                  — TLC favicon
.github/workflows/deploy.yml — GitHub Pages deployment
```

**Note on fonts:** the brand font is TT Commons (commercial license). The site currently uses the free Google Font [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) as a stand-in — swap it in `index.html` and `css/styles.css` once a TT Commons web license is available.
