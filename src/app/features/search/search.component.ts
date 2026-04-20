import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

import { PropertyService } from "../../core/services/property.service";
import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { PropertyCardComponent } from "../shared/property-card/property-card.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ChipComponent } from "../../ui/chip/chip.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { BadgeComponent } from "../../ui/badge/badge.component";
import type {
  ListingMode,
  Property,
  PropertyType,
} from "../../core/models/property.model";
import { NEIGHBORHOODS } from "../../mocks/properties.mock";

type RoutePreset = "rent" | "buy" | "land";
type SortMode =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "area_desc";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslatePipe,
    PropertyCardComponent,
    IconComponent,
    ChipComponent,
    ButtonComponent,
    BadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss",
})
export class SearchComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly property = inject(PropertyService);
  readonly i18n = inject(I18nService);

  readonly preset = toSignal(
    this.route.data.pipe(map((d) => (d["preset"] as RoutePreset) ?? "rent")),
    { initialValue: "rent" as RoutePreset },
  );

  // ─── Filter state (signals) ───────────────────────────────────
  readonly selectedCity = signal<string | null>(null);
  readonly selectedType = signal<PropertyType | null>(null);
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly minBeds = signal<number | null>(null);
  readonly onlyVerified = signal(false);
  readonly onlyFurnished = signal(false);
  readonly onlyGenerator = signal(false);
  readonly onlySecurity = signal(false);
  readonly sort = signal<SortMode>("newest");
  readonly filtersOpen = signal(false);

  readonly cities = ["Douala", "Yaoundé", "Bafoussam", "Kribi", "Limbe"];
  readonly neighborhoods = computed(() =>
    this.selectedCity()
      ? (NEIGHBORHOODS[this.selectedCity()!] ?? [])
      : [],
  );

  readonly typeOptions: readonly PropertyType[] = [
    "apartment",
    "house",
    "compound",
    "studio",
    "servants_quarters",
    "commercial",
    "office",
    "land",
  ];

  // ─── Derived list ─────────────────────────────────────────────
  readonly results = computed<readonly Property[]>(() => {
    const preset = this.preset();
    let list = this.property.all();

    // Route preset
    if (preset === "land") {
      list = list.filter((p) => p.type === "land");
    } else {
      const mode: ListingMode = preset === "rent" ? "rent" : "sale";
      list = list.filter((p) => p.mode === mode);
    }

    const city = this.selectedCity();
    if (city) list = list.filter((p) => p.location.city === city);

    const type = this.selectedType();
    if (type) list = list.filter((p) => p.type === type);

    const min = this.minPrice();
    if (min != null) list = list.filter((p) => p.price.amount >= min);
    const max = this.maxPrice();
    if (max != null) list = list.filter((p) => p.price.amount <= max);

    const beds = this.minBeds();
    if (beds != null) list = list.filter((p) => p.bedrooms >= beds);

    if (this.onlyVerified()) list = list.filter((p) => p.verified);
    if (this.onlyFurnished()) list = list.filter((p) => p.furnished);
    if (this.onlyGenerator())
      list = list.filter(
        (p) =>
          p.infrastructure.generator ||
          p.infrastructure.power === "grid_generator",
      );
    if (this.onlySecurity())
      list = list.filter(
        (p) =>
          p.infrastructure.security === "gated" ||
          p.infrastructure.security === "guarded",
      );

    // Sort
    const sorted = [...list];
    switch (this.sort()) {
      case "price_asc":
        sorted.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case "area_desc":
        sorted.sort(
          (a, b) =>
            (b.livingArea || b.landArea || 0) -
            (a.livingArea || a.landArea || 0),
        );
        break;
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );
    }
    return sorted;
  });

  readonly activeFilterCount = computed(() => {
    let n = 0;
    if (this.selectedCity()) n++;
    if (this.selectedType()) n++;
    if (this.minPrice() != null) n++;
    if (this.maxPrice() != null) n++;
    if (this.minBeds() != null) n++;
    if (this.onlyVerified()) n++;
    if (this.onlyFurnished()) n++;
    if (this.onlyGenerator()) n++;
    if (this.onlySecurity()) n++;
    return n;
  });

  reset(): void {
    this.selectedCity.set(null);
    this.selectedType.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.minBeds.set(null);
    this.onlyVerified.set(false);
    this.onlyFurnished.set(false);
    this.onlyGenerator.set(false);
    this.onlySecurity.set(false);
  }

  toggleFilters(): void {
    this.filtersOpen.update((v) => !v);
  }

  headline(): string {
    const locale = this.i18n.locale();
    switch (this.preset()) {
      case "rent":
        return locale === "fr" ? "Biens à louer" : "Properties for rent";
      case "buy":
        return locale === "fr" ? "Biens à vendre" : "Properties for sale";
      case "land":
        return locale === "fr" ? "Terrains disponibles" : "Available land";
    }
  }

  subhead(): string {
    const locale = this.i18n.locale();
    const n = this.results().length;
    return locale === "fr"
      ? `${n} annonce${n > 1 ? "s" : ""} correspondantes`
      : `${n} matching listing${n > 1 ? "s" : ""}`;
  }
}
