import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ROUTE_PATHS, findRouteKey } from "../../core/route-paths";
import type { Locale } from "../../core/models/property.model";
import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { RoutePipe } from "../../core/pipes/route.pipe";
import { IconComponent } from "../../ui/icon/icon.component";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, RoutePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
})
export class FooterComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  readonly year = new Date().getFullYear();

  switch(locale: Locale): void {
    const current = this.router.url.split("?")[0]!.split("#")[0]!;
    const found = findRouteKey(current);
    this.i18n.setLocale(locale);
    if (!found) return;
    const target = "/" + ROUTE_PATHS[found.key][locale] + found.rest;
    if (target !== current) this.router.navigateByUrl(target);
  }
}
