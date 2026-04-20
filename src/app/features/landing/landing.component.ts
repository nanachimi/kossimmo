import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { PropertyService } from "../../core/services/property.service";
import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { RoutePipe } from "../../core/pipes/route.pipe";
import { ButtonComponent } from "../../ui/button/button.component";
import { BadgeComponent } from "../../ui/badge/badge.component";
import { ChipComponent } from "../../ui/chip/chip.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { InputComponent } from "../../ui/input/input.component";
import { PropertyCardComponent } from "../shared/property-card/property-card.component";
import { FEATURED_CITIES } from "../../mocks/properties.mock";

type Category = {
  readonly key:
    | "apartment"
    | "house"
    | "compound"
    | "sq"
    | "land"
    | "commercial";
  readonly icon: string;
};

type JournalItem = {
  readonly tag: { fr: string; en: string };
  readonly title: { fr: string; en: string };
  readonly image: string;
};

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    RoutePipe,
    ButtonComponent,
    BadgeComponent,
    ChipComponent,
    IconComponent,
    InputComponent,
    PropertyCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./landing.component.html",
  styleUrl: "./landing.component.scss",
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(I18nService);
  private readonly property = inject(PropertyService);

  readonly featured = this.property.featured();
  readonly cities = FEATURED_CITIES;
  readonly activeCategory = signal<Category["key"]>("apartment");

  // Animated, mutable stat values (used by count-up in the hero).
  readonly statListings = signal(0);
  readonly statAgents = signal(0);
  readonly statCities = signal(0);

  // Subtle parallax on the hero image.
  readonly heroScrollY = signal(0);

  @ViewChild("revealRoot", { static: true })
  revealRoot!: ElementRef<HTMLElement>;

  readonly categories: readonly Category[] = [
    { key: "apartment", icon: "building" },
    { key: "house", icon: "home" },
    { key: "compound", icon: "shield" },
    { key: "sq", icon: "user" },
    { key: "land", icon: "leaf" },
    { key: "commercial", icon: "store" },
  ];

  readonly journal: readonly JournalItem[] = [
    {
      tag: { fr: "Marché", en: "Market" },
      title: {
        fr: "Douala 2026 : où les loyers progressent le plus vite",
        en: "Douala 2026: where rents are rising fastest",
      },
      image:
        "https://images.unsplash.com/photo-1554072675-66db59dba46f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      tag: { fr: "Guide", en: "Guide" },
      title: {
        fr: "Vérifier un titre foncier avant d'acheter un terrain",
        en: "How to verify a land title before buying",
      },
      image:
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      tag: { fr: "Quartier", en: "Neighborhood" },
      title: {
        fr: "Bastos, Yaoundé : le standing face aux embouteillages",
        en: "Bastos, Yaoundé: luxury versus traffic",
      },
      image:
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  private io?: IntersectionObserver;
  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Below-the-fold sections reveal on scroll.
    if ("IntersectionObserver" in window) {
      this.io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("in-view");
              this.io?.unobserve(e.target);
            }
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
      );
      const nodes =
        this.revealRoot.nativeElement.querySelectorAll<HTMLElement>(
          "[data-reveal]",
        );
      nodes.forEach((n) => this.io!.observe(n));
    }

    // Count-up begins shortly after the hero lines have landed.
    const delay = this.reducedMotion ? 0 : 900;
    setTimeout(() => {
      this.countUp(this.statListings, 3544, 1400);
      this.countUp(this.statAgents, 128, 1200);
      this.countUp(this.statCities, 12, 900);
    }, delay);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  setCategory(key: Category["key"]): void {
    this.activeCategory.set(key);
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(): void {
    if (this.reducedMotion) return;
    const y = Math.max(0, Math.min(window.scrollY, 600));
    this.heroScrollY.set(y);
  }

  /**
   * requestAnimationFrame-driven count-up. Writes to a signal
   * (OnPush-friendly). Uses an ease-out curve so the number
   * settles organically rather than stopping hard.
   */
  private countUp(
    target: ReturnType<typeof signal<number>>,
    to: number,
    durationMs: number,
  ): void {
    if (this.reducedMotion) {
      target.set(to);
      return;
    }
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      target.set(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
