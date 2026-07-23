# The Length Club — project context

Pre-launch website for **The Length Club (TLC)**, an assisted stretching studio opening in Zürich in 2026. The site's job right now is to collect waitlist interest before opening. Live at **https://length.club**.

## Stack & files

Plain static HTML/CSS/JS — **no build step, no frameworks**. Keep it that way until the site goes multi-page (then Astro is the agreed upgrade path).

```
index.html                   — the entire page (hero, statement band, benefits,
                               approach, who-it's-for, membership preview, studio,
                               waitlist form, FAQ, footer)
css/styles.css               — all styles; brand tokens as CSS custom properties in :root
js/main.js                   — mobile nav toggle, waitlist form fetch submit, scroll reveal
favicon.svg                  — TLC circle mark
.github/workflows/deploy.yml — GitHub Pages deploy, runs on every push to main
```

Preview locally: `python3 -m http.server 8000`.

## Brand rules (from the brand board)

- Colors (already in `:root`): ink `#141414`, cream `#F1EBE1`, orange `#E4502A`, lilac `#BFA8E8`, pink `#F2A0B4`, amber `#DE8B2D` (amber for small accents only, never body text on cream).
- Font: **Hanken Grotesk** (Google Fonts) is a free stand-in for the licensed brand font **TT Commons** — swap when a web license exists. Tight tracking: headlines `-0.03em`, body `-0.01em`.
- Graphic language: concentric circle rings, thick arcs/half-donuts, geometric flower (6 rotated ellipses), pill-shaped buttons (`border-radius: 999px`). All decoration is inline SVG with `currentColor`.
- **No photos** — none are licensed. Use brand-colored tiles + SVG motifs. Do not hotlink stock images.
- Sections alternate cream / orange / black / lilac backgrounds.
- Copy voice: short declarative statements ("Stretch further. Live better." / "Move better. Live better.").

## Infrastructure facts

- **Domain**: `length.club`, registered at Infomaniak. Apex A records → GitHub Pages (`185.199.108.153` … `185.199.111.153`), `www` CNAME → `aboutali.github.io.`. The Infomaniak "Starter website" product was detached from the domain (it locks DNS if re-attached). Mail records (MX/SPF/DMARC → Infomaniak) must stay untouched.
- **Hosting**: GitHub Pages, repo `aboutali/thelengthclub`, Source "GitHub Actions", custom domain `length.club`, HTTPS cert issued.
- **Contact email**: `hi@length.club` (Infomaniak mailbox) — used in footer, form error copy, and for external accounts.
- **Waitlist form**: posts to Formspree `https://formspree.io/f/mjgnenzb`; JS submits via fetch with JSON accept header, honeypot field `_gotcha`. Works without JS as a native POST.

## Content constraints

- **No prices, no street address, no exact opening date** anywhere — none are decided. "Opening 2026" / "opening soon" is the ceiling. Membership cards say "Founding rates announced at launch".
- English only for now; German version is a later possibility.

## Roadmap (agreed with owner, not yet built)

- `/links` self-hosted link-in-bio page for Instagram (same brand style).
- Cookieless analytics: Cloudflare Web Analytics or Plausible (no cookie banner needed).
- OG share image for social link previews.
- Waitlist migration/sync to MailerLite for launch campaigns.
- Bookings at launch via Eversports or bsport (do not build booking in-house).
