import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

import { I18nService } from "../../../core/services/i18n.service";
import { IconComponent } from "../../../ui/icon/icon.component";
import { BadgeComponent } from "../../../ui/badge/badge.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ChipComponent } from "../../../ui/chip/chip.component";
import { MiniChartComponent } from "../shared/mini-chart.component";
import {
  ADMIN_KPIS,
  GROWTH_SERIES,
  LISTINGS_BY_CITY,
  MODERATION_SERIES,
} from "../../../mocks/admin.mock";

type Range = "7d" | "30d" | "90d" | "12m";

@Component({
  selector: "app-admin-reporting",
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    BadgeComponent,
    ButtonComponent,
    ChipComponent,
    MiniChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./reporting.component.html",
  styleUrl: "./reporting.component.scss",
})
export class AdminReportingComponent {
  readonly i18n = inject(I18nService);
  readonly range = signal<Range>("90d");

  readonly growth = GROWTH_SERIES;
  readonly mods = MODERATION_SERIES;
  readonly cities = LISTINGS_BY_CITY;
  readonly kpis = ADMIN_KPIS;

  readonly ranges: readonly Range[] = ["7d", "30d", "90d", "12m"];

  rangeLabel(r: Range): string {
    return {
      "7d":  this.i18n.locale() === "fr" ? "7 j" : "7 d",
      "30d": this.i18n.locale() === "fr" ? "30 j" : "30 d",
      "90d": this.i18n.locale() === "fr" ? "90 j" : "90 d",
      "12m": this.i18n.locale() === "fr" ? "12 mois" : "12 mo",
    }[r];
  }

  // Top agents (hardcoded snapshot for the report)
  readonly topAgents: readonly { name: string; listings: number; city: string }[] = [
    { name: "Jean-Paul Kemo", listings: 64, city: "Douala" },
    { name: "Bessem Etonde", listings: 42, city: "Douala" },
    { name: "Achille Mbarga", listings: 28, city: "Yaoundé" },
    { name: "Fatou Njoya", listings: 19, city: "Bafoussam" },
    { name: "Aïcha Ella", listings: 11, city: "Douala" },
  ];
}
