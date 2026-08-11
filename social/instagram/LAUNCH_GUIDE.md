# Instagram launch guide — The Length Club

Everything in this folder gets the account live in ~15 minutes:

- `posts/` — 13 post-ready PNGs (profile picture + 9 posts, one of them a 3-slide carousel)
- `captions.md` — bio, captions and hashtags, copy-paste ready
- `templates/` + `generate.js` — the source; edit a template and re-render any image

## 1. Create the account

1. In the Instagram app: sign up with **hi@length.club**.
2. Handle: try **@thelengthclub** first. Fallbacks: `@thelengthclub.zurich`, `@lengthclub.zurich`, `@the.length.club`.
3. Upload `posts/profile.png` as the profile picture (it's designed for the circular crop).
4. Paste the name field, bio and link from `captions.md`.

## 2. Switch to a professional account

Settings → Account type → **Professional** → Business.
Category: *Health & wellness* (or *Gym/Physical Fitness Center*).
Add the contact button with **hi@length.club**. This unlocks insights and, later, the API for scheduled posting.

## 3. Post the launch grid

Post in **reverse order (post 9 first, post 1 last)** so the profile grid reads 1–9 from the top left. Captions are numbered in `captions.md`.

- **Post 5 is a carousel:** upload `05a-assess.png`, `05b-stretch.png`, `05c-progress.png` as one multi-image post.
- Two pacing options:
  - **Instant grid:** post all nine in one sitting (bottom row first: 9, 8, 7 … ending with 1). Best right before you start telling people about the account.
  - **Momentum:** post 9, 8, 7 on day one, then one per day. Nine days of daily content while the grid fills in.

## 4. After posting

- Share each post to **Stories** with a link sticker pointing at `https://length.club`.
- Reply to every early comment — the algorithm rewards it, and early followers are your founding members.
- Follow local Zürich fitness studios, physios, run clubs and gyms; engage genuinely from the brand account.

## Alternative: publish via API (`publish.js`)

Once the account exists and is switched to Professional, the whole grid can
be posted automatically:

1. Go to [developers.facebook.com](https://developers.facebook.com) → **My Apps → Create App** (type: Business/Other).
2. Add the **Instagram** product → *API setup with Instagram business login*.
3. Connect the @thelengthclub account and generate an access token
   (scopes: `instagram_business_basic`, `instagram_business_content_publish`).
4. Run:
   ```
   IG_ACCESS_TOKEN=IGAA... node social/instagram/publish.js --dry-run   # check auth + plan
   IG_ACCESS_TOKEN=IGAA... node social/instagram/publish.js             # post all 9
   ```
   `--only 9,8` posts a subset. Images are fetched from this repo's public
   GitHub URLs (override with `IMAGE_BASE_URL`).

Notes: the API can't create the account or set the profile picture/bio —
do that in the app first. Regenerate or revoke the token when done.

## 5. Keep it consistent

- Hashtags: use the block in `captions.md` (locality + niche). 5–10 per post.
- To make new posts, copy a template in `templates/`, change the text, and run:
  ```
  node social/instagram/generate.js
  ```
  Brand colors and type rules in `templates/ig.css` mirror `css/styles.css` — if the site brand changes, update both.

## ⚠️ If the handle isn't @thelengthclub

The site footer (`index.html`) links to `https://instagram.com/thelengthclub`. If you end up with a different handle, update that one URL.
