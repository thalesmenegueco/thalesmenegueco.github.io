import { Injectable } from '@angular/core';

/**
 * The one place this app leaves for another origin.
 *
 * It exists so the redirect can be **tested**. `window.location.replace` is not
 * reliably spy-able in Karma — modern browsers make `location` properties
 * non-writable, so `spyOn(window.location, 'replace')` either throws or silently
 * does nothing, and a spec written against it would pass while asserting
 * nothing. Injecting the call makes the assertion real: the spec spies on this
 * method and checks the URL, which is the part that can actually be wrong.
 *
 * `replace` rather than `assign` on purpose: the old URL is retired, and leaving
 * it in history would put the browser's back button into a loop between the stub
 * and its destination.
 */
@Injectable({ providedIn: 'root' })
export class ExternalNavigator {
  go(url: string): void {
    window.location.replace(url);
  }
}
