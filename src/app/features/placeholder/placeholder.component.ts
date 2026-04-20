import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { ButtonComponent } from "../../ui/button/button.component";
import { IconComponent } from "../../ui/icon/icon.component";

/**
 * Lightweight placeholder used for routes that are not yet built
 * in Milestone 1 (Rent / Buy / Land / Agents / 404). Keeps the
 * navigation honest during the first client demo.
 */
@Component({
  selector: "app-placeholder",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    ButtonComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ph grain">
      <div class="container ph__inner">
        <span class="eyebrow">— Milestone 2</span>
        <h1 class="ph__title">
          <span>En construction</span>
          <span class="display-italic"> avec soin.</span>
        </h1>
        <p class="ph__sub">
          Cette vue — <strong>{{ key }}</strong> — arrive juste après la
          validation de la landing page. Elle est déjà conçue,
          prête à être implémentée.
        </p>
        <div class="ph__actions">
          <a appButton variant="primary" routerLink="/">
            <app-icon slot="leading" name="arrow" [size]="18" />
            {{ 'brand.name' | t }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .ph {
        min-height: 60vh;
        display: grid;
        place-items: center;
        padding: 6rem 0;
      }
      .ph__inner {
        max-width: 40rem;
        text-align: center;
      }
      .ph__title {
        font-family: var(--font-display);
        font-size: var(--step-5);
        line-height: 1.05;
        letter-spacing: var(--tracking-display);
        font-weight: 500;
        margin: var(--space-4) 0 var(--space-5);
        color: var(--ink);

        .display-italic { color: var(--ochre-deep); }
      }
      .ph__sub {
        font-size: var(--step-1);
        color: var(--ink-soft);
        max-width: 36ch;
        margin: 0 auto var(--space-7);
      }
      .ph__actions {
        display: inline-flex;
        gap: var(--space-3);
        justify-content: center;
      }
      .ph__actions a[appButton] app-icon {
        transform: rotate(180deg);
      }
    `,
  ],
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  readonly key =
    (this.route.snapshot.data["key"] as string) ?? "404";
}
