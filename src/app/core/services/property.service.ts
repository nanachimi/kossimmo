import { Injectable, signal } from "@angular/core";
import type { Property } from "../models/property.model";
import { MOCK_PROPERTIES } from "../../mocks/properties.mock";

/**
 * Prototype property data-access layer.
 *
 * Swap `MOCK_PROPERTIES` for an HttpClient call once the backend
 * is live. Public methods return Signals or Promises — never raw
 * mutable arrays — so components can bind directly without
 * defensive copies.
 */
@Injectable({ providedIn: "root" })
export class PropertyService {
  private readonly _all = signal<readonly Property[]>(MOCK_PROPERTIES);

  readonly all = this._all.asReadonly();

  featured(): readonly Property[] {
    return this._all().filter((p) => p.featured);
  }

  byCity(city: string): readonly Property[] {
    return this._all().filter(
      (p) => p.location.city.toLowerCase() === city.toLowerCase(),
    );
  }

  bySlug(slug: string): Property | undefined {
    return this._all().find((p) => p.slug === slug);
  }
}
