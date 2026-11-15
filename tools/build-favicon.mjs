#!/usr/bin/env node
/**
 * Builds the portfolio's icon set from one procedural design.
 *
 * Why this exists
 * ---------------
 * The tab icon has to survive being 16 pixels wide, so it is drawn
 * mathematically at a high resolution and area-averaged down, instead of being
 * hand-pixelled once and scaled badly. The same geometry is also written as an
 * SVG, so modern browsers get a crisp vector and older ones get the raster
 * fallback — both from identical numbers, so they cannot drift.
 *
 * The design is the nav's brand mark: a rounded square carrying the
 * `--gradient-warm` rose→violet gradient with the app's dark sparkle glyph in
 * ink. Dark glyph on the mid-bright gradient keeps the icon legible on both
 * light and dark browser chrome; the old magenta disc had a glyph that
 * disappeared at tab size.
 *
 * Outputs (all in `projects/portfolio/public/`):
 *   - favicon.ico            16/32/48/64 px, PNG-compressed entries
 *   - favicon.svg            vector icon for modern browsers
 *   - apple-touch-icon.png   180 px, opaque, no rounded corners (iOS masks it)
 *
 * Usage
 * -----
 *   node tools/build-favicon.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, '../projects/portfolio/public');

// The brand mark's numbers. `ROSE`/`VIOLET` are `--gradient-warm` from
// `styles.scss`; `INK` is the dark colour the app's primary button text uses.
const ROSE = [0xff, 0x5c, 0xd8];
const VIOLET = [0xa7, 0x8b, 0xfa];
const INK = [0x14, 0x06, 0x1a];

/** Corner radius as a fraction of the tile size — mirrors the 22% in the SVG. */
const RADIUS_RATIO = 0.22;
/** Half-size of the sparkle, as a fraction of the tile. */
const STAR_RATIO = 0.31;
/** Supersampling per axis; 4 gives clean anti-aliasing at 512 px. */
const SS = 4;
const MASTER = 512;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** `--gradient-warm` is `linear-gradient(135deg, …)`, i.e. down-and-right. */
function gradientAt(x, y, size) {
  const t = clamp01((x + y) / (2 * size));
  return [
    Math.round(ROSE[0] + (VIOLET[0] - ROSE[0]) * t),
    Math.round(ROSE[1] + (VIOLET[1] - ROSE[1]) * t),
    Math.round(ROSE[2] + (VIOLET[2] - ROSE[2]) * t),
  ];
}

/** Inside the rounded square (signed distance in pixels, negative = inside). */
function roundedRectSdf(x, y, size) {
  const radius = size * RADIUS_RATIO;
  const half = size / 2;
  const qx = Math.abs(x - half) - (half - radius);
  const qy = Math.abs(y - half) - (half - radius);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return outside + Math.min(Math.max(qx, qy), 0) - radius;
}

/**
 * The sparkle glyph is an astroid — a four-pointed star with concave sides,
 * which is what `sparkle` looks like in `ui/icon.ts`. Its implicit form is
 * `|u|^(2/3) + |v|^(2/3) <= 1`, so the raster and the SVG polygon can both be
 * generated from the same function.
 */
function insideStar(x, y, size) {
  const half = size / 2;
  const a = size * STAR_RATIO;
  const u = Math.abs(x - half) / a;
  const v = Math.abs(y - half) / a;
  if (u >= 1 || v >= 1) return false;
  // |u|^(2/3) is (cbrt(|u|))², which avoids a pow() call per sample.
  const cu = Math.cbrt(u);
  const cv = Math.cbrt(v);
  return cu * cu + cv * cv <= 1;
}

/** Renders the icon at `size` px into a premultiplied RGBA buffer. */
function render(size, { rounded = true } = {}) {
  const pixels = new Float64Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS;
          const py = y + (sy + 0.5) / SS;

          if (rounded && roundedRectSdf(px, py, size) > 0) continue;

          const star = insideStar(px, py, size);
          const colour = star ? INK : gradientAt(px, py, size);
          r += colour[0];
          g += colour[1];
          b += colour[2];
          a += 1;
        }
      }

      const samples = SS * SS;
      const alpha = a / samples;
      const index = (y * size + x) * 4;
      if (alpha === 0) continue; // stays transparent
      // Premultiplied for correct area-averaging when downscaled.
      pixels[index] = (r / a) * alpha;
      pixels[index + 1] = (g / a) * alpha;
      pixels[index + 2] = (b / a) * alpha;
      pixels[index + 3] = alpha;
    }
  }

  return pixels;
}

/** Box-filters a master render down to `target` px (premultiplied average). */
function downscale(master, size, target, { rounded = true } = {}) {
  const out = new Float64Array(target * target * 4);
  const ratio = size / target;

  for (let y = 0; y < target; y++) {
    for (let x = 0; x < target; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      const y0 = Math.floor(y * ratio);
      const y1 = Math.ceil((y + 1) * ratio);
      const x0 = Math.floor(x * ratio);
      const x1 = Math.ceil((x + 1) * ratio);

      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const index = (sy * size + sx) * 4;
          r += master[index];
          g += master[index + 1];
          b += master[index + 2];
          a += master[index + 3];
          count++;
        }
      }

      const index = (y * target + x) * 4;
      if (a === 0) continue;
      // Un-premultiply back to straight alpha for the PNG encoder.
      out[index] = r / a;
      out[index + 1] = g / a;
      out[index + 2] = b / a;
      out[index + 3] = a / count;
    }
  }

  // `rounded` is only used to document intent at the call site; the master
  // render already carries it.
  void rounded;
  return out;
}

/* ------------------------------ PNG encoding ------------------------------ */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

/** Encodes a straight-alpha RGBA buffer as a non-interlaced 8-bit PNG. */
function encodePng(pixels, size) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);

  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      const target = y * (stride + 1) + 1 + x * 4;
      raw[target] = Math.round(pixels[index]);
      raw[target + 1] = Math.round(pixels[index + 1]);
      raw[target + 2] = Math.round(pixels[index + 2]);
      raw[target + 3] = Math.round(pixels[index + 3] * 255);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------ ICO packing ------------------------------- */

function packIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(entries.length * 16);
  let offset = 6 + directory.length;
  entries.forEach((entry, index) => {
    const base = index * 16;
    directory[base] = entry.size >= 256 ? 0 : entry.size;
    directory[base + 1] = entry.size >= 256 ? 0 : entry.size;
    directory[base + 2] = 0; // palette size
    directory[base + 3] = 0; // reserved
    directory.writeUInt16LE(1, base + 4); // colour planes
    directory.writeUInt16LE(32, base + 6); // bits per pixel
    directory.writeUInt32LE(entry.png.length, base + 8);
    directory.writeUInt32LE(offset, base + 12);
    offset += entry.png.length;
  });

  return Buffer.concat([header, directory, ...entries.map((entry) => entry.png)]);
}

/* --------------------------------- Build ---------------------------------- */

mkdirSync(publicDir, { recursive: true });

// One high-resolution master, averaged down to each icon size. The 16 px icon
// is the one that matters in a tab, so it gets the same area-averaged
// treatment rather than a nearest-neighbour scale.
const master = render(MASTER);

const sizes = [16, 32, 48, 64];
const entries = sizes.map((size) => ({
  size,
  png: encodePng(downscale(master, MASTER, size), size),
}));

writeFileSync(join(publicDir, 'favicon.ico'), packIco(entries));

// The SVG version is generated from the same astroid and gradient so the two
// cannot disagree. 32 samples per quadrant is smooth well past 64 px.
const viewBox = 64;
const starA = viewBox * STAR_RATIO;
const starPoints = [];
const STEPS = 32;
for (let i = 0; i < STEPS * 4; i++) {
  const t = (i / (STEPS * 4)) * Math.PI * 2;
  const x = 32 + starA * Math.cos(t) ** 3;
  const y = 32 + starA * Math.sin(t) ** 3;
  starPoints.push(`${x.toFixed(2)},${y.toFixed(2)}`);
}
const radius = (viewBox * RADIUS_RATIO).toFixed(2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox} ${viewBox}" role="img" aria-label="Thales Menegueço">
  <defs>
    <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff5cd8" />
      <stop offset="1" stop-color="#a78bfa" />
    </linearGradient>
  </defs>
  <rect width="${viewBox}" height="${viewBox}" rx="${radius}" fill="url(#warm)" />
  <polygon points="${starPoints.join(' ')}" fill="#14061a" />
</svg>
`;

writeFileSync(join(publicDir, 'favicon.svg'), svg);

// iOS masks the icon itself, so the touch icon is a full, opaque square.
const touchMaster = render(MASTER, { rounded: false });
writeFileSync(
  join(publicDir, 'apple-touch-icon.png'),
  encodePng(downscale(touchMaster, MASTER, 180), 180),
);

for (const entry of entries) {
  console.log(`favicon.ico  ${entry.size}x${entry.size}  ${entry.png.length} bytes`);
}
console.log(`favicon.svg  ${Buffer.byteLength(svg)} bytes`);
console.log('apple-touch-icon.png  180x180');
console.log(`\nwrote to ${publicDir}`);
