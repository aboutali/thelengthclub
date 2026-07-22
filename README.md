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

## Go live on GitHub Pages

1. Merge this branch into `main`.
2. In the repo: **Settings → Pages → Source: "GitHub Actions"**.
3. The `Deploy to GitHub Pages` workflow runs on every push to `main` and publishes the site at `https://<username>.github.io/thelengthclub/`.

### Custom domain (later)

In **Settings → Pages**, add your custom domain (e.g. `thelengthclub.com`) and follow GitHub's DNS instructions. GitHub creates a `CNAME` file automatically.

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
