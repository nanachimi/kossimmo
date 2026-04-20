import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AdminAuthService } from "../services/admin-auth.service";

/**
 * Blocks unauthenticated access to /backoffice children.
 *
 * On deny, redirects to /backoffice/login with the original path
 * captured in `?returnUrl=` so the login page can bounce the user
 * back where they were trying to go.
 */
export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  return router.createUrlTree(["/backoffice/login"], {
    queryParams: state.url === "/backoffice" ? undefined : { returnUrl: state.url },
  });
};
