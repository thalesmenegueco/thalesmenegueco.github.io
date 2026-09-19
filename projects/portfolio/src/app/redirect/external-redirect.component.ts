import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExternalNavigator } from './external-navigator';

/**
 * Sends a retired URL to its new home on the VisuaLab platform.
 *
 * One component serves every stub. The destination comes from the route's
 * `data.redirectTo`, so adding another retired URL is a route entry rather than
 * another component — and there is exactly one place where the redirect is
 * actually performed, which is the part worth getting right.
 *
 * The template is a fallback, not decoration. If the redirect is blocked (a
 * sandboxed iframe, a browser extension, a slow network), the visitor is left on
 * a dead URL with nothing to click otherwise — so the destination is rendered as
 * a real link as well. It is also what makes the stub's behaviour describable in
 * a spec without executing a navigation.
 */
@Component({
  selector: 'app-external-redirect',
  standalone: true,
  template: `
    <div class="redirect">
      <h2>Este endereço mudou de casa 🏡</h2>
      <p>
        O Cálculo que ficava aqui agora vive na <strong>VisuaLab</strong>, a
        plataforma de cursos interativos de exatas.
      </p>
      <p>
        Se você não for redirecionado automaticamente,
        <a [href]="destination">continue para a VisuaLab</a>.
      </p>
    </div>
  `,
  styles: `
    .redirect {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 620px;
      margin-top: 40px;
    }
  `,
})
export class ExternalRedirectComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly navigator = inject(ExternalNavigator);

  /**
   * Resolved from the route so every stub shares this component. Empty when a
   * route is misconfigured — in which case the component renders the fallback
   * instead of navigating to `''`, and `app.routes.spec.ts` fails.
   */
  readonly destination: string =
    (this.route.snapshot.data['redirectTo'] as string | undefined) ?? '';

  ngOnInit(): void {
    if (this.destination) {
      this.navigator.go(this.destination);
    }
  }
}
