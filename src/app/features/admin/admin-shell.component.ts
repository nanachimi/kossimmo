import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { I18nService } from "../../core/services/i18n.service";
import { AdminAuthService } from "../../core/services/admin-auth.service";
import { IconComponent } from "../../ui/icon/icon.component";
import { BadgeComponent } from "../../ui/badge/badge.component";
import { MonogramComponent } from "../../ui/monogram/monogram.component";
import { CommandPaletteComponent } from "./command-palette/command-palette.component";
import { Router } from "@angular/router";

interface NavItem {
  readonly path: string;
  readonly icon: string;
  readonly label: { fr: string; en: string };
  readonly badge?: number;
}

/**
 * Admin shell — sidebar + top bar + nested <router-outlet />.
 *
 * The shell is intentionally different from the public header:
 *  - persistent left nav (desktop) / off-canvas drawer (mobile)
 *  - warm-ink background to signal "different space"
 *  - quick-search input bound to a signal so features can react
 */
@Component({
  selector: "app-admin-shell",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    IconComponent,
    BadgeComponent,
    MonogramComponent,
    CommandPaletteComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./admin-shell.component.html",
  styleUrl: "./admin-shell.component.scss",
})
export class AdminShellComponent {
  readonly i18n = inject(I18nService);
  readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  readonly drawerOpen = signal(false);

  readonly roleLabel = (role: string | undefined): string => {
    const locale = this.i18n.locale();
    if (!role) return "";
    const map: Record<string, { fr: string; en: string }> = {
      admin:      { fr: "Admin",         en: "Admin" },
      caseworker: { fr: "Sachbearbeiter", en: "Caseworker" },
      verifier:   { fr: "Vérificateur",   en: "Verifier" },
      content:    { fr: "Contenu",        en: "Content" },
    };
    return map[role]?.[locale] ?? role;
  };

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl("/backoffice/login");
  }

  @ViewChild(CommandPaletteComponent)
  private palette?: CommandPaletteComponent;

  openPalette(): void {
    this.palette?.toggle();
  }

  readonly nav: readonly NavItem[] = [
    {
      path: "/backoffice",
      icon: "sparkles",
      label: { fr: "Vue d'ensemble", en: "Overview" },
    },
    {
      path: "/backoffice/moderation",
      icon: "shield",
      label: { fr: "Modération", en: "Moderation" },
      badge: 27,
    },
    {
      path: "/backoffice/users",
      icon: "user",
      label: { fr: "Utilisateurs", en: "Users" },
    },
    {
      path: "/backoffice/team",
      icon: "check",
      label: { fr: "Équipe vérificateurs", en: "Verifier team" },
    },
    {
      path: "/backoffice/reporting",
      icon: "building",
      label: { fr: "Reporting", en: "Reporting" },
    },
    {
      path: "/backoffice/flags",
      icon: "bolt",
      label: { fr: "Feature flags", en: "Feature flags" },
    },
  ];

  toggleDrawer(): void {
    this.drawerOpen.update((v) => !v);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
