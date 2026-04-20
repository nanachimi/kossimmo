import type { Route, Routes } from "@angular/router";
import { ROUTE_PATHS, type RouteKey } from "./core/route-paths";
import { adminAuthGuard } from "./core/guards/admin-auth.guard";

/**
 * Register a route under BOTH the FR and EN paths for a given
 * logical key. Angular resolves both to the same lazy component,
 * so `/louer` and `/rent` are interchangeable — the app behaves
 * identically regardless of which URL the user visits.
 *
 * If a key happens to have the same FR and EN path (e.g. `contact`),
 * we only register it once to avoid a duplicate-route collision.
 */
function i18nRoute(
  key: RouteKey,
  suffix: string,
  options: Omit<Route, "path">,
): Routes {
  const p = ROUTE_PATHS[key];
  if (p.fr === p.en) {
    return [{ path: p.fr + suffix, ...options }];
  }
  return [
    { path: p.fr + suffix, ...options },
    { path: p.en + suffix, ...options },
  ];
}

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/landing/landing.component").then(
        (m) => m.LandingComponent,
      ),
    title: "Kossimmo — Immobilier au Cameroun",
  },

  // ─── Search (shared for Louer / Acheter / Terrains) ──────────
  ...i18nRoute("rent", "", {
    loadComponent: () =>
      import("./features/search/search.component").then(
        (m) => m.SearchComponent,
      ),
    data: { preset: "rent" },
    title: "Louer — Kossimmo",
  }),
  ...i18nRoute("buy", "", {
    loadComponent: () =>
      import("./features/search/search.component").then(
        (m) => m.SearchComponent,
      ),
    data: { preset: "buy" },
    title: "Acheter — Kossimmo",
  }),
  ...i18nRoute("land", "", {
    loadComponent: () =>
      import("./features/search/search.component").then(
        (m) => m.SearchComponent,
      ),
    data: { preset: "land" },
    title: "Terrains — Kossimmo",
  }),

  // ─── Agencies ────────────────────────────────────────────────
  ...i18nRoute("agents", "", {
    loadComponent: () =>
      import("./features/agencies/agencies.component").then(
        (m) => m.AgenciesComponent,
      ),
    title: "Agences — Kossimmo",
  }),

  // ─── List a property ─────────────────────────────────────────
  ...i18nRoute("list", "", {
    loadComponent: () =>
      import("./features/list-property/list-property.component").then(
        (m) => m.ListPropertyComponent,
      ),
    title: "Publier une annonce — Kossimmo",
  }),

  // ─── Auth ────────────────────────────────────────────────────
  ...i18nRoute("signin", "", {
    loadComponent: () =>
      import("./features/auth/signin.component").then(
        (m) => m.SigninComponent,
      ),
    title: "Connexion — Kossimmo",
  }),

  // ─── Property detail ─────────────────────────────────────────
  ...i18nRoute("property", "/:slug", {
    loadComponent: () =>
      import("./features/property-detail/property-detail.component").then(
        (m) => m.PropertyDetailComponent,
      ),
    title: "Annonce — Kossimmo",
  }),

  // ─── Static / editorial pages ────────────────────────────────
  ...i18nRoute("about", "", {
    loadComponent: () =>
      import("./features/static-page/static-page.component").then(
        (m) => m.StaticPageComponent,
      ),
    data: { key: "about" },
    title: "À propos — Kossimmo",
  }),
  ...i18nRoute("contact", "", {
    loadComponent: () =>
      import("./features/static-page/static-page.component").then(
        (m) => m.StaticPageComponent,
      ),
    data: { key: "contact" },
    title: "Contact — Kossimmo",
  }),
  ...i18nRoute("journal", "", {
    loadComponent: () =>
      import("./features/static-page/static-page.component").then(
        (m) => m.StaticPageComponent,
      ),
    data: { key: "journal" },
    title: "Journal — Kossimmo",
  }),
  ...i18nRoute("terms", "", {
    loadComponent: () =>
      import("./features/static-page/static-page.component").then(
        (m) => m.StaticPageComponent,
      ),
    data: { key: "legal-terms" },
    title: "Conditions — Kossimmo",
  }),
  ...i18nRoute("privacy", "", {
    loadComponent: () =>
      import("./features/static-page/static-page.component").then(
        (m) => m.StaticPageComponent,
      ),
    data: { key: "legal-privacy" },
    title: "Confidentialité — Kossimmo",
  }),
  ...i18nRoute("cookies", "", {
    loadComponent: () =>
      import("./features/static-page/static-page.component").then(
        (m) => m.StaticPageComponent,
      ),
    data: { key: "legal-cookies" },
    title: "Cookies — Kossimmo",
  }),

  // ─── Backoffice (admin) ──────────────────────────────────────
  // Internal-only surface. URL is NOT localized — it's a tool,
  // not a marketing page.
  //
  // The login page is a sibling of the shell so it renders
  // chromeless (no sidebar / topbar). Every other admin route is
  // wrapped in the shell AND protected by adminAuthGuard.
  {
    path: "backoffice/login",
    loadComponent: () =>
      import("./features/admin/login/admin-login.component").then(
        (m) => m.AdminLoginComponent,
      ),
    title: "Connexion — Backoffice Kossimmo",
  },
  {
    path: "backoffice",
    canActivate: [adminAuthGuard],
    canActivateChild: [adminAuthGuard],
    loadComponent: () =>
      import("./features/admin/admin-shell.component").then(
        (m) => m.AdminShellComponent,
      ),
    title: "Backoffice — Kossimmo",
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () =>
          import("./features/admin/pages/overview.component").then(
            (m) => m.AdminOverviewComponent,
          ),
        title: "Tableau de bord — Backoffice",
      },
      {
        path: "moderation",
        loadComponent: () =>
          import("./features/admin/pages/moderation.component").then(
            (m) => m.AdminModerationComponent,
          ),
        title: "Modération — Backoffice",
      },
      {
        path: "users",
        loadComponent: () =>
          import("./features/admin/pages/users.component").then(
            (m) => m.AdminUsersComponent,
          ),
        title: "Utilisateurs — Backoffice",
      },
      {
        path: "team",
        loadComponent: () =>
          import("./features/admin/pages/team.component").then(
            (m) => m.AdminTeamComponent,
          ),
        title: "Équipe — Backoffice",
      },
      {
        path: "reporting",
        loadComponent: () =>
          import("./features/admin/pages/reporting.component").then(
            (m) => m.AdminReportingComponent,
          ),
        title: "Reporting — Backoffice",
      },
      {
        path: "flags",
        loadComponent: () =>
          import("./features/admin/pages/flags.component").then(
            (m) => m.AdminFlagsComponent,
          ),
        title: "Feature flags — Backoffice",
      },
    ],
  },

  // ─── 404 fallback ────────────────────────────────────────────
  {
    path: "**",
    loadComponent: () =>
      import("./features/placeholder/placeholder.component").then(
        (m) => m.PlaceholderComponent,
      ),
    title: "404 — Kossimmo",
  },
];
