import { Pipe, PipeTransform, inject } from "@angular/core";
import { I18nService } from "../services/i18n.service";

/**
 * `{{ 'hero.title.1' | t }}`
 *
 * Pure=false so it reacts to locale changes. Under the hood this
 * is backed by a signal read, so re-evaluation is cheap and
 * change-detection scoped.
 */
@Pipe({ name: "t", standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string): string {
    // Touch the signal so the pipe re-runs on locale change.
    this.i18n.locale();
    return this.i18n.t(key);
  }
}
