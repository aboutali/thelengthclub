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

## Infomaniak MCP servers (Claude Code)

`.mcp.json` connects Claude Code to the Infomaniak suite through the official [Infomaniak MCP servers](https://github.com/orgs/Infomaniak/repositories?q=mcp). All five servers share one Infomaniak API token. Claude Code reads the token from an environment variable. Never commit the token.

| Server     | Infomaniak service | npm package                       |
|------------|--------------------|-----------------------------------|
| `kdrive`   | kDrive             | `@infomaniak/mcp-server-kdrive`   |
| `mail`     | Mail               | `@infomaniak/mcp-server-mail`     |
| `calendar` | Calendar           | `@infomaniak/mcp-server-calendar` |
| `contact`  | Contacts           | `@infomaniak/mcp-server-contact`  |
| `kchat`    | kChat              | `@infomaniak/mcp-server-kchat`    |

Claude Code needs three environment variables:

| Variable            | Value                                                        |
|---------------------|--------------------------------------------------------------|
| `INFOMANIAK_TOKEN`  | The API token.                                               |
| `KDRIVE_ID`         | The number after `/drive/` in the kDrive web app URL.        |
| `KCHAT_TEAM_NAME`   | The unique team name in the kChat URL.                       |

1. Create one token in the Infomaniak Manager under **API token**.
2. Give the token these scopes: `drive`, `workspace:mail`, `workspace:calendar`, `user_info`, `contacts`, `kchat`.
3. Set the variables:
   - **Local:** export them in your shell profile, e.g. `export INFOMANIAK_TOKEN=…`.
   - **Claude Code on the web:** add them in the cloud environment settings (environment menu → Edit → environment variables).
4. Start Claude Code in this folder and approve the project servers. Check the status with `/mcp`.

A leaked token opens all five services. Revoke it in the Infomaniak Manager if that happens.

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
book/index.html              — pilot booking page (/book/)
book/config.js               — per-company settings for the booking page
book/book.js                 — booking page logic and DE/EN strings
book/book.css                — booking page additions to css/styles.css
favicon.svg                  — TLC favicon
.mcp.json                    — Infomaniak MCP servers for Claude Code
.github/workflows/deploy.yml — GitHub Pages deployment
```

**Note on fonts:** the brand font is TT Commons (commercial license). The site currently uses the free Google Font [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) as a stand-in — swap it in `index.html` and `css/styles.css` once a TT Commons web license is available.
