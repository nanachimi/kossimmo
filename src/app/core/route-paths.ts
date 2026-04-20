import type { Locale } from "./models/property.model";

/**
 * Localized URL structure.
 *
 * Every route the app exposes has a logical `RouteKey` and a
 * per-locale URL path. Two components rely on this map:
 *
 *   - `app.routes.ts` registers both FR and EN paths against the
 *      same component, so `/louer` and `/rent` both resolve to
 *      `SearchComponent`.
 *   - The `route` pipe and the header's locale switcher look up
 *      the current key and translate the URL when the user flips
 *      languages.
 *
 * Keeping this in ONE file prevents FR/EN drift. Do NOT hardcode
 * a URL anywhere else — reach for `| route` in templates or
 * `ROUTE_PATHS[key][locale]` in code.
 */
export type RouteKey =
  | "rent"
  | "buy"
  | "land"
  | "agents"
  | "list"
  | "signin"
  | "property"
  | "about"
  | "contact"
  | "journal"
  | "terms"
  | "privacy"
  | "cookies";

export const ROUTE_PATHS: Readonly<
  Record<RouteKey, Readonly<Record<Locale, string>>>
> = {
  rent:     { fr: "louer",                    en: "rent" },
  buy:      { fr: "acheter",                  en: "buy" },
  land:     { fr: "terrains",                 en: "land" },
  agents:   { fr: "agences",                  en: "agents" },
  list:     { fr: "publier",                  en: "list" },
  signin:   { fr: "connexion",                en: "signin" },
  property: { fr: "annonce",                  en: "property" },
  about:    { fr: "a-propos",                 en: "about" },
  contact:  { fr: "contact",                  en: "contact" },
  journal:  { fr: "journal",                  en: "journal" },
  terms:    { fr: "mentions/conditions",      en: "legal/terms" },
  privacy:  { fr: "mentions/confidentialite", en: "legal/privacy" },
  cookies:  { fr: "mentions/cookies",         en: "legal/cookies" },
};

const KEYS = Object.keys(ROUTE_PATHS) as RouteKey[];
const LOCALES: readonly Locale[] = ["fr", "en"];

/**
 * Given a pathname (e.g. `/louer` or `/annonce/villa-moderne`),
 * find its logical `RouteKey`, which locale it matched, and the
 * remainder after the prefix (so slugs / child paths survive the
 * locale swap).
 *
 * Returns `null` for `/` and for any route not in the map.
 */
export function findRouteKey(pathname: string): {
  key: RouteKey;
  locale: Locale;
  rest: string;
} | null {
  const clean = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) return null;

  // Sort by descending length so `mentions/conditions` is matched
  // before `mentions` if ever `mentions` became a key on its own.
  const candidates: { key: RouteKey; locale: Locale; prefix: string }[] = [];
  for (const key of KEYS) {
    for (const locale of LOCALES) {
      candidates.push({ key, locale, prefix: ROUTE_PATHS[key][locale] });
    }
  }
  candidates.sort((a, b) => b.prefix.length - a.prefix.length);

  for (const c of candidates) {
    if (clean === c.prefix) {
      return { key: c.key, locale: c.locale, rest: "" };
    }
    if (clean.startsWith(c.prefix + "/")) {
      return {
        key: c.key,
        locale: c.locale,
        rest: clean.slice(c.prefix.length),
      };
    }
  }
  return null;
}

/** Build the full path (leading slash) for a key in the given locale. */
export function pathFor(key: RouteKey, locale: Locale): string {
  return "/" + ROUTE_PATHS[key][locale];
}
