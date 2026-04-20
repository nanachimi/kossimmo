import { Pipe, PipeTransform, inject } from "@angular/core";
import { I18nService } from "../services/i18n.service";
import { pathFor, type RouteKey } from "../route-paths";

/**
 * Template helper: returns the localized URL for a logical route key.
 *
 *   <a [routerLink]="'rent' | route">…</a>       →  /louer  (FR)  ·  /rent  (EN)
 *   <a [routerLink]="[('property' | route), slug]">…</a>  →  /annonce/xxx  ·  /property/xxx
 *
 * `pure: false` so the pipe re-evaluates when the locale signal
 * changes. The signal read inside keeps it change-detection-friendly.
 */
@Pipe({ name: "route", standalone: true, pure: false })
export class RoutePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: RouteKey): string {
    return pathFor(key, this.i18n.locale());
  }
}
