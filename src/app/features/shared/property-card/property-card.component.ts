import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import type { Property } from "../../../core/models/property.model";
import { TranslatePipe } from "../../../core/pipes/t.pipe";
import { RoutePipe } from "../../../core/pipes/route.pipe";
import { XafPipe } from "../../../core/pipes/xaf.pipe";
import { BadgeComponent } from "../../../ui/badge/badge.component";
import { IconComponent } from "../../../ui/icon/icon.component";

/**
 * Editorial property card. Used in featured-slider, search grid,
 * map side-panel. Keeps its own favorite state locally for now —
 * the favorites service will own this post-backend.
 */
@Component({
  selector: "app-property-card",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    RoutePipe,
    XafPipe,
    BadgeComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./property-card.component.html",
  styleUrl: "./property-card.component.scss",
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;
  @Input() locale: "fr" | "en" = "fr";

  readonly saved = signal(false);

  toggleSaved(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.saved.update((v) => !v);
  }

  openWhatsApp(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const phone = this.property.agent.whatsapp.replace(/\D/g, "");
    const title =
      this.property.title[this.locale] ?? this.property.title.fr;
    const msg = encodeURIComponent(
      this.locale === "fr"
        ? `Bonjour, je m'intéresse à l'annonce : ${title}`
        : `Hello, I'm interested in the listing: ${title}`,
    );
    window.open(
      `https://wa.me/${phone}?text=${msg}`,
      "_blank",
      "noopener",
    );
  }
}
