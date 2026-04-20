import { Injectable, signal, computed } from "@angular/core";
import type { Locale } from "../models/property.model";
import { FR } from "../../i18n/fr";
import { EN } from "../../i18n/en";

/**
 * Lightweight runtime i18n.
 *
 * Note: For the prototype phase we use a plain key/value service that
 * swaps dictionaries reactively via signals. This keeps the bundle
 * small and the DX fast. The move to @angular/localize (separate
 * builds per locale) is a single migration step and documented in
 * README.md → "Next steps for backend & production".
 */

const DICTS = { fr: FR, en: EN } as const;
const STORAGE_KEY = "kossimmo.locale";

@Injectable({ providedIn: "root" })
export class I18nService {
  readonly locale = signal<Locale>(this.detectInitial());
  readonly dict = computed(() => DICTS[this.locale()]);

  setLocale(next: Locale): void {
    this.locale.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — ignore */
    }
    document.documentElement.lang = next;
  }

  t(key: string): string {
    const dict = this.dict() as Record<string, string>;
    return dict[key] ?? key;
  }

  formatPrice(amount: number, period?: "month" | "year" | "total"): string {
    // XAF has no fractional unit and uses space as thousands separator.
    const formatted = new Intl.NumberFormat(
      this.locale() === "fr" ? "fr-FR" : "en-US",
      { maximumFractionDigits: 0 },
    ).format(amount);
    const unit = "FCFA";
    if (period === "month") {
      return this.locale() === "fr"
        ? `${formatted} ${unit} / mois`
        : `${formatted} ${unit} / month`;
    }
    if (period === "year") {
      return this.locale() === "fr"
        ? `${formatted} ${unit} / an`
        : `${formatted} ${unit} / year`;
    }
    return `${formatted} ${unit}`;
  }

  private detectInitial(): Locale {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "fr" || stored === "en") return stored;
    } catch {
      /* ignore */
    }
    const nav = (navigator.language || "fr").slice(0, 2).toLowerCase();
    return nav === "en" ? "en" : "fr";
  }
}
