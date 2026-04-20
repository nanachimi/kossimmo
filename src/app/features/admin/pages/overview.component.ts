import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

import { I18nService } from "../../../core/services/i18n.service";
import { IconComponent } from "../../../ui/icon/icon.component";
import { BadgeComponent } from "../../../ui/badge/badge.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { KpiCardComponent } from "../shared/kpi-card.component";
import { MiniChartComponent } from "../shared/mini-chart.component";
import {
  ADMIN_KPIS,
  GROWTH_SERIES,
  LISTINGS_BY_CITY,
  MOCK_MODERATION,
  MODERATION_SERIES,
} from "../../../mocks/admin.mock";

@Component({
  selector: "app-admin-overview",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    BadgeComponent,
    ButtonComponent,
    KpiCardComponent,
    MiniChartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./overview.component.html",
  styleUrl: "./overview.component.scss",
})
export class AdminOverviewComponent {
  readonly i18n = inject(I18nService);
  readonly kpis = ADMIN_KPIS;
  readonly growth = GROWTH_SERIES;
  readonly mods = MODERATION_SERIES;
  readonly cities = LISTINGS_BY_CITY;
  readonly queue = MOCK_MODERATION;

  priorityTone(p: string): "alert" | "accent" | "neutral" {
    if (p === "high") return "alert";
    if (p === "normal") return "accent";
    return "neutral";
  }

  timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60_000);
    if (mins < 60)
      return this.i18n.locale() === "fr" ? `il y a ${mins} min` : `${mins} min ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24)
      return this.i18n.locale() === "fr" ? `il y a ${hours} h` : `${hours} h ago`;
    const days = Math.round(hours / 24);
    return this.i18n.locale() === "fr" ? `il y a ${days} j` : `${days} d ago`;
  }
}
