import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

/**
 * Where an anchored section should land relative to the viewport's top edge:
 * the sticky bar (64px, `--nav-h` in `styles.scss`) plus a 16px gap.
 *
 * This constant is load-bearing and cannot be delegated to CSS. Angular's
 * `BrowserViewportScroller.scrollToElement` resolves the target with
 * `getBoundingClientRect()` and calls `window.scrollTo` — it never uses
 * `scrollIntoView`, so a section's `scroll-margin-top` has no effect on router
 * anchor navigation. Without this offset, every nav click and every `/#section`
 * deep link parks the section flush at the top of the viewport, with its
 * heading hidden behind the bar.
 */
const ANCHOR_OFFSET = 80;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // The nav is anchors on a single page. `anchorScrolling` makes those
      // fragments scroll after the router has rendered the section — including
      // when the click comes from `/tools`, where the router has to navigate
      // home first. `scrollPositionRestoration` is what makes the browser
      // honour `/#projetos` on a cold deep link.
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    // Runs at bootstrap, before the router's initial navigation, which is why
    // the offset is in place in time for a cold `/#section` deep link.
    provideAppInitializer(() => {
      inject(ViewportScroller).setOffset([0, ANCHOR_OFFSET]);
    }),
  ],
};
