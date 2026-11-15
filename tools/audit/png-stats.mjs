#!/usr/bin/env node
/**
 * Summarises a PNG without a decoder dependency.
 *
 * Why this exists
 * ---------------
 * The layout audit can prove the page is *correct* — no overflow, the right
 * font sizes, the right anchors — but not that it actually renders as a dark,
 * glowing, legible page with text on it. This reads the screenshot's pixels
 * and reports the few numbers that catch a catastrophic render: a blank page,
 * a white flash, an aurora that never painted, text that never appeared.
 *
 * It is deliberately not a visual-diff tool. It supports the PNG subset
 * Chrome's `--screenshot` emits (8-bit, non-interlaced, RGB or RGBA/gray),
 * which keeps it to `zlib` plus a per-scanline unfilter.
 *
 * Usage
 * -----
 *   node tools/audit/png-stats.mjs shots/desktop-full.png [more.png ...]
 */

import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) {
    throw new Error('not a PNG');
  }

  let offset = 8;
  let header = null;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (!header) throw new Error('no IHDR');
  if (header.bitDepth !== 8) throw new Error(`unsupported bit depth ${header.bitDepth}`);
  if (header.interlace !== 0) throw new Error('interlaced PNG is not supported');

  const channelsByColorType = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };
  const channels = channelsByColorType[header.colorType];
  if (!channels) throw new Error(`unsupported colour type ${header.colorType}`);

  const raw = inflateSync(Buffer.concat(idat));
  const stride = header.width * channels;
  const pixels = Buffer.alloc(stride * header.height);
  const prior = Buffer.alloc(stride);

  for (let y = 0; y < header.height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const out = pixels.subarray(y * stride, y * stride + stride);

    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[x - channels] : 0;
      const b = prior[x];
      const c = x >= channels ? prior[x - channels] : 0;
      const value = line[x];

      let decoded;
      switch (filter) {
        case 0: decoded = value; break;
        case 1: decoded = value + a; break;
        case 2: decoded = value + b; break;
        case 3: decoded = value + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          decoded = value + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error(`unknown filter ${filter}`);
      }
      out[x] = decoded & 0xff;
    }

    out.copy(prior);
  }

  return { ...header, channels, pixels };
}

// Rec. 709 relative luminance, and the same normalisation WCAG uses.
function linear(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(r, g, b) {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function colourFamily(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  if (chroma < 28) return 'neutral';

  if (r >= g && b >= g) return r > b + 18 ? 'rose' : b > r + 18 ? 'azure' : 'violet';
  if (b >= r && b >= g) return g > r + 18 ? 'azure' : 'violet';
  if (r >= g && r >= b) return g > b + 18 ? 'amber' : 'rose';
  return 'azure';
}

function analyse(file) {
  const { width, height, channels, pixels } = decodePng(readFileSync(file));

  let sumLum = 0;
  let bright = 0;
  let nonDark = 0;
  let coloured = 0;
  const families = { rose: 0, violet: 0, azure: 0, amber: 0, neutral: 0 };
  const bands = 12;
  const bandStats = Array.from({ length: bands }, () => ({ lum: 0, count: 0, coloured: 0 }));

  for (let y = 0; y < height; y++) {
    const band = Math.min(bands - 1, Math.floor((y / height) * bands));
    for (let x = 0; x < width; x++) {
      const index = y * width * channels + x * channels;
      const r = pixels[index];
      const g = channels >= 3 ? pixels[index + 1] : pixels[index];
      const b = channels >= 3 ? pixels[index + 2] : pixels[index];
      const lum = luminance(r, g, b);

      sumLum += lum;
      if (lum > 0.5) bright++;
      if (lum > 0.15) nonDark++;

      const family = colourFamily(r, g, b);
      families[family]++;
      if (family !== 'neutral') coloured++;

      bandStats[band].lum += lum;
      bandStats[band].count++;
      if (family !== 'neutral' && lum > 0.25) bandStats[band].coloured++;
    }
  }

  const total = width * height;
  const pct = (n) => Number(((n / total) * 100).toFixed(2));

  return {
    file,
    width,
    height,
    meanLuminance: Number((sumLum / total).toFixed(4)),
    brightPct: pct(bright),
    nonDarkPct: pct(nonDark),
    colouredPct: pct(coloured),
    familiesPct: Object.fromEntries(
      Object.entries(families).map(([name, count]) => [name, pct(count)]),
    ),
    luminanceByBand: bandStats.map((band, index) => ({
      band: index,
      topPct: Math.round((index / bands) * 100),
      meanLuminance: Number((band.lum / band.count).toFixed(3)),
      colouredPct: Number(((band.coloured / band.count) * 100).toFixed(1)),
    })),
  };
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: node tools/audit/png-stats.mjs <file.png> [...]');
  process.exit(1);
}

for (const file of files) {
  console.log(JSON.stringify(analyse(file), null, 2));
}
