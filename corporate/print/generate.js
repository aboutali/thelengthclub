#!/usr/bin/env node
/**
 * Renders the print templates in ./templates to PDF (exact page size,
 * backgrounds on) in ./pdf, plus PNG previews in ./preview, using
 * Playwright + Chromium. Also (re)generates the QR code SVGs in
 * ./templates/qr from the URLs below.
 *
 * Usage:
 *   node corporate/print/generate.js            # everything
 *   node corporate/print/generate.js poster     # only files whose name contains "poster"
 *
 * Needs: playwright (local or global install) and, once, `npm i` in
 * corporate/print/ for the `qrcode` package.
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

const QRCode = require('qrcode');
const { PDFDocument } = require('pdf-lib');

const MM_TO_PT = 72 / 25.4;

// ---- Page sizes (mm) -------------------------------------------------
const A4 = { w: 210, h: 297 };
const A3 = { w: 297, h: 420 };
const A6 = { w: 105, h: 148 };

// ---- QR codes --------------------------------------------------------
// file name in templates/qr  ->  payload encoded in the code
const QR_CODES = {
  'book.svg': 'https://length.club/book/', // poster
  'home.svg': 'https://length.club',       // take-home card
};

// ---- Render jobs -----------------------------------------------------
// pages: preview name suffixes, one per .page element in the template
const jobs = [];
for (const lang of ['de', 'en']) {
  jobs.push({ base: `onepager-${lang}`, size: A4, pages: [''] });
  jobs.push({ base: `poster-${lang}`, size: A3, pages: [''] });
  jobs.push({ base: `card-${lang}`, size: A6, pages: ['-front', '-back'] });
}

const MM_TO_PX = 96 / 25.4;


// Chromium rounds the PDF page up to whole CSS pixels (e.g. A6 becomes
// 105.2 x 148.2 mm). Cut the boxes back to the exact size, anchored at
// the top-left where the content starts.
async function trimToExactSize(file, wMm, hMm) {
  const doc = await PDFDocument.load(fs.readFileSync(file));
  const wPt = wMm * MM_TO_PT;
  const hPt = hMm * MM_TO_PT;
  for (const pg of doc.getPages()) {
    const { height } = pg.getSize();
    pg.setMediaBox(0, height - hPt, wPt, hPt);
    pg.setCropBox(0, height - hPt, wPt, hPt);
    pg.setBleedBox(0, height - hPt, wPt, hPt);
    pg.setTrimBox(0, height - hPt, wPt, hPt);
  }
  fs.writeFileSync(file, await doc.save());
}

async function writeQrCodes(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [file, url] of Object.entries(QR_CODES)) {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 0, // the quiet zone is created by the padding of the surrounding box
      color: { dark: '#141414', light: '#0000' },
    });
    fs.writeFileSync(path.join(dir, file), svg);
    console.log('qr', file, '->', url);
  }
}

(async () => {
  const filter = process.argv[2];
  const tplDir = path.join(__dirname, 'templates');
  const pdfDir = path.join(__dirname, 'pdf');
  const prevDir = path.join(__dirname, 'preview');
  fs.mkdirSync(pdfDir, { recursive: true });
  fs.mkdirSync(prevDir, { recursive: true });

  await writeQrCodes(path.join(tplDir, 'qr'));

  const chromium = loadChromium();
  const browser = await chromium.launch();

  for (const job of jobs) {
    if (filter && !job.base.includes(filter)) continue;
    const { w, h } = job.size;
    const wPx = Math.round(w * MM_TO_PX);
    const hPx = Math.round(h * MM_TO_PX);
    // Preview scale: long edge about 2400 px
    const scale = Math.min(4, 2400 / hPx);

    const ctx = await browser.newContext({
      viewport: { width: wPx, height: hPx },
      deviceScaleFactor: scale,
    });
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(tplDir, job.base + '.html'));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);

    // Overflow check: nothing may be clipped inside its page or box.
    const problems = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.page').forEach((pg, i) => {
        const pr = pg.getBoundingClientRect();
        pg.querySelectorAll('*').forEach((el) => {
          if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return;
          if (el.classList.contains('motif')) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return;
          const tol = 0.5;
          if (r.left < pr.left - tol || r.right > pr.right + tol || r.top < pr.top - tol || r.bottom > pr.bottom + tol) {
            out.push(`page ${i + 1}: <${el.tagName.toLowerCase()} class="${el.className}"> outside page`);
          }
          if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).display !== 'inline' && el.tagName.toLowerCase() !== 'svg') {
            out.push(`page ${i + 1}: <${el.tagName.toLowerCase()} class="${el.className}"> horizontal overflow`);
          }
        });
      });
      return out;
    });
    problems.forEach((p) => console.warn('WARN', job.base, p));

    // PDF: exact page size, backgrounds on
    await page.pdf({
      path: path.join(pdfDir, job.base + '.pdf'),
      width: `${w}mm`,
      height: `${h}mm`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await trimToExactSize(path.join(pdfDir, job.base + '.pdf'), w, h);

    // PNG previews: one per .page element
    const pages = page.locator('.page');
    const n = await pages.count();
    if (n !== job.pages.length) {
      console.warn('WARN', job.base, `expected ${job.pages.length} .page element(s), found ${n}`);
    }
    for (let i = 0; i < n; i++) {
      const suffix = job.pages[i] !== undefined ? job.pages[i] : `-p${i + 1}`;
      await pages.nth(i).screenshot({ path: path.join(prevDir, job.base.replace(/-(de|en)$/, '-$1') + suffix + '.png') });
    }
    console.log('rendered', job.base, `${w}x${h}mm, ${n} page(s)`);
    await ctx.close();
  }

  await browser.close();
})();
