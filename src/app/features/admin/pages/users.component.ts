import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { I18nService } from "../../../core/services/i18n.service";
import { BadgeComponent } from "../../../ui/badge/badge.component";
import { ChipComponent } from "../../../ui/chip/chip.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { MonogramComponent } from "../../../ui/monogram/monogram.component";
import { MOCK_USERS } from "../../../mocks/admin.mock";
import type {
  PlatformUser,
  UserAccountType,
  UserStatus,
} from "../../../core/models/admin.model";

@Component({
  selector: "app-admin-users",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeComponent,
    ChipComponent,
    IconComponent,
    MonogramComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class AdminUsersComponent {
  readonly i18n = inject(I18nService);

  readonly users = signal<readonly PlatformUser[]>(MOCK_USERS);
  readonly query = signal("");
  readonly filterType = signal<UserAccountType | "all">("all");
  readonly filterStatus = signal<UserStatus | "all">("all");
  readonly openMenuFor = signal<string | null>(null);

  readonly typeFilters: readonly (UserAccountType | "all")[] = [
    "all",
    "seeker",
    "owner",
    "agent",
    "caseworker",
    "admin",
  ];

  readonly statusFilters: readonly (UserStatus | "all")[] = [
    "all",
    "active",
    "pending",
    "suspended",
    "banned",
  ];

  readonly filtered = computed<readonly PlatformUser[]>(() => {
    const q = this.query().trim().toLowerCase();
    const t = this.filterType();
    const s = this.filterStatus();
    return this.users().filter((u) => {
      if (t !== "all" && u.type !== t) return false;
      if (s !== "all" && u.status !== s) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.city.toLowerCase().includes(q)
      );
    });
  });

  readonly counts = computed(() => {
    const all = this.users();
    return {
      total: all.length,
      active: all.filter((u) => u.status === "active").length,
      pending: all.filter((u) => u.status === "pending").length,
      suspended: all.filter(
        (u) => u.status === "suspended" || u.status === "banned",
      ).length,
    };
  });

  statusTone(s: UserStatus): "success" | "accent" | "alert" | "neutral" {
    switch (s) {
      case "active":
        return "success";
      case "pending":
        return "accent";
      case "suspended":
      case "banned":
        return "alert";
    }
  }

  toggleMenu(id: string): void {
    this.openMenuFor.update((cur) => (cur === id ? null : id));
  }

  updateStatus(id: string, status: UserStatus): void {
    this.users.update((list) =>
      list.map((u) => (u.id === id ? { ...u, status } : u)),
    );
    this.openMenuFor.set(null);
  }

  typeLabel(type: UserAccountType | "all"): string {
    const locale = this.i18n.locale();
    const map: Record<UserAccountType | "all", { fr: string; en: string }> = {
      all: { fr: "Tous", en: "All" },
      seeker: { fr: "Mieter / Acheteur", en: "Renter / Buyer" },
      owner: { fr: "Propriétaire", en: "Owner" },
      agent: { fr: "Agent", en: "Agent" },
      caseworker: { fr: "Sachbearbeiter", en: "Caseworker" },
      admin: { fr: "Admin", en: "Admin" },
    };
    return map[type][locale];
  }

  statusLabel(s: UserStatus | "all"): string {
    const locale = this.i18n.locale();
    const map: Record<UserStatus | "all", { fr: string; en: string }> = {
      all: { fr: "Tous", en: "All" },
      active: { fr: "Actif", en: "Active" },
      pending: { fr: "En attente", en: "Pending" },
      suspended: { fr: "Suspendu", en: "Suspended" },
      banned: { fr: "Banni", en: "Banned" },
    };
    return map[s][locale];
  }
}
