import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { RoutePipe } from "../../core/pipes/route.pipe";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import {
  ROUTE_PATHS,
  findRouteKey,
} from "../../core/route-paths";
import type { Locale } from "../../core/models/property.model";

/**
 * Sticky top nav with warm-blur backdrop.
 * Collapses to a slim bar after 40px of scroll.
 * Hand-drawn SVG underline on the active nav item (stroke-dashoffset animation).
 */
@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    RoutePipe,
    IconComponent,
    ButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  /**
   * Switch the UI locale AND swap the browser URL to the translated
   * version of the current route, so `/louer` becomes `/rent` (or
   * vice-versa) without the user losing their place.
   */
  switchLocale(locale: Locale): void {
    const current = this.router.url.split("?")[0]!.split("#")[0]!;
    const found = findRouteKey(current);
    this.i18n.setLocale(locale);
    this.closeMobile();

    if (!found) return; // landing / 404 / unknown — leave URL alone
    const target = "/" + ROUTE_PATHS[found.key][locale] + found.rest;
    if (target !== current) {
      this.router.navigateByUrl(target);
    }
  }

  @HostListener("window:scroll")
  onScroll(): void {
    const y = window.scrollY;
    this.scrolled.set(y > 40);
  }
}
