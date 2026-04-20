/**
 * Kossimmo — Core domain models
 *
 * Tailored to the Cameroonian market:
 *  - XAF prices
 *  - Compound, Servants Quarters, Land for agriculture as first-class types
 *  - Infrastructure (water, power, road, security) promoted to top-level fields
 *  - WhatsApp contact as primary channel
 */

export type Locale = "fr" | "en";

export type PropertyType =
  | "apartment"
  | "house"
  | "compound"
  | "servants_quarters"
  | "land"
  | "commercial"
  | "office"
  | "studio";

export type ListingMode = "rent" | "sale";

export type Currency = "XAF";

export type WaterSource = "city" | "borehole" | "tank" | "none";
export type PowerSource = "grid" | "generator" | "solar" | "grid_generator";
export type RoadCondition = "paved" | "gravel" | "dirt" | "seasonal";
export type SecurityLevel = "gated" | "guarded" | "fenced" | "open";

export interface Money {
  readonly amount: number;
  readonly currency: Currency;
  readonly period?: "month" | "year" | "total";
}

export interface Location {
  readonly city: string;
  readonly neighborhood: string;
  readonly country: "CM";
  readonly lat: number;
  readonly lng: number;
}

export interface Infrastructure {
  readonly water: WaterSource;
  readonly power: PowerSource;
  readonly road: RoadCondition;
  readonly security: SecurityLevel;
  readonly transitMinutes?: number;
  readonly tank?: boolean;
  readonly generator?: boolean;
}

export interface Agent {
  readonly id: string;
  readonly name: string;
  readonly agency?: string;
  readonly verified: boolean;
  readonly avatarUrl?: string;
  readonly phone: string;
  readonly whatsapp: string;
  readonly listings: number;
  readonly rating: number;
}

export interface PropertyPhoto {
  readonly url: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
}

export interface Property {
  readonly id: string;
  readonly slug: string;
  readonly title: { fr: string; en: string };
  readonly description: { fr: string; en: string };
  readonly type: PropertyType;
  readonly mode: ListingMode;
  readonly price: Money;
  readonly location: Location;
  readonly bedrooms: number;
  readonly bathrooms: number;
  readonly livingArea: number; // m²
  readonly landArea?: number; // m²
  readonly furnished: boolean;
  readonly features: readonly string[];
  readonly infrastructure: Infrastructure;
  readonly photos: readonly PropertyPhoto[];
  readonly agent: Agent;
  readonly createdAt: string; // ISO
  readonly verified: boolean;
  readonly featured: boolean;
  readonly views: number;
}

export type UserRole =
  | "seeker"
  | "owner"
  | "agent"
  | "caseworker"
  | "admin";

export interface FeatureFlag {
  readonly key: string;
  readonly enabled: boolean;
  readonly premium: boolean;
  readonly label: { fr: string; en: string };
}
