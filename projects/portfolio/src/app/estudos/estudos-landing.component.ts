import { Component } from '@angular/core';
import { PLATFORM_LINKS } from '../platform-links';

/**
 * The `/estudos` landing page — the portfolio's half of Phase 4 step 2.
 *
 * Before the migration this path was the study hub itself. The hub moved to
 * `ml-platform` in Phase 3 and its route left this app in the same commit
 * (hazard H1), which left `/estudos` falling through the `**` wildcard onto the
 * project gallery. This page is what replaces it.
 *
 * It is deliberately thin. The plan's argument for keeping it at all is that it
 * costs almost nothing while preserving the meaning of the nav entry, and that
 * "I built an interactive learning platform" is genuinely good portfolio
 * content. It is **not** a second copy of the catalogue: that lives on the
 * platform, and duplicating it here would create two lists to keep in sync.
 *
 * Every outbound URL comes from `PLATFORM_LINKS`, so re-pointing the platform is
 * one edit — the decoupling Phase 4 step 3 asked for.
 */
@Component({
  selector: 'app-estudos-landing',
  standalone: true,
  templateUrl: './estudos-landing.component.html',
  styleUrl: './estudos-landing.component.scss',
})
export class EstudosLandingComponent {
  readonly platformHub = PLATFORM_LINKS.hub;

  /**
   * The three courses that are live today. These are the ones a visitor arriving
   * from an old `/estudos/calculo/*` URL is looking for, which is why they get
   * named links rather than a single "go to the platform" button.
   */
  readonly courses = [
    {
      name: 'Cálculo I — Entender antes de memorizar',
      description:
        'Limites e derivadas por descoberta: observe, experimente e só então dê nome à ideia matemática.',
      url: PLATFORM_LINKS.calculoTeoria,
    },
    {
      name: 'Matemática aplicada ao Cálculo',
      description:
        'Movimento, otimização e taxas de variação em situações reais, com resposta numérica.',
      url: PLATFORM_LINKS.calculoAplicada,
    },
    {
      name: 'Cálculo em processo',
      description:
        'Um problema completo, da situação física à derivada, com a matemática emergindo etapa por etapa.',
      url: PLATFORM_LINKS.calculoProcesso,
    },
  ];
}
