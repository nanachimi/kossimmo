import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { I18nService } from "../../../core/services/i18n.service";
import { IconComponent } from "../../../ui/icon/icon.component";
import { MOCK_USERS } from "../../../mocks/admin.mock";
import {
  MOCK_PROPERTIES,
  NEIGHBORHOODS,
} from "../../../mocks/properties.mock";

type CommandGroup = "nav" | "user" | "listing" | "city";

interface CommandItem {
  readonly id: string;
  readonly group: CommandGroup;
  readonly icon: string;
  readonly label: string;
  readonly subtitle?: string;
  readonly route: string;
  readonly hint?: string;
}

/**
 * Command palette — global admin quick-launcher.
 *
 *   - Opens via Cmd+K / Ctrl+K or by clicking the topbar trigger
 *   - Fuzzy-ish substring match across: nav sections, users,
 *     listings, cities
 *   - Full keyboard nav: ↑ ↓ to move, Enter to jump, Esc to close
 *
 * Intentionally self-contained: the admin shell renders one instance
 * and calls `toggle()` from its topbar button. No shared service.
 */
@Component({
  selector: "app-command-palette",
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./command-palette.component.html",
  styleUrl: "./command-palette.component.scss",
})
export class CommandPaletteComponent {
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);

  readonly open = signal(false);
  readonly query = signal("");
  readonly selectedIndex = signal(0);

  @ViewChild("inputEl") inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild("listEl") listEl?: ElementRef<HTMLElement>;

  private readonly navItems = computed<readonly CommandItem[]>(() => {
    const fr = this.i18n.locale() === "fr";
    return [
      {
        id: "nav-overview",
        group: "nav",
        icon: "sparkles",
        label: fr ? "Vue d'ensemble" : "Overview",
        subtitle: fr ? "Tableau de bord" : "Dashboard",
        route: "/backoffice",
        hint: "G O",
      },
      {
        id: "nav-moderation",
        group: "nav",
        icon: "shield",
        label: fr ? "File de modération" : "Moderation queue",
        subtitle: fr ? "Annonces à examiner" : "Listings awaiting review",
        route: "/backoffice/moderation",
        hint: "G M",
      },
      {
        id: "nav-users",
        group: "nav",
        icon: "user",
        label: fr ? "Utilisateurs" : "Users",
        subtitle: fr ? "Comptes de la plateforme" : "Platform accounts",
        route: "/backoffice/users",
        hint: "G U",
      },
      {
        id: "nav-team",
        group: "nav",
        icon: "check",
        label: fr ? "Équipe vérificateurs" : "Verifier team",
        subtitle: fr ? "Employés internes" : "Internal employees",
        route: "/backoffice/team",
        hint: "G T",
      },
      {
        id: "nav-reporting",
        group: "nav",
        icon: "building",
        label: "Reporting",
        subtitle: fr ? "Performance & chiffres" : "Performance & metrics",
        route: "/backoffice/reporting",
        hint: "G R",
      },
      {
        id: "nav-flags",
        group: "nav",
        icon: "bolt",
        label: "Feature flags",
        subtitle: fr ? "Configuration" : "Configuration",
        route: "/backoffice/flags",
        hint: "G F",
      },
    ];
  });

  readonly items = computed<readonly CommandItem[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.navItems();

    const match = (s: string) => s.toLowerCase().includes(q);
    const out: CommandItem[] = [];

    // Nav first — they're the most common jumps
    for (const n of this.navItems()) {
      if (match(n.label) || (n.subtitle && match(n.subtitle))) out.push(n);
    }

    // Users
    for (const u of MOCK_USERS) {
      if (match(u.name) || match(u.email) || match(u.phone) || match(u.city)) {
        out.push({
          id: "user-" + u.id,
          group: "user",
          icon: "user",
          label: u.name,
          subtitle: `${u.email} · ${u.city}`,
          route: "/backoffice/users",
        });
      }
    }

    // Listings
    const locale = this.i18n.locale();
    for (const p of MOCK_PROPERTIES) {
      const title = p.title[locale] ?? p.title.fr;
      if (
        match(title) ||
        match(p.location.neighborhood) ||
        match(p.location.city) ||
        match(p.agent.name)
      ) {
        out.push({
          id: "listing-" + p.id,
          group: "listing",
          icon: "building",
          label: title,
          subtitle: `${p.location.neighborhood}, ${p.location.city} · ${p.agent.name}`,
          route: "/" +
            (locale === "fr" ? "annonce" : "property") +
            "/" + p.slug,
        });
      }
    }

    // Cities
    for (const [city, hoods] of Object.entries(NEIGHBORHOODS)) {
      if (match(city) || hoods.some(match)) {
        out.push({
          id: "city-" + city,
          group: "city",
          icon: "pin",
          label: city,
          subtitle: `${hoods.length} ${locale === "fr" ? "quartiers" : "neighborhoods"}`,
          route: "/" + (locale === "fr" ? "louer" : "rent"),
        });
      }
    }

    return out.slice(0, 14);
  });

  // Group the visible items for the section headers in the template.
  readonly grouped = computed(() => {
    const groups: { key: CommandGroup; label: string; items: CommandItem[] }[] = [];
    const labels: Record<CommandGroup, { fr: string; en: string }> = {
      nav: { fr: "Navigation", en: "Navigation" },
      user: { fr: "Utilisateurs", en: "Users" },
      listing: { fr: "Annonces", en: "Listings" },
      city: { fr: "Villes", en: "Cities" },
    };
    const order: CommandGroup[] = ["nav", "user", "listing", "city"];
    for (const key of order) {
      const items = this.items().filter((i) => i.group === key);
      if (items.length) {
        groups.push({ key, label: labels[key][this.i18n.locale()], items });
      }
    }
    return groups;
  });

  // Flat index used for keyboard selection (mirrors render order)
  readonly flatItems = computed<readonly CommandItem[]>(() => {
    return this.grouped().flatMap((g) => g.items);
  });

  constructor() {
    // Reset selection + scroll when the list changes
    effect(() => {
      this.items();
      this.selectedIndex.set(0);
    });
  }

  toggle(): void {
    this.open.update((v) => !v);
    if (this.open()) {
      this.query.set("");
      this.selectedIndex.set(0);
      queueMicrotask(() => this.inputEl?.nativeElement.focus());
    }
  }

  close(): void {
    this.open.set(false);
  }

  select(item: CommandItem): void {
    this.close();
    this.router.navigateByUrl(item.route);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
  }

  @HostListener("window:keydown", ["$event"])
  onKey(e: KeyboardEvent): void {
    const isCmdK =
      (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
    if (isCmdK) {
      e.preventDefault();
      this.toggle();
      return;
    }
    if (!this.open()) return;

    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
      return;
    }
    const total = this.flatItems().length;
    if (total === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectedIndex.update((i) => (i + 1) % total);
      this.scrollSelectedIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectedIndex.update((i) => (i - 1 + total) % total);
      this.scrollSelectedIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = this.flatItems()[this.selectedIndex()];
      if (item) this.select(item);
    }
  }

  private scrollSelectedIntoView(): void {
    queueMicrotask(() => {
      const host = this.listEl?.nativeElement;
      if (!host) return;
      const rows = host.querySelectorAll<HTMLElement>("[data-cp-row]");
      const el = rows[this.selectedIndex()];
      el?.scrollIntoView({ block: "nearest" });
    });
  }

  groupAriaId(key: CommandGroup): string {
    return "cp-group-" + key;
  }

  /** Absolute index of a given group-item pair, for keyboard match. */
  indexFor(item: CommandItem): number {
    return this.flatItems().indexOf(item);
  }
}
