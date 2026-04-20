# Kossimmo

**Le portail immobilier camerounais.** Angular 18 standalone app with a public marketing surface (landing, search, property detail, auth, publier-une-annonce wizard) and a `/backoffice` admin console (dashboard, moderation, users, verifier team, reporting, feature flags, command palette).

Tailored to the Cameroonian market — WhatsApp as primary contact, infrastructure transparency (water / power / generator / road / security) promoted to first-class fields, FR ↔ EN with locale-prefixed URLs, XAF pricing, 3G-friendly bundle.

---

## Prérequis

- **Node.js** ≥ 20 LTS
- **npm** ≥ 10
- A modern browser for the dev preview

```bash
node --version   # v20.x or higher
npm --version    # 10.x or higher
```

## Démarrage rapide

```bash
# 1. Clone
git clone git@github.com:nanachimi/kossimmo.git
cd kossimmo

# 2. Install
npm install

# 3. Run the dev server
npm start
```

Then open <http://localhost:4200>. Changes to any `.ts`, `.html`, `.scss` file hot-reload instantly.

### Language & localized URLs

The app defaults to **French** (detected from the browser, persisted in `localStorage` under `kossimmo.locale`). Flip to English with the `FR · EN` toggle in the top-right of the header.

URLs translate with the locale:

| Logical route | FR                              | EN                   |
| ------------- | ------------------------------- | -------------------- |
| Rent          | `/louer`                        | `/rent`              |
| Buy           | `/acheter`                      | `/buy`               |
| Land          | `/terrains`                     | `/land`              |
| Agencies      | `/agences`                      | `/agents`            |
| List          | `/publier`                      | `/list`              |
| Sign in       | `/connexion`                    | `/signin`            |
| Listing       | `/annonce/:slug`                | `/property/:slug`    |
| About         | `/a-propos`                     | `/about`             |
| Legal (terms) | `/mentions/conditions`          | `/legal/terms`       |
| Backoffice    | `/backoffice` (not localized)   | `/backoffice`        |

### Command palette

Press **⌘K** (macOS) or **Ctrl+K** (Windows/Linux) anywhere inside `/backoffice` to open the global launcher. Search across nav sections, users, listings, and cities. Keyboard-navigable (`↑` `↓` `Enter` `Esc`).

---

## Scripts npm

```bash
npm start                # ng serve — dev server on :4200
npm run build            # production build → dist/kossimmo
npm run watch            # incremental dev build, no server
npm test                 # Karma + Jasmine unit tests
```

---

## Structure du projet

```
src/
├── app/
│   ├── app.component.ts        # Root: conditional header/footer (hidden on /backoffice)
│   ├── app.config.ts           # Router + animations + locale providers
│   ├── app.routes.ts           # All routes — public (FR+EN) + /backoffice children
│   │
│   ├── core/
│   │   ├── models/             # Domain types (property.model.ts, admin.model.ts)
│   │   ├── services/           # i18n, property, feature-flag (signal-driven)
│   │   ├── pipes/              # `t` (translate), `xaf` (price), `route` (i18n URL)
│   │   └── route-paths.ts      # Single source of truth for FR ↔ EN URL mapping
│   │
│   ├── i18n/
│   │   ├── fr.ts               # French dictionary (default)
│   │   └── en.ts               # English dictionary (Record<TranslationKey, string>)
│   │
│   ├── ui/                     # Shared presentation kit (Button, Badge, Card, Chip,
│   │                           #   Input, Skeleton, Icon, Monogram)
│   │
│   ├── layout/
│   │   ├── header/             # Public top nav + language switcher (URL-aware swap)
│   │   └── footer/             # Public footer
│   │
│   ├── features/
│   │   ├── landing/            # Home page (hero animations, featured slider, journal)
│   │   ├── search/             # Shared Louer/Acheter/Terrains via route data preset
│   │   ├── property-detail/    # Gallery + lightbox + sticky sidebar + infrastructure
│   │   ├── agencies/           # Agent directory
│   │   ├── list-property/      # 6-step publier-une-annonce wizard with autosave
│   │   ├── auth/               # Signin / Signup with SMS OTP (6-box)
│   │   ├── static-page/        # About, Contact, Journal, Legal (one component, route-data)
│   │   ├── shared/
│   │   │   └── property-card/  # Used by search grid + landing slider
│   │   └── admin/              # Backoffice
│   │       ├── admin-shell.component.*     # Sidebar + topbar + nested outlet
│   │       ├── command-palette/            # ⌘K global launcher
│   │       ├── shared/                     # KPI card + inline-SVG MiniChart
│   │       └── pages/                      # overview, moderation, users, team,
│   │                                       #   reporting, flags
│   │
│   └── mocks/                  # In-memory data (12 properties, 5 agents, 9 users, 7 staff)
│
├── styles/
│   ├── _tokens.scss            # Design tokens (colors, type scale, motion, radii)
│   ├── _reset.scss             # Opinionated reset + focus ring + selection
│   └── _utilities.scss         # Container, .eyebrow, .display-italic, .grain, etc.
│
├── styles.scss                 # Entry (Google Fonts import + grain overlay)
└── index.html                  # Pre-boot splash (prevents FOUC)
```

### Design system

All color, spacing, typography, motion, and radii values are CSS custom properties in `src/styles/_tokens.scss`. Never hardcode colors in a component — reach for `var(--accent)`, `var(--ink)`, etc.

- **Palette (light):** ink `#0a0a0a`, paper `#fafaf7`, accent `#ff4e1a`, lime `#d1f34b`, forest `#0f5132`
- **Display:** Space Grotesk (variable, 300–700)
- **Body:** Inter (variable, 300–700)
- **Mono:** JetBrains Mono (prices, IDs, timestamps)

Dark mode is scaffolded (`[data-theme="dark"]` block) but not wired to a user-facing toggle yet.

### Adding a new route

1. Add the logical key + FR/EN URL pair to `src/app/core/route-paths.ts` → `ROUTE_PATHS`
2. Register it in `src/app/app.routes.ts` via the `i18nRoute(key, suffix, options)` helper
3. Link to it in templates with `[routerLink]="'yourKey' | route"` (never hardcode `/louer`, `/rent`, …)

### Adding a new shared UI component

Put it in `src/app/ui/<name>/<name>.component.ts` as a standalone component. Export it from `src/app/ui/index.ts`.

### Adding mock data

- Property listings: `src/app/mocks/properties.mock.ts` (push into `MOCK_PROPERTIES`)
- Admin entities: `src/app/mocks/admin.mock.ts` (`MOCK_USERS`, `MOCK_EMPLOYEES`, `MOCK_MODERATION`, KPI snapshots, growth series)

### Éditorial image guidelines

All portraits must show Black / mixed-skin people (Cameroonian context). If you don't have a verified photo, the `<app-monogram>` component renders a deterministic warm-gradient avatar with initials — better than a misrepresentative stock photo.

---

## Limites connues du prototype

- **No backend.** Services read from the in-memory mocks. API wiring is planned — swap `MOCK_*` for `HttpClient` calls inside the existing `PropertyService` / `FeatureFlagService`.
- **No auth.** The `/signin` screen is visual; OTP verification just shows an alert.
- **Mobile Money** (MTN / Orange) shown as _Coming soon_ — no payment flow.
- **i18n compilation:** strings live in runtime TS dictionaries (fast DX, tiny bundle). The migration path to `@angular/localize` + per-locale builds is documented in `src/app/core/services/i18n.service.ts`.
- **Maps:** the property-detail + list-property wizard render a gradient "map stub". Leaflet integration is deferred.

---

## License

Proprietary — internal prototype for the Kossimmo project.
