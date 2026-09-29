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

## Infomaniak MCP servers (Claude Code)

`.mcp.json` connects Claude Code to the Infomaniak suite through the official [Infomaniak MCP servers](https://github.com/orgs/Infomaniak/repositories?q=mcp). Claude Code reads the tokens from environment variables. Never commit a token.

| Server     | npm package                       | Environment variables             | Token scopes                   |
|------------|-----------------------------------|-----------------------------------|--------------------------------|
| `kdrive`   | `@infomaniak/mcp-server-kdrive`   | `KDRIVE_TOKEN`, `KDRIVE_ID`       | `drive`                        |
| `mail`     | `@infomaniak/mcp-server-mail`     | `MAIL_TOKEN`                      | `workspace:mail`               |
| `calendar` | `@infomaniak/mcp-server-calendar` | `CALENDAR_TOKEN`                  | `workspace:calendar user_info` |
| `contact`  | `@infomaniak/mcp-server-contact`  | `CONTACT_TOKEN`                   | `contacts`                     |
| `kchat`    | `@infomaniak/mcp-server-kchat`    | `KCHAT_TOKEN`, `KCHAT_TEAM_NAME`  | `kchat`                        |

1. Create one token per server in the Infomaniak Manager under **API token**. Select only the scopes from the table.
2. Take `KDRIVE_ID` from the kDrive web app URL. It is the number after `/drive/`.
3. Take `KCHAT_TEAM_NAME` from the kChat URL. It is the unique team name in the address.
4. Set the variables:
   - **Local:** export them in your shell profile, e.g. `export KDRIVE_TOKEN=…`.
   - **Claude Code on the web:** add them in the cloud environment settings (environment menu → Edit → environment variables).
5. Start Claude Code in this folder and approve the project servers. Check the status with `/mcp`.

Claude Code reports an error for a server with an unset variable. The other servers still run.

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
.mcp.json                    — Infomaniak MCP servers for Claude Code
.github/workflows/deploy.yml — GitHub Pages deployment
```

**Note on fonts:** the brand font is TT Commons (commercial license). The site currently uses the free Google Font [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) as a stand-in — swap it in `index.html` and `css/styles.css` once a TT Commons web license is available.
