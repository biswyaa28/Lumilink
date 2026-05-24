import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const htmlPath = new URL('../index.html', import.meta.url);

test('presentation exposes export controls for pdf and ppt downloads', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /id="exportMenu"/, 'expected export menu container');
  assert.match(html, />\s*PDF\s*</, 'expected PDF export option');
  assert.match(html, />\s*PPT\s*</, 'expected PPT export option');
  assert.match(html, /async function exportDeck\(format\)/, 'expected shared export function');
});

test('presentation export uses the live slide layout context', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /body\.export-mode \.slide\.export-current/, 'expected export-mode CSS for the active slide');
  assert.match(html, /classList\.add\('export-mode'\)/, 'expected export flow to enter export mode on the live DOM');
  assert.match(html, /classList\.add\([^\)]*export-current[^\)]*\)/, 'expected export flow to mark the slide being captured');
});

test('pdf export sizes pages from captured slide dimensions', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /const\s+firstImage\s*=\s*images\[0\]/, 'expected export to derive PDF size from the first captured slide');
  assert.match(html, /format:\s*\[\s*pdfWidth,\s*pdfHeight\s*\]/, 'expected PDF format to use captured slide dimensions');
});

test('export mode overrides gradient text to solid colors', async () => {
  const html = await readFile(htmlPath, 'utf8');

  assert.match(html, /body\.export-mode \.(text-gradient|text-gradient-light)/, 'expected export-mode CSS override for gradient text');
  assert.match(html, /body\.export-mode \.text-gradient[^}]*-webkit-text-fill-color/, 'expected export-mode to set gradient text fill color');
});
