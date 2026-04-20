import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { I18nService } from "../../core/services/i18n.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { IconComponent } from "../../ui/icon/icon.component";
import { BadgeComponent } from "../../ui/badge/badge.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { ChipComponent } from "../../ui/chip/chip.component";
import { MonogramComponent } from "../../ui/monogram/monogram.component";
import { MOCK_AGENTS } from "../../mocks/properties.mock";
import type { Agent } from "../../core/models/property.model";

@Component({
  selector: "app-agencies",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    IconComponent,
    BadgeComponent,
    ButtonComponent,
    ChipComponent,
    MonogramComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./agencies.component.html",
  styleUrl: "./agencies.component.scss",
})
export class AgenciesComponent {
  readonly i18n = inject(I18nService);
  readonly agents = MOCK_AGENTS;

  readonly query = signal("");
  readonly onlyVerified = signal(false);

  readonly filtered = computed<readonly Agent[]>(() => {
    const q = this.query().trim().toLowerCase();
    return this.agents.filter((a) => {
      if (this.onlyVerified() && !a.verified) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        (a.agency ?? "").toLowerCase().includes(q)
      );
    });
  });

  openWhatsApp(a: Agent): void {
    const phone = a.whatsapp.replace(/\D/g, "");
    const msg = encodeURIComponent(
      this.i18n.locale() === "fr"
        ? `Bonjour ${a.name}, je cherche un bien et souhaite échanger avec vous.`
        : `Hello ${a.name}, I'm looking for a property and would like to talk.`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank", "noopener");
  }
}
