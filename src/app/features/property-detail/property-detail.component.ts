import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { pathFor } from "../../core/route-paths";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

import { PropertyService } from "../../core/services/property.service";
import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { RoutePipe } from "../../core/pipes/route.pipe";
import { XafPipe } from "../../core/pipes/xaf.pipe";
import { IconComponent } from "../../ui/icon/icon.component";
import { BadgeComponent } from "../../ui/badge/badge.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { MonogramComponent } from "../../ui/monogram/monogram.component";

@Component({
  selector: "app-property-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    RoutePipe,
    XafPipe,
    IconComponent,
    BadgeComponent,
    ButtonComponent,
    MonogramComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./property-detail.component.html",
  styleUrl: "./property-detail.component.scss",
})
export class PropertyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(PropertyService);
  readonly i18n = inject(I18nService);

  readonly slug = toSignal(
    this.route.paramMap.pipe(map((p) => p.get("slug") ?? "")),
    { initialValue: "" },
  );

  readonly property = computed(() => this.service.bySlug(this.slug()));

  readonly activePhoto = signal(0);
  readonly lightboxOpen = signal(false);
  readonly showContactForm = signal(false);

  setPhoto(i: number): void {
    this.activePhoto.set(i);
  }

  openLightbox(): void {
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  openWhatsApp(): void {
    const p = this.property();
    if (!p) return;
    const phone = p.agent.whatsapp.replace(/\D/g, "");
    const title = p.title[this.i18n.locale()] ?? p.title.fr;
    const msg = encodeURIComponent(
      this.i18n.locale() === "fr"
        ? `Bonjour ${p.agent.name}, je suis intéressé par l'annonce : ${title}`
        : `Hello ${p.agent.name}, I'm interested in: ${title}`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank", "noopener");
  }

  submitVisit(): void {
    alert(
      this.i18n.locale() === "fr"
        ? "Demande de visite envoyée. L'agent vous contactera sous 24h."
        : "Visit request sent. The agent will reach out within 24h.",
    );
    this.showContactForm.set(false);
  }

  back(): void {
    // Fall back to /rent in the current locale if there is no
    // history. `history.back()` is preferred so search filters
    // and scroll position are preserved.
    if (history.length > 1) history.back();
    else this.router.navigateByUrl(pathFor("rent", this.i18n.locale()));
  }
}
