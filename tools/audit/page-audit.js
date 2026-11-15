/**
 * The browser half of the portfolio layout audit.
 *
 * `run-layout-audit.mjs` injects this file into the *real* page (not an
 * iframe) and calls `__auditPortfolio()`. Everything here runs in page
 * context, synchronously with the layout, and answers questions that only a
 * browser can answer:
 *
 * - does the document overflow horizontally at this width?
 * - did the display/body fonts actually load, and at what size does the hero
 *   land?
 * - does every section start under the sticky bar when scrolled to, and do the
 *   reveal animations fire (i.e. does the page become *visible* at all)?
 * - do the grids collapse (3 → 2 → 1), do the flagship screenshots decode, and
 *   does the mobile sheet open, lock the page, and close on Escape?
 *
 * The audit walks the page the way a reader would — section by section — so it
 * measures the page after the lazy images and the reveals have had their
 * chance to run.
 */
globalThis.__auditPortfolio = async function auditPortfolio() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const width = innerWidth;
  const height = innerHeight;

  const css = (node, prop) =>
    node ? getComputedStyle(node).getPropertyValue(prop).trim() : null;

  const rect = (node) => {
    const box = node.getBoundingClientRect();
    return {
      top: Math.round(box.top),
      right: Math.round(box.right),
      bottom: Math.round(box.bottom),
      width: Math.round(box.width),
      height: Math.round(box.height),
    };
  };

  const describe = (node) => {
    const id = node.id ? `#${node.id}` : '';
    const classes = node.classList.length ? `.${[...node.classList].join('.')}` : '';
    return `${node.tagName.toLowerCase()}${id}${classes}`;
  };

  await Promise.race([document.fonts.ready, sleep(3000)]);
  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  );

  const out = {
    viewport: [width, height],
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    horizontalOverflow: document.documentElement.scrollWidth > width + 1,
    overflowElements: [],
  };

  // ---- Walk the page like a reader: reveals, sticky bar, section anchors ----
  out.sectionIds = [...document.querySelectorAll('main section[id]')].map((n) => n.id);
  out.sections = {};
  out.reveal = {
    total: document.querySelectorAll('[appReveal]').length,
    revealedByWalk: 0,
  };

  for (const id of out.sectionIds) {
    const node = document.getElementById(id);
    const before = rect(node);
    node.scrollIntoView({ behavior: 'instant', block: 'start' });
    await sleep(700);

    const reveals = [...node.querySelectorAll('[appReveal]')];
    const nav = document.querySelector('app-nav > header');
    out.sections[id] = {
      height: before.height,
      documentTop: Math.round(before.top + scrollY),
      topAfterScroll: rect(node).top,
      navTopAfterScroll: rect(nav).top,
      navScrolled: nav.classList.contains('nav--scrolled'),
      revealed: reveals.filter((r) => r.classList.contains('is-revealed')).length,
      revealCount: reveals.length,
    };
  }

  // Read the page the way a person does — in viewport-ish increments — then
  // check that nothing stayed hidden. Jumping straight between section tops
  // would leave everything in between unobserved, which is a property of the
  // audit, not of the page.
  const documentHeight = document.documentElement.scrollHeight;
  const step = Math.max(280, Math.round(height * 0.6));
  for (let y = 0; y <= documentHeight; y += step) {
    scrollTo({ top: y, behavior: 'instant' });
    await sleep(90);
  }
  scrollTo({ top: documentHeight, behavior: 'instant' });
  await sleep(1100);
  out.reveal.revealedAfterRead =
    document.querySelectorAll('[appReveal].is-revealed').length;
  out.reveal.fullyRevealed = out.reveal.revealedAfterRead === out.reveal.total;
  out.documentHeight = documentHeight;
  out.maxScroll = documentHeight - height;
  // Cumulative layout shift, collected by the runner before the document's
  // own scripts ran. A screenshot bound with the wrong dimensions shows up
  // here as a non-trivial value.
  out.cls = typeof window.__cls === 'number' ? Number(window.__cls.toFixed(4)) : null;

  // ---- Nav, measured in its scrolled state ----
  scrollTo({ top: 400, behavior: 'instant' });
  await sleep(250);
  const nav = document.querySelector('app-nav > header');
  const navLinks = [...document.querySelectorAll('.nav__links a')];
  const toggle = document.querySelector('.nav__toggle');
  out.nav = {
    linkCount: navLinks.length,
    linkHrefs: navLinks.map((a) => a.getAttribute('href')),
    height: rect(nav).height,
    stickyTopWhileScrolled: rect(nav).top,
    scrolledClass: nav.classList.contains('nav--scrolled'),
    backdropFilter: css(nav, 'backdrop-filter'),
    scrollYWhileReading: Math.round(scrollY),
    progressScale: css(document.querySelector('.nav__progress'), 'transform'),
    toggleDisplay: css(toggle, 'display'),
    desktopLinksDisplay: css(document.querySelector('.nav__links'), 'display'),
  };

  // ---- Type and hero ----
  const h1 = document.querySelector('h1');
  const heroLines = [...document.querySelectorAll('.hero__line')];
  out.type = {
    fonts: {
      sora: document.fonts.check('600 16px Sora'),
      inter: document.fonts.check('400 16px Inter'),
    },
    h1: {
      lines: heroLines.length,
      family: css(h1, 'font-family'),
      fontSize: css(h1, 'font-size'),
      lineHeight: css(h1, 'line-height'),
      gradientClip:
        css(heroLines[1], 'background-clip') || css(heroLines[1], '-webkit-background-clip'),
      gradientColor: css(heroLines[1], 'color'),
    },
    bodyLeadColor: css(document.querySelector('.hero__lead'), 'color'),
    bodyFont: css(document.querySelector('.hero__lead'), 'font-family'),
  };

  // ---- Layout grids ----
  out.grids = {
    toolsColumns: css(document.querySelector('.tools__grid'), 'grid-template-columns'),
    bentoColumns: css(document.querySelector('.about__bento'), 'grid-template-columns'),
    footerColumns: css(document.querySelector('.site-footer__inner'), 'grid-template-columns'),
  };

  out.projects = [...document.querySelectorAll('.project')].map((project) => {
    const image = project.querySelector('img');
    return {
      name: project.querySelector('.project__name').textContent.trim(),
      flipped: project.classList.contains('project--flip'),
      imageNatural: [image.naturalWidth, image.naturalHeight],
      imageRendered: rect(image),
    };
  });

  out.toolCards = document.querySelectorAll('.tool-card').length;
  out.toolHrefs = [...document.querySelectorAll('.tool-card')].map((a) =>
    a.getAttribute('href'),
  );
  out.socials = [...document.querySelectorAll('.contact__social')].map((a) =>
    a.getAttribute('href'),
  );
  out.images = [...document.images].map((image) => ({
    src: image.getAttribute('src'),
    natural: [image.naturalWidth, image.naturalHeight],
  }));

  // What the browser believes about its own input, and the two sizes that
  // decide whether a phone visitor can hit something.
  out.media = {
    hover: matchMedia('(hover: hover)').matches,
    coarsePointer: matchMedia('(pointer: coarse)').matches,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  };

  out.targets = (() => {
    const under24 = [];
    const under44 = [];
    let total = 0;

    for (const el of document.querySelectorAll('a, button, [role="button"]')) {
      const box = el.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) continue;

      // WCAG 2.5.8 exempts links that are inline in a paragraph: they are
      // read as words, not aimed at as targets.
      const inlineInProse =
        el.tagName === 'A' &&
        getComputedStyle(el).display === 'inline' &&
        (el.closest('p') || el.closest('li'));
      if (inlineInProse) continue;

      total += 1;
      const smallest = Math.min(box.width, box.height);
      const entry = { el: describe(el), w: Math.round(box.width), h: Math.round(box.height) };
      if (smallest < 24) under24.push(entry);
      else if (smallest < 44) under44.push(entry);
    }

    return { total, under24, under44 };
  })();

  out.minFieldFontPx = (() => {
    let smallest = Infinity;
    for (const el of document.querySelectorAll('input, select, textarea')) {
      if (el.getBoundingClientRect().width < 1) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (Number.isFinite(size)) smallest = Math.min(smallest, size);
    }
    return Number.isFinite(smallest) ? smallest : null;
  })();

  out.headIcons = [
    ...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]'),
  ].map((link) => ({
    rel: link.getAttribute('rel'),
    href: link.getAttribute('href'),
    sizes: link.getAttribute('sizes'),
    type: link.getAttribute('type'),
  }));

  out.heroTitleOverflow = (() => {
    const title = document.querySelector('.hero__title');
    return title ? title.scrollWidth <= title.clientWidth + 1 : null;
  })();

  // ---- Horizontal overflow at this width ----
  for (const node of document.querySelectorAll('body *')) {
    const box = node.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) continue;
    if (getComputedStyle(node).position === 'fixed') continue;
    // Atmosphere is allowed to bleed past the edges; the body clips it.
    if (node.closest('.aurora, .grain, .hero__fade')) continue;
    if (box.right > width + 1.5 || box.left < -1.5) {
      out.overflowElements.push({ el: describe(node), left: Math.round(box.left), right: Math.round(box.right) });
    }
  }
  out.overflowElements = out.overflowElements.slice(0, 10);

  // ---- The mobile sheet ----
  if (width < 600) {
    toggle.click();
    await sleep(80);
    const sheet = document.getElementById('nav-sheet');
    out.sheet = {
      openDisplay: css(sheet, 'display'),
      ariaExpandedWhenOpen: toggle.getAttribute('aria-expanded'),
      bodyLocked: document.body.style.overflow,
    };

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await sleep(80);
    out.sheet.closedDisplay = css(sheet, 'display');
    out.sheet.ariaExpandedWhenClosed = toggle.getAttribute('aria-expanded');
    out.sheet.bodyUnlocked = document.body.style.overflow;
  }

  scrollTo({ top: 0, behavior: 'instant' });
  return out;
};
