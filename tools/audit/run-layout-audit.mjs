#!/usr/bin/env node
/**
 * Runs the portfolio's layout audit against a real Chrome and prints JSON.
 *
 * It drives the page over the DevTools Protocol for two reasons:
 *
 * 1. `chrome --dump-dom` prints the document at load, long before an async
 *    audit could finish. CDP lets the runner await `Runtime.evaluate` with
 *    `awaitPromise`.
 * 2. The audit must run against the *real* page at real viewport sizes. An
 *    iframe harness reports a different viewport, and background-timer
 *    throttling there desynchronises the scroll-and-reveal walk badly enough
 *    to produce false failures.
 *
 * The runner resizes the viewport (`Emulation.setDeviceMetricsOverride`),
 * reloads, walks the page, then repeats for the next size. It also checks the
 * two navigation paths the design depends on: a cold `/#ferramentas` deep
 * link, and clicking a nav anchor while already on the page.
 *
 * Usage
 * -----
 *   node tools/audit/run-layout-audit.mjs [url] [--timeout=180000]
 *
 * The app must already be served (e.g. `python3 -m http.server 4173 -d
 * dist/portfolio/browser`). The audit reads `page-audit.js` from this folder
 * and injects it, so no audit file has to be copied into `dist/`.
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const auditSource = readFileSync(join(here, 'page-audit.js'), 'utf8');

const args = process.argv.slice(2);
const url = args.find((arg) => !arg.startsWith('--')) ?? 'http://127.0.0.1:4173/';
const timeoutArg = args.find((arg) => arg.startsWith('--timeout='));
const timeoutMs = timeoutArg ? Number(timeoutArg.split('=')[1]) : 180_000;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];

const CHROME = process.env.CHROME_BIN ?? 'google-chrome';
const DEBUG_PORT = Number(process.env.AUDIT_DEBUG_PORT ?? 9333);
const profileDir = mkdtempSync(join(tmpdir(), 'dsh-audit-'));

const chrome = spawn(
  CHROME,
  [
    '--headless=old',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--hide-scrollbars',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'ignore'] },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForTarget() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const targets = await (
        await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)
      ).json();
      const page = targets.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      // Chrome is still booting.
    }
    await sleep(250);
  }
  throw new Error('Chrome did not expose a page target in time');
}

async function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve);
    socket.addEventListener('error', () => reject(new Error('DevTools socket failed')));
  });
  return socket;
}

function client(socket) {
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const handler = pending.get(message.id);
    if (!handler) return;
    pending.delete(message.id);
    handler(message);
  });

  return (method, params = {}) =>
    new Promise((resolve) => {
      const id = ++nextId;
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
}

async function evaluate(twice, expression) {
  const response = await twice('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.result?.exceptionDetails) {
    throw new Error(
      `Evaluation failed: ${response.result.exceptionDetails.text} ${JSON.stringify(
        response.result.exceptionDetails.exception?.description ?? '',
      )}`,
    );
  }
  return response.result?.result?.value;
}

async function waitForComplete(send) {
  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    const state = await evaluate(send, 'document.readyState');
    if (state === 'complete') return;
    await sleep(100);
  }
  throw new Error('Page did not reach readyState complete');
}

async function main() {
  const target = await waitForTarget();
  const socket = await connect(target.webSocketDebuggerUrl);
  const send = client(socket);

  await send('Runtime.enable');
  await send('Page.enable');

  // Cumulative layout shift has to be observed before the page's own scripts
  // run, so it is registered as a document-start script rather than injected
  // after load.
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });`,
  });
  await evaluate(send, auditSource);

  const results = [];
  const deepLinks = {};
  const anchorClicks = {};

  for (const viewport of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 600,
    });
    await send('Page.navigate', { url: 'about:blank' });
    await sleep(250);
    await send('Page.navigate', { url });
    await waitForComplete(send);
    await evaluate(send, auditSource);

    const audit = await evaluate(
      send,
      `(async () => { const started = performance.now(); const result = await globalThis.__auditPortfolio(); result.elapsedMs = Math.round(performance.now() - started); result.viewportName = ${JSON.stringify(viewport.name)}; return result; })()`,
    );
    results.push(audit);

    // Cold deep link: does /#ferramentas land the section under the bar?
    if (viewport.name === 'desktop') {
      await send('Page.navigate', { url: 'about:blank' });
      await sleep(250);
      await send('Page.navigate', { url: `${url}#ferramentas` });
      await waitForComplete(send);
      deepLinks.ferramentas = await evaluate(
        send,
        `(async () => {
          let previous = -1;
          let stable = 0;
          for (let i = 0; i < 60; i++) {
            await new Promise((r) => setTimeout(r, 100));
            const y = Math.round(scrollY);
            if (y === previous) stable += 1; else stable = 0;
            previous = y;
            if (stable >= 3) break;
          }
          return {
            hash: location.hash,
            settled: stable >= 3,
            scrollY: Math.round(scrollY),
            sectionTop: Math.round(document.getElementById('ferramentas').getBoundingClientRect().top),
          };
        })()`,
      );
    }

    // Same-page anchor click: the nav's primary interaction.
    if (viewport.name === 'desktop') {
      await send('Page.navigate', { url: 'about:blank' });
      await sleep(250);
      await send('Page.navigate', { url });
      await waitForComplete(send);
      // Clicking a nav anchor is the page's primary interaction, but the click
      // only counts once Angular has attached the RouterLink handler — a click
      // fired during bootstrap falls through to the browser's native `#`
      // handling and looks like "anchor navigation does nothing". So the step
      // waits for the app to render, interacts, and reports whether the page
      // actually moved rather than just when it stopped moving.
      anchorClicks.ferramentas = await evaluate(
        send,
        `(async () => {
          const nap = (ms) => new Promise((r) => setTimeout(r, ms));
          for (let i = 0; i < 80 && !document.querySelector('app-one-page'); i++) await nap(100);
          await nap(600);
          const link = document.querySelector('.nav__links a[href="/#ferramentas"]');
          if (!link) return { error: 'nav anchor missing' };
          link.click();
          let previous = -1;
          let stable = 0;
          for (let i = 0; i < 60; i++) {
            await nap(100);
            const y = Math.round(scrollY);
            if (y === previous) stable += 1; else stable = 0;
            previous = y;
            // At the top of the page three stable zeroes mean "nothing
            // happened yet", not "the scroll finished" — keep waiting.
            if (stable >= 3 && (scrollY !== 0 || i >= 40)) break;
          }
          return {
            hash: location.hash,
            settled: stable >= 3,
            moved: Math.round(scrollY) > 10,
            scrollY: Math.round(scrollY),
            sectionTop: Math.round(document.getElementById('ferramentas').getBoundingClientRect().top),
          };
        })()`,
      );
    }
  }

  await send('Emulation.clearDeviceMetricsOverride');

  socket.close();
  process.stdout.write(
    `${JSON.stringify(
      { viewports: results, deepLinks, anchorClicks },
      null,
      2,
    )}\n`,
  );
}

main()
  .catch((error) => {
    console.error(String(error?.message ?? error));
    process.exitCode = 1;
  })
  .finally(async () => {
    chrome.kill('SIGKILL');
    // Chrome may still be writing its profile when the process dies; a failed
    // cleanup must not mask the audit's real result.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        rmSync(profileDir, { recursive: true, force: true });
        break;
      } catch {
        await sleep(200);
      }
    }
  });
