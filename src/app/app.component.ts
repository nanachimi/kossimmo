import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, map, startWith } from "rxjs/operators";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { I18nService } from "./core/services/i18n.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#main">{{
      i18n.locale() === "fr" ? "Aller au contenu" : "Skip to content"
    }}</a>

    <!--
      Admin surface is chromeless: the public header + footer do NOT
      render over /backoffice routes. Admin is a different product
      scope with its own sidebar + topbar, so the public chrome would
      just blur the boundary between "consumer marketing" and "tool".
    -->
    @if (!isAdmin()) { <app-header /> }
    <main id="main" [class.admin]="isAdmin()" role="main">
      <router-outlet />
    </main>
    @if (!isAdmin()) { <app-footer /> }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      main {
        flex: 1;
      }
      main.admin {
        /* admin shell manages its own layout — don't inherit paper background */
        background: var(--surface-inset);
      }
      .skip {
        position: absolute;
        left: 0;
        top: 0;
        padding: 0.75rem 1.25rem;
        background: var(--ink);
        color: var(--paper);
        transform: translateY(-120%);
        z-index: var(--z-toast);
        transition: transform var(--dur-sm) var(--ease-out);
        font-weight: 600;
      }
      .skip:focus-visible {
        transform: translateY(0);
      }
    `,
  ],
})
export class AppComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  /**
   * True when the user is inside the admin backoffice. We re-evaluate
   * on every NavigationEnd, with `startWith` seeding the initial value
   * so deep-links to `/backoffice` render chromeless on first paint.
   */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly isAdmin = computed(() => this.url().startsWith("/backoffice"));
}
