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

type StepKey =
  | "basics"
  | "location"
  | "photos"
  | "infrastructure"
  | "price"
  | "preview";

interface WizardStep {
  readonly key: StepKey;
  readonly title: { fr: string; en: string };
}

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

  readonly steps: readonly WizardStep[] = [
    { key: "basics", title: { fr: "L'essentiel", en: "Basics" } },
    { key: "location", title: { fr: "Localisation", en: "Location" } },
    { key: "photos", title: { fr: "Photos", en: "Photos" } },
    { key: "infrastructure", title: { fr: "Infrastructure", en: "Infrastructure" } },
    { key: "price", title: { fr: "Prix & dispo.", en: "Price & availability" } },
    { key: "preview", title: { fr: "Aperçu", en: "Preview" } },
  ];

  readonly currentIndex = signal(0);
  readonly current = computed(() => this.steps[this.currentIndex()]!);
  readonly progress = computed(
    () => ((this.currentIndex() + 1) / this.steps.length) * 100,
  );

  // Autosave indicator — toggled briefly after any field edit
  readonly saving = signal(false);
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  // Expose Math for template clamps (bedroom/bathroom steppers).
  readonly Math = Math;

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

  readonly cities = ["Douala", "Yaoundé", "Bafoussam", "Kribi", "Limbe"];

  readonly ready = computed(() => {
    return (
      this.title().trim().length >= 6 &&
      this.city() &&
      this.price() != null &&
      this.price()! > 0
    );
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
    if (i <= this.currentIndex()) {
      this.currentIndex.set(i);
    }
  }

  addPhoto(): void {
    // Stub — in production this opens a file picker.
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

  submit(): void {
    // Stub — would call PropertyService.create(…) against the API.
    alert(
      this.i18n.locale() === "fr"
        ? "Annonce envoyée pour modération. Vous recevrez une notification."
        : "Listing submitted for review. You will receive a notification.",
    );
  }
}
