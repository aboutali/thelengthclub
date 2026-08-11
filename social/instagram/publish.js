#!/usr/bin/env node
/**
 * Publishes the launch grid to Instagram via the Content Publishing API
 * (Instagram API with Instagram Login — professional account required).
 *
 * Usage:
 *   IG_ACCESS_TOKEN=IGAA... node social/instagram/publish.js [--dry-run] [--only 9,8]
 *
 * Env:
 *   IG_ACCESS_TOKEN   required — token with instagram_business_basic +
 *                     instagram_business_content_publish scopes
 *   IMAGE_BASE_URL    optional — public base URL for the PNGs; defaults to
 *                     this repo's raw GitHub URL on the Instagram branch
 *
 * Posts in reverse grid order (9 → 1) so the profile grid reads 1–9.
 * Captions mirror captions.md — keep the two in sync.
 */

const API = 'https://graph.instagram.com/v23.0';
const TOKEN = process.env.IG_ACCESS_TOKEN;
const BASE =
  process.env.IMAGE_BASE_URL ||
  'https://raw.githubusercontent.com/aboutali/thelengthclub/claude/length-club-instagram-zjdvod/social/instagram/posts';

const HASHTAGS =
  '#assistedstretching #stretching #mobility #flexibility #stretchtherapy #recovery #zurich #zürich #zurichfitness #thelengthclub';

// In posting order. `images.length > 1` → carousel.
const POSTS = [
  {
    id: 9,
    images: ['09-waitlist.png'],
    caption: `Be first in line.\n\nThe doors open in 2026. The waitlist is open now. Join at length.club (link in bio) for founding-member pricing and the opening date before anyone else.\n\n${HASHTAGS}`,
  },
  {
    id: 8,
    images: ['08-membership.png'],
    caption: `Founding memberships. Limited at launch.\n\nPrivate sessions, weekly memberships, and Duo for stretch buddies. Founding members get the best rate we will ever offer — and it's waitlist-only.\n\nlength.club (link in bio)\n\n${HASHTAGS}`,
  },
  {
    id: 7,
    images: ['07-zurich.png'],
    caption: `We're building The Length Club right here in Zürich.\n\nCentral location, easy to reach, opening 2026. Studio reveal coming soon — locals on the waitlist hear everything first.\n\nlength.club (link in bio)\n\n${HASHTAGS}`,
  },
  {
    id: 6,
    images: ['06-everybody.png'],
    caption: `Made for every body.\n\nRunners, lifters, new parents, desk athletes, the chronically stiff and the formerly bendy. You don't need to be flexible to come here — that's the point.\n\n${HASHTAGS}`,
  },
  {
    id: 5,
    images: ['05a-assess.png', '05b-stretch.png', '05c-progress.png'],
    caption: `Science-led. Human touch.\n\nEvery session starts with an assessment, moves through practitioner-led stretching, and ends with a plan you can measure.\n\nSwipe to see the method →\n\n${HASHTAGS}`,
  },
  {
    id: 4,
    images: ['04-desk.png'],
    caption: `Undo the desk day.\n\nHours at a screen shorten hips, round shoulders and stiffen necks. A 50-minute assisted stretch is the reset button.\n\nZürich desk workers — this one's for you.\n\n${HASHTAGS}`,
  },
  {
    id: 3,
    images: ['03-basics.png'],
    caption: `Stretching, done with you — not to you.\n\nAssisted stretching means a trained practitioner moves you through deeper, safer ranges than you can reach alone. You breathe, we do the work. Your body gets the length.\n\n${HASHTAGS}`,
  },
  {
    id: 2,
    images: ['02-tagline.png'],
    caption: `Stretch further. Live better.\n\nFlexibility isn't a party trick. It's how you keep doing the things you love — for longer. That's the whole idea behind The Length Club.\n\nWaitlist open at length.club (link in bio).\n\n${HASHTAGS}`,
  },
  {
    id: 1,
    images: ['01-announce.png'],
    caption: `Zürich, meet The Length Club.\n\nA new assisted-stretching studio opening in 2026 — one-on-one, practitioner-led stretching that helps you move better and live better.\n\nFollow along as we build the studio. Waitlist is open at length.club (link in bio).\n\n${HASHTAGS}`,
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, params = {}, method = 'GET') {
  const url = new URL(`${API}/${path}`);
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  let res;
  if (method === 'GET') {
    url.search = body;
    res = await fetch(url);
  } else {
    res = await fetch(url, { method, body });
  }
  const json = await res.json();
  if (json.error) {
    throw new Error(`${path}: ${json.error.message} (code ${json.error.code}${json.error.error_subcode ? '/' + json.error.error_subcode : ''})`);
  }
  return json;
}

async function waitForContainer(id) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await api(id, { fields: 'status_code' });
    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR') throw new Error(`container ${id} failed processing`);
    await sleep(2000);
  }
  throw new Error(`container ${id} not ready after 60s`);
}

async function publishPost(post) {
  let creationId;
  if (post.images.length === 1) {
    const { id } = await api('me/media', {
      image_url: `${BASE}/${post.images[0]}`,
      caption: post.caption,
    }, 'POST');
    creationId = id;
  } else {
    const children = [];
    for (const img of post.images) {
      const { id } = await api('me/media', {
        image_url: `${BASE}/${img}`,
        is_carousel_item: 'true',
      }, 'POST');
      children.push(id);
    }
    for (const c of children) await waitForContainer(c);
    const { id } = await api('me/media', {
      media_type: 'CAROUSEL',
      children: children.join(','),
      caption: post.caption,
    }, 'POST');
    creationId = id;
  }
  await waitForContainer(creationId);
  const { id: mediaId } = await api('me/media_publish', { creation_id: creationId }, 'POST');
  return mediaId;
}

(async () => {
  if (!TOKEN) {
    console.error('Set IG_ACCESS_TOKEN. See LAUNCH_GUIDE.md.');
    process.exit(1);
  }
  const dryRun = process.argv.includes('--dry-run');
  const onlyArg = process.argv.find((a, i) => process.argv[i - 1] === '--only');
  const only = onlyArg ? onlyArg.split(',').map(Number) : null;

  const me = await api('me', { fields: 'user_id,username,account_type' });
  console.log(`Authenticated as @${me.username} (${me.account_type})`);

  const queue = POSTS.filter((p) => !only || only.includes(p.id));
  console.log(`Publishing ${queue.length} post(s): ${queue.map((p) => p.id).join(', ')}`);

  for (const post of queue) {
    if (dryRun) {
      console.log(`[dry-run] post ${post.id}: ${post.images.join(' + ')}`);
      continue;
    }
    process.stdout.write(`post ${post.id} (${post.images.join(' + ')})… `);
    const mediaId = await publishPost(post);
    console.log(`published (media id ${mediaId})`);
    await sleep(5000); // be gentle between posts
  }
  console.log('Done.');
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
