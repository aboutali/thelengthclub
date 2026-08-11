#!/usr/bin/env node
/**
 * Renders the Instagram templates in ./templates to PNGs in ./posts
 * using Playwright + Chromium.
 *
 * Usage: node social/instagram/generate.js
 *
 * Requires playwright (any recent version). If it isn't installed
 * locally, install with:  npm i playwright
 */

const fs = require('fs');
const path = require('path');

function loadChromium() {
  try {
    return require('playwright').chromium;
  } catch (err) {
    // Fall back to a global install (e.g. /opt/node22/lib/node_modules)
    const { execSync } = require('child_process');
    const globalRoot = execSync('npm root -g').toString().trim();
    return require(path.join(globalRoot, 'playwright')).chromium;
  }
}

const PORTRAIT = { width: 1080, height: 1350 };
const SQUARE = { width: 1080, height: 1080 };

const jobs = [
  { file: 'profile.html', size: SQUARE, out: 'profile.png' },
  { file: '01-announce.html', size: PORTRAIT, out: '01-announce.png' },
  { file: '02-tagline.html', size: PORTRAIT, out: '02-tagline.png' },
  { file: '03-basics.html', size: PORTRAIT, out: '03-basics.png' },
  { file: '04-desk.html', size: PORTRAIT, out: '04-desk.png' },
  { file: '05a-assess.html', size: PORTRAIT, out: '05a-assess.png' },
  { file: '05b-stretch.html', size: PORTRAIT, out: '05b-stretch.png' },
  { file: '05c-progress.html', size: PORTRAIT, out: '05c-progress.png' },
  { file: '06-everybody.html', size: PORTRAIT, out: '06-everybody.png' },
  { file: '07-zurich.html', size: PORTRAIT, out: '07-zurich.png' },
  { file: '08-membership.html', size: PORTRAIT, out: '08-membership.png' },
  { file: '09-waitlist.html', size: PORTRAIT, out: '09-waitlist.png' },
];

(async () => {
  const chromium = loadChromium();
  const outDir = path.join(__dirname, 'posts');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const job of jobs) {
    await page.setViewportSize(job.size);
    await page.goto('file://' + path.join(__dirname, 'templates', job.file));
    // Wait for Hanken Grotesk (Google Fonts); fallback stack renders if offline.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, job.out) });
    console.log('rendered', job.out, `(${job.size.width}x${job.size.height})`);
  }

  await browser.close();
})();
