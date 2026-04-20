import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { ButtonComponent } from "../../ui/button/button.component";
import { IconComponent } from "../../ui/icon/icon.component";

/**
 * Generic editorial "static" page. The route provides `key` and
 * optional `pretext` (route data) — the component resolves the
 * copy from a small dictionary so we have ONE component for
 * About / Contact / Journal / Legal instead of four files.
 */
type PageKey =
  | "about"
  | "contact"
  | "journal"
  | "legal-terms"
  | "legal-privacy"
  | "legal-cookies";

interface PageCopy {
  eyebrow: { fr: string; en: string };
  title: { fr: string; en: string };
  body: { fr: string; en: string }[];
}

const COPY: Readonly<Record<PageKey, PageCopy>> = {
  about: {
    eyebrow: { fr: "À propos", en: "About" },
    title: {
      fr: "Construire le Zillow camerounais, avec soin.",
      en: "Building the Cameroonian Zillow, with care.",
    },
    body: [
      {
        fr: "Kossimmo est né d'un constat simple : le marché immobilier camerounais mérite mieux que des groupes WhatsApp et des annonces photocopiées. Nous construisons une plateforme qui respecte les réalités locales — WhatsApp comme canal premier, transparence sur l'infrastructure, vérification manuelle des agents.",
        en: "Kossimmo was born from a simple observation: the Cameroonian real estate market deserves better than WhatsApp groups and photocopied flyers. We're building a platform that respects local realities — WhatsApp as the primary channel, infrastructure transparency, hand-vetted agents.",
      },
      {
        fr: "Notre équipe est basée à Douala et Yaoundé. Nous croyons que la meilleure technologie est celle qui disparaît derrière l'usage.",
        en: "Our team is based in Douala and Yaoundé. We believe the best technology is the one that disappears behind the use.",
      },
    ],
  },
  contact: {
    eyebrow: { fr: "Nous contacter", en: "Contact" },
    title: {
      fr: "Une question, un partenariat ?",
      en: "A question, a partnership?",
    },
    body: [
      {
        fr: "Email : hello@kossimmo.com · WhatsApp : +237 6 77 00 12 34 · Adresse : Bonanjo, Douala. Nous répondons sous 24h les jours ouvrés.",
        en: "Email: hello@kossimmo.com · WhatsApp: +237 6 77 00 12 34 · Address: Bonanjo, Douala. We reply within 24h on business days.",
      },
    ],
  },
  journal: {
    eyebrow: { fr: "Journal", en: "Journal" },
    title: {
      fr: "Comprendre le marché, ensemble.",
      en: "Understanding the market, together.",
    },
    body: [
      {
        fr: "Des articles pour démêler les prix, les quartiers, les titres fonciers. Rédigés par des journalistes et experts camerounais.",
        en: "Articles to demystify prices, neighborhoods, land titles. Written by Cameroonian journalists and experts.",
      },
    ],
  },
  "legal-terms": {
    eyebrow: { fr: "Mentions légales", en: "Legal" },
    title: {
      fr: "Conditions d'utilisation",
      en: "Terms of service",
    },
    body: [
      {
        fr: "En utilisant Kossimmo, vous acceptez les présentes conditions. Document détaillé à venir avant la mise en production. Pour toute question juridique contactez legal@kossimmo.com.",
        en: "By using Kossimmo, you agree to these terms. Full document coming before production. For legal questions contact legal@kossimmo.com.",
      },
    ],
  },
  "legal-privacy": {
    eyebrow: { fr: "Mentions légales", en: "Legal" },
    title: {
      fr: "Politique de confidentialité",
      en: "Privacy policy",
    },
    body: [
      {
        fr: "Nous collectons le strict nécessaire pour faire fonctionner la plateforme. Pas de revente de données à des tiers. Vos favoris et recherches vous appartiennent. Document complet à venir.",
        en: "We collect the bare minimum to run the platform. No data resale to third parties. Your favorites and searches belong to you. Full document coming.",
      },
    ],
  },
  "legal-cookies": {
    eyebrow: { fr: "Mentions légales", en: "Legal" },
    title: {
      fr: "Cookies",
      en: "Cookies",
    },
    body: [
      {
        fr: "Nous utilisons des cookies strictement techniques (session, préférence de langue). Pas de tracking publicitaire.",
        en: "We only use strictly technical cookies (session, language preference). No advertising tracking.",
      },
    ],
  },
};

@Component({
  selector: "app-static-page",
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
    @if (copy(); as c) {
      <section class="sp">
        <div class="container sp__inner">
          <span class="eyebrow">— {{ c.eyebrow[i18n.locale()] }}</span>
          <h1 class="sp__title">{{ c.title[i18n.locale()] }}</h1>
          <div class="sp__body">
            @for (p of c.body; track $index) {
              <p>{{ p[i18n.locale()] }}</p>
            }
          </div>
          <div class="sp__cta">
            <a appButton variant="primary" routerLink="/">
              <app-icon slot="leading" name="arrow" [size]="18" />
              {{ i18n.locale() === "fr" ? "Retour à l'accueil" : "Back home" }}
            </a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [
    `
      :host { display: block; }
      .sp { padding: var(--space-16) 0; min-height: 60vh; }
      .sp__inner { max-width: 48rem; }
      .sp__title {
        font-family: var(--font-display);
        font-size: var(--step-5);
        font-weight: 500;
        letter-spacing: var(--tracking-display);
        line-height: 1.05;
        margin: var(--space-3) 0 var(--space-6);
      }
      .sp__body {
        display: grid;
        gap: var(--space-4);
        font-size: var(--step-1);
        color: var(--ink-soft);
        line-height: var(--lh-body);
        margin-bottom: var(--space-8);
      }
      .sp__cta a[appButton] app-icon { transform: rotate(180deg); }
    `,
  ],
})
export class StaticPageComponent {
  readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);

  readonly key = toSignal(
    this.route.data.pipe(map((d) => (d["key"] as PageKey) ?? "about")),
    { initialValue: "about" as PageKey },
  );

  readonly copy = () => COPY[this.key()];
}
