import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";

import { AdminAuthService } from "../../../core/services/admin-auth.service";
import { ButtonComponent } from "../../../ui/button/button.component";
import { IconComponent } from "../../../ui/icon/icon.component";

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./admin-login.component.html",
  styleUrl: "./admin-login.component.scss",
})
export class AdminLoginComponent {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly email = signal("");
  readonly password = signal("");
  readonly showPassword = signal(false);
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);

  readonly returnUrl = toSignal(
    this.route.queryParamMap.pipe(
      map((q) => q.get("returnUrl") ?? "/backoffice"),
    ),
    { initialValue: "/backoffice" },
  );

  submit(): void {
    if (this.submitting()) return;
    this.error.set(null);
    this.submitting.set(true);

    // Short artificial delay so the loading state is perceptible —
    // swap for the real HTTP call later.
    setTimeout(() => {
      const result = this.auth.login(this.email(), this.password());
      this.submitting.set(false);

      if (result.ok) {
        this.router.navigateByUrl(this.returnUrl());
      } else {
        this.error.set(result.error);
      }
    }, 500);
  }

  useDemo(): void {
    this.email.set("sarah.biya@kossimmo.com");
    this.password.set("kossimmo2026");
    this.error.set(null);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
