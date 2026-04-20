import { Injectable, computed, signal } from "@angular/core";
import type { AdminRole } from "../models/admin.model";

/**
 * Backoffice auth state — signal-driven, persisted to localStorage.
 *
 * Mock for the prototype phase: any @kossimmo.com address with the
 * shared demo password logs in as a fresh admin. Swap `login()` for
 * an HttpClient POST against `/api/admin/auth` once the backend ships.
 */

export interface AdminSession {
  readonly email: string;
  readonly name: string;
  readonly role: AdminRole;
  readonly city: string;
}

const STORAGE_KEY = "kossimmo.admin.session";
const DEMO_PASSWORD = "kossimmo2026";

@Injectable({ providedIn: "root" })
export class AdminAuthService {
  private readonly _session = signal<AdminSession | null>(this.load());

  readonly session = this._session.asReadonly();
  readonly isAuthenticated = computed(() => this._session() !== null);

  /**
   * Mock authentication.
   * Rules:
   *   - email must end with @kossimmo.com
   *   - password must be the shared demo passphrase
   * Derives name + role from the email local-part.
   */
  login(
    email: string,
    password: string,
  ): { ok: true } | { ok: false; error: string } {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@kossimmo.com")) {
      return {
        ok: false,
        error:
          "Accès réservé aux adresses @kossimmo.com. Contactez votre administrateur.",
      };
    }
    if (password !== DEMO_PASSWORD) {
      return { ok: false, error: "Mot de passe incorrect." };
    }

    const local = normalizedEmail.split("@")[0]!;
    const name = local
      .split(/[.\-_]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");

    const session: AdminSession = {
      email: normalizedEmail,
      name,
      role: this.inferRole(local),
      city: "Douala",
    };

    this._session.set(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* private mode */
    }
    return { ok: true };
  }

  logout(): void {
    this._session.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  private load(): AdminSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AdminSession) : null;
    } catch {
      return null;
    }
  }

  /** Map common email prefixes to admin roles. */
  private inferRole(local: string): AdminRole {
    if (/admin|sarah|founder/i.test(local)) return "admin";
    if (/verifier|ritа|thierry/i.test(local)) return "verifier";
    if (/content|blog|editor/i.test(local)) return "content";
    return "caseworker";
  }
}
