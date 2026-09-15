import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/**
 * The platform shell: persistent chrome around the routed course surface.
 *
 * It holds no state and loads no course code — every course module is a
 * `loadComponent` route, which is what keeps the shell free of the heavy
 * widgets (KaTeX today; TF.js, D3 and Plotly as the ML courses land).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
