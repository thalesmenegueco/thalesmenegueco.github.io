import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageClipboardService implements OnDestroy {
  private imagePasted$ = new Subject<Blob>();
  readonly imagePasted: Observable<Blob> = this.imagePasted$.asObservable();

  private cleanupFns: (() => void)[] = [];

  attach(target: HTMLElement | Document = document): () => void {
    const handler = (e: Event) => {
      const ce = e as ClipboardEvent;
      const items = ce.clipboardData?.items ?? [];
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            this.imagePasted$.next(blob);
          }
        }
      }
    };
    target.addEventListener('paste', handler);
    const cleanup = () => target.removeEventListener('paste', handler);
    this.cleanupFns.push(cleanup);
    return cleanup;
  }

  ngOnDestroy(): void {
    for (const fn of this.cleanupFns) {
      fn();
    }
    this.cleanupFns = [];
  }
}
