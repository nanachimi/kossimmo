import { Injectable, signal } from "@angular/core";
import type { FeatureFlag } from "../models/property.model";

/**
 * Every feature in Kossimmo is dual-keyed:
 *   (a) enabled / disabled  — hides or shows the UI affordance
 *   (b) freemium / premium  — decides whether to show a lock + upgrade CTA
 *
 * These defaults mirror the admin-backoffice seed data. The admin
 * screen will surface these exact flags for editing.
 */
const DEFAULTS: readonly FeatureFlag[] = [
  {
    key: "listing.featured",
    enabled: true,
    premium: true,
    label: { fr: "Annonce en vedette", en: "Featured listing" },
  },
  {
    key: "payment.mobileMoney",
    enabled: false,
    premium: true,
    label: { fr: "Paiement Mobile Money", en: "Mobile Money payment" },
  },
  {
    key: "chat.inApp",
    enabled: true,
    premium: false,
    label: { fr: "Messagerie intégrée", en: "In-app chat" },
  },
  {
    key: "chat.whatsapp",
    enabled: true,
    premium: false,
    label: { fr: "Contact WhatsApp", en: "WhatsApp contact" },
  },
  {
    key: "search.savedAlerts",
    enabled: true,
    premium: false,
    label: { fr: "Alertes de recherche", en: "Saved search alerts" },
  },
  {
    key: "auth.oauth",
    enabled: false,
    premium: false,
    label: { fr: "Connexion sociale", en: "Social sign-in" },
  },
  {
    key: "offline.favorites",
    enabled: true,
    premium: false,
    label: { fr: "Favoris hors-ligne", en: "Offline favorites" },
  },
];

@Injectable({ providedIn: "root" })
export class FeatureFlagService {
  private readonly _flags = signal<readonly FeatureFlag[]>(DEFAULTS);

  readonly flags = this._flags.asReadonly();

  isEnabled(key: string): boolean {
    return this._flags().find((f) => f.key === key)?.enabled ?? false;
  }

  isPremium(key: string): boolean {
    return this._flags().find((f) => f.key === key)?.premium ?? false;
  }

  toggle(key: string, field: "enabled" | "premium"): void {
    this._flags.update((list) =>
      list.map((f) => (f.key === key ? { ...f, [field]: !f[field] } : f)),
    );
  }
}
