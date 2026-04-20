import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { ChipComponent } from "../../ui/chip/chip.component";
import { BadgeComponent } from "../../ui/badge/badge.component";
import type { PropertyType } from "../../core/models/property.model";

type StepKey = "bien" | "emplacement" | "description" | "prix";

interface WizardStep {
  readonly key: StepKey;
  readonly title: { fr: string; en: string };
  readonly hint: { fr: string; en: string };
}

interface TypeOption {
  readonly key: PropertyType;
  readonly icon: string;
  readonly fr: string;
  readonly en: string;
  readonly blurb: { fr: string; en: string };
}

/**
 * Publier wizard — 4-step publishing flow with a live preview
 * column on desktop. Each step answers a plain-language question
 * ("Votre bien" / "Où ?" / "Comment le montrer ?" / "Combien ?")
 * so the user always knows what's being asked and why.
 */
@Component({
  selector: "app-list-property",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslatePipe,
    IconComponent,
    ButtonComponent,
    ChipComponent,
    BadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./list-property.component.html",
  styleUrl: "./list-property.component.scss",
})
export class ListPropertyComponent {
  readonly i18n = inject(I18nService);
  readonly Math = Math;

  readonly steps: readonly WizardStep[] = [
    {
      key: "bien",
      title: { fr: "Votre bien", en: "Your property" },
      hint: { fr: "Que publiez-vous ?", en: "What are you listing?" },
    },
    {
      key: "emplacement",
      title: { fr: "Emplacement", en: "Location" },
      hint: { fr: "Où se trouve-t-il ?", en: "Where is it?" },
    },
    {
      key: "description",
      title: { fr: "Description & photos", en: "Description & photos" },
      hint: {
        fr: "Comment le présenter ?",
        en: "How to show it off?",
      },
    },
    {
      key: "prix",
      title: { fr: "Prix & qualité", en: "Price & quality" },
      hint: {
        fr: "Prix, infrastructure, publication.",
        en: "Price, infrastructure, publication.",
      },
    },
  ];

  readonly currentIndex = signal(0);
  readonly current = computed(() => this.steps[this.currentIndex()]!);
  readonly progress = computed(
    () => ((this.currentIndex() + 1) / this.steps.length) * 100,
  );
  readonly previewOpen = signal(false); // mobile drawer

  // Autosave indicator
  readonly saving = signal(false);
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  // ─── Form state ─────────────────────────────────────────
  readonly mode = signal<"rent" | "sale">("rent");
  readonly type = signal<PropertyType>("apartment");
  readonly title = signal("");
  readonly description = signal("");
  readonly furnished = signal(false);

  readonly city = signal("Douala");
  readonly neighborhood = signal("");

  readonly bedrooms = signal(2);
  readonly bathrooms = signal(1);
  readonly livingArea = signal<number | null>(null);
  readonly landArea = signal<number | null>(null);

  readonly photos = signal<string[]>([]);

  readonly water = signal<"city" | "borehole" | "tank">("city");
  readonly power = signal<"grid" | "grid_generator" | "solar">("grid");
  readonly road = signal<"paved" | "gravel" | "dirt">("paved");
  readonly security = signal<"open" | "fenced" | "gated" | "guarded">(
    "fenced",
  );
  readonly hasGenerator = signal(false);
  readonly hasTank = signal(false);

  readonly price = signal<number | null>(null);

  readonly typeOptions: readonly TypeOption[] = [
    { key: "apartment", icon: "building", fr: "Appartement", en: "Apartment",
      blurb: { fr: "Dans un immeuble", en: "In a building" } },
    { key: "house",     icon: "home",     fr: "Maison",      en: "House",
      blurb: { fr: "Villa ou maison indépendante", en: "Villa or stand-alone house" } },
    { key: "compound",  icon: "shield",   fr: "Compound",    en: "Compound",
      blurb: { fr: "Plusieurs bâtiments sécurisés", en: "Multi-building secure plot" } },
    { key: "studio",    icon: "sparkles", fr: "Studio",      en: "Studio",
      blurb: { fr: "Pièce unique meublée", en: "Single furnished room" } },
    { key: "servants_quarters", icon: "user", fr: "Servants Quarters", en: "Servants Quarters",
      blurb: { fr: "Logement annexe indépendant", en: "Independent annex" } },
    { key: "land",      icon: "leaf",     fr: "Terrain",     en: "Land",
      blurb: { fr: "Terrain nu, agricole ou à bâtir", en: "Raw, farmland, or building plot" } },
    { key: "commercial", icon: "store",   fr: "Commerce",    en: "Commercial",
      blurb: { fr: "Boutique, restaurant, local", en: "Shop, restaurant, retail space" } },
    { key: "office",    icon: "building", fr: "Bureau",      en: "Office",
      blurb: { fr: "Espace professionnel", en: "Professional space" } },
  ];

  readonly cities = ["Douala", "Yaoundé", "Bafoussam", "Kribi", "Limbe"];

  // Context-aware visibility: a land listing hides bed/bath/area.
  readonly isLand = computed(() => this.type() === "land");

  readonly ready = computed(() => {
    return (
      this.title().trim().length >= 6 &&
      !!this.city() &&
      this.price() != null &&
      this.price()! > 0
    );
  });

  readonly completeness = computed(() => {
    // Rough percentage of required+optional fields filled. Powers the
    // preview card's "Votre annonce à X %" meter so the user feels
    // forward momentum even mid-flow.
    let filled = 0;
    const total = 8;
    if (this.type()) filled++;
    if (this.mode()) filled++;
    if (this.city()) filled++;
    if (this.neighborhood()) filled++;
    if (this.title().trim().length >= 6) filled++;
    if (this.description().trim().length >= 40) filled++;
    if (this.photos().length) filled++;
    if (this.price() != null && this.price()! > 0) filled++;
    return Math.round((filled / total) * 100);
  });

  /** Helper: translated type label for the live preview card. */
  readonly typeLabel = computed(() => {
    const t = this.typeOptions.find((o) => o.key === this.type());
    return t ? t[this.i18n.locale()] : this.type();
  });

  next(): void {
    if (this.currentIndex() < this.steps.length - 1) {
      this.currentIndex.update((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  prev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  jump(i: number): void {
    if (i <= this.currentIndex()) this.currentIndex.set(i);
  }

  setType(t: PropertyType): void {
    this.type.set(t);
    this.flashSaved();
  }

  addPhoto(): void {
    const placeholders = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1000&q=80",
    ];
    this.photos.update((list) => [
      ...list,
      placeholders[list.length % placeholders.length]!,
    ]);
    this.flashSaved();
  }

  removePhoto(index: number): void {
    this.photos.update((list) => list.filter((_, i) => i !== index));
    this.flashSaved();
  }

  flashSaved(): void {
    this.saving.set(true);
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saving.set(false), 700);
  }

  togglePreview(): void {
    this.previewOpen.update((v) => !v);
  }

  submit(): void {
    alert(
      this.i18n.locale() === "fr"
        ? "Annonce envoyée pour modération. Vous recevrez une notification sous 24 h."
        : "Listing submitted for review. You'll receive a notification within 24 h.",
    );
  }
}
