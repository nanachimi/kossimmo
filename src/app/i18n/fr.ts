/**
 * French dictionary (default locale).
 * Keep keys dot-namespaced for easy grep: `nav.search`, `landing.hero.title`, …
 */
export const FR = {
  // Brand
  "brand.name": "Kossimmo",
  "brand.tagline": "L'immobilier au Cameroun, réinventé.",

  // Navigation
  "nav.buy": "Acheter",
  "nav.rent": "Louer",
  "nav.land": "Terrains",
  "nav.agents": "Agences",
  "nav.about": "À propos",
  "nav.signIn": "Connexion",
  "nav.list": "Publier un bien",

  // Hero
  "hero.eyebrow": "Trouver chez soi, du littoral aux hauts plateaux",
  "hero.title.1": "Votre prochaine",
  "hero.title.2": "adresse",
  "hero.title.3": "commence ici.",
  "hero.subtitle":
    "Des compounds sécurisés de Bastos aux studios meublés d'Akwa — la plateforme qui comprend le marché camerounais.",
  "hero.search.location": "Ville ou quartier",
  "hero.search.type": "Type de bien",
  "hero.search.price": "Budget",
  "hero.search.cta": "Rechercher",
  "hero.stats.listings": "Annonces vérifiées",
  "hero.stats.agents": "Agents partenaires",
  "hero.stats.cities": "Villes couvertes",

  // Categories
  "categories.title": "Que cherchez-vous ?",
  "categories.subtitle":
    "Les catégories adaptées aux réalités du marché camerounais.",
  "categories.apartment": "Appartement",
  "categories.house": "Maison",
  "categories.compound": "Compound",
  "categories.sq": "Servants Quarters",
  "categories.land": "Terrain agricole",
  "categories.commercial": "Commerce",
  "categories.studio": "Studio",
  "categories.office": "Bureau",

  // Featured
  "featured.title": "Nouveautés à la une",
  "featured.subtitle": "Sélectionnées cette semaine par notre équipe.",
  "featured.city.label": "Explorer",
  "featured.city.count": "annonces",

  // Trust
  "trust.eyebrow": "Pourquoi Kossimmo",
  "trust.title":
    "Bâti pour le Cameroun, pensé pour vous.",
  "trust.whatsapp.title": "WhatsApp, pas seulement un bouton.",
  "trust.whatsapp.body":
    "Contactez l'agent en un clic. Le canal que tout le monde utilise, intégré proprement.",
  "trust.verified.title": "Vérification manuelle.",
  "trust.verified.body":
    "Chaque agent et chaque annonce premium passent par notre équipe avant publication.",
  "trust.infra.title": "Les vraies questions.",
  "trust.infra.body":
    "Eau, électricité, générateur, état de la route, sécurité — tout est dit, en clair.",
  "trust.offline.title": "Conçu pour les connexions lentes.",
  "trust.offline.body":
    "L'application charge vite sur 3G et enregistre vos favoris hors-ligne.",

  // Editorial
  "editorial.eyebrow": "Journal",
  "editorial.title": "Comprendre le marché",
  "editorial.cta": "Lire tous les articles",
  "editorial.read": "Lire",

  // Footer
  "footer.tagline":
    "La plateforme immobilière pensée pour le Cameroun.",
  "footer.explore": "Explorer",
  "footer.company": "Société",
  "footer.legal": "Mentions légales",
  "footer.legal.terms": "Conditions",
  "footer.legal.privacy": "Confidentialité",
  "footer.legal.cookies": "Cookies",
  "footer.contact": "Contact",
  "footer.language": "Langue",
  "footer.copyright": "© 2026 Kossimmo. Tous droits réservés.",
  "footer.free": "Actuellement 100% gratuit — Mobile Money bientôt disponible.",

  // Common
  "common.view": "Voir",
  "common.save": "Sauvegarder",
  "common.contact": "Contacter",
  "common.featured": "Sélection",
  "common.verified": "Vérifié",
  "common.new": "Nouveau",
  "common.forRent": "À louer",
  "common.forSale": "À vendre",
  "common.bedrooms": "ch.",
  "common.bathrooms": "sdb",
  "common.area": "m²",
  "common.rooms": "pièces",
  "common.whatsapp": "WhatsApp",
} as const;

export type TranslationKey = keyof typeof FR;
