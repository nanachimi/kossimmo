import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { I18nService } from "../../../core/services/i18n.service";
import { BadgeComponent } from "../../../ui/badge/badge.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ChipComponent } from "../../../ui/chip/chip.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { MonogramComponent } from "../../../ui/monogram/monogram.component";
import { MOCK_EMPLOYEES } from "../../../mocks/admin.mock";
import type { AdminRole, Employee } from "../../../core/models/admin.model";

@Component({
  selector: "app-admin-team",
  standalone: true,
  imports: [
    CommonModule,
    BadgeComponent,
    ButtonComponent,
    ChipComponent,
    IconComponent,
    MonogramComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./team.component.html",
  styleUrl: "./team.component.scss",
})
export class AdminTeamComponent {
  readonly i18n = inject(I18nService);
  readonly employees = MOCK_EMPLOYEES;
  readonly filterRole = signal<AdminRole | "all">("all");

  readonly roles: readonly (AdminRole | "all")[] = [
    "all",
    "admin",
    "caseworker",
    "verifier",
    "content",
  ];

  readonly filtered = computed<readonly Employee[]>(() => {
    const r = this.filterRole();
    return r === "all"
      ? this.employees
      : this.employees.filter((e) => e.role === r);
  });

  readonly teamStats = computed(() => {
    const e = this.employees;
    const verifiers = e.filter((x) => x.role === "verifier");
    return {
      headcount: e.length,
      verifiers: verifiers.length,
      verifiersActive: verifiers.filter((v) => v.status === "active").length,
      verifiedThisMonth: e.reduce((n, x) => n + x.verifiedThisMonth, 0),
      avgReview: verifiers.length
        ? Math.round(
            verifiers.reduce((n, x) => n + x.avgReviewMinutes, 0) /
              verifiers.length,
          )
        : 0,
    };
  });

  roleLabel(r: AdminRole | "all"): string {
    const locale = this.i18n.locale();
    const map: Record<AdminRole | "all", { fr: string; en: string }> = {
      all: { fr: "Tous", en: "All" },
      admin: { fr: "Admin", en: "Admin" },
      caseworker: { fr: "Sachbearbeiter", en: "Caseworker" },
      verifier: { fr: "Vérificateur", en: "Verifier" },
      content: { fr: "Contenu", en: "Content" },
    };
    return map[r][locale];
  }

  statusTone(
    s: Employee["status"],
  ): "success" | "accent" | "neutral" | "alert" {
    switch (s) {
      case "active":
        return "success";
      case "onboarding":
        return "accent";
      case "leave":
        return "neutral";
      case "offboarded":
        return "alert";
    }
  }

  statusLabel(s: Employee["status"]): string {
    const locale = this.i18n.locale();
    const map: Record<Employee["status"], { fr: string; en: string }> = {
      active: { fr: "Actif", en: "Active" },
      onboarding: { fr: "En formation", en: "Onboarding" },
      leave: { fr: "En congé", en: "On leave" },
      offboarded: { fr: "Parti", en: "Offboarded" },
    };
    return map[s][locale];
  }
}
