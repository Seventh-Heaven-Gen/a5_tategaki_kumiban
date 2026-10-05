import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const MAX_CHARS = 400000;
const SELECTS = {
  cols: ['1', '2'],
  size: ['8', '9', '9.5', '10', '10.5', '11', '12', '14'],
  font: ['Noto Serif JP', 'Noto Sans JP'],
};

async function launch() {
  if (process.env.CHROME_PATH) {
    return puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true });
  }
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end('POST only');
    return;
  }
  const b = req.body || {};
  const text = typeof b.text === 'string' ? b.text : '';
  if (!text.trim()) { res.statusCode = 400; res.end('text is empty'); return; }
  if (text.length > MAX_CHARS) { res.statusCode = 413; res.end('text too long'); return; }
  for (const k of Object.keys(SELECTS)) {
    if (!SELECTS[k].includes(String(b[k]))) { res.statusCode = 400; res.end('bad ' + k); return; }
  }
  const settings = {
    text,
    cols: String(b.cols), size: String(b.size), font: String(b.font),
    bind: b.bind === 'both' ? 'both' : 'gutter',
    hd: String(b.hd || '').slice(0, 200),
    hp: ['center', 'outer', 'inner'].includes(b.hp) ? b.hp : 'center',
    ft: String(b.ft || '').slice(0, 200),
    ai: !!b.ai, pn: !!b.pn, ls: !!b.ls,
  };

  let browser;
  try {
    const html = fs.readFileSync(path.join(process.cwd(), 'a5_tategaki_kumiban.html'), 'utf8');
    browser = await launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(async (s) => {
      while (busy) await new Promise(r => setTimeout(r, 50));
      const $ = id => document.getElementById(id);
      for (const id of ['text', 'cols', 'size', 'font', 'bind', 'hd', 'hp', 'ft']) $(id).value = s[id];
      for (const id of ['ai', 'pn', 'ls']) $(id).checked = s[id];
      await render();
      await document.fonts.ready;
    }, settings);
    await page.emulateMediaType('print');
    const pdf = await page.pdf({
      width: '148mm', height: '210mm', printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-store');
    res.end(Buffer.from(pdf));
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end('pdf generation failed: ' + e.message);
  } finally {
    if (browser) await browser.close();
  }
}
