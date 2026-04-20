import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { I18nService } from "../../core/services/i18n.service";
import { FeatureFlagService } from "../../core/services/feature-flag.service";
import { TranslatePipe } from "../../core/pipes/t.pipe";
import { RoutePipe } from "../../core/pipes/route.pipe";
import { ButtonComponent } from "../../ui/button/button.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ChipComponent } from "../../ui/chip/chip.component";
import type { UserRole } from "../../core/models/property.model";

type Mode = "signin" | "signup";

@Component({
  selector: "app-signin",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslatePipe,
    RoutePipe,
    ButtonComponent,
    IconComponent,
    ChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./signin.component.html",
  styleUrl: "./signin.component.scss",
})
export class SigninComponent {
  readonly i18n = inject(I18nService);
  private readonly flags = inject(FeatureFlagService);

  readonly mode = signal<Mode>("signin");
  readonly role = signal<Extract<UserRole, "seeker" | "owner" | "agent">>(
    "seeker",
  );

  readonly name = signal("");
  readonly phone = signal("");
  readonly password = signal("");

  // SMS OTP — 6 digit boxes
  readonly otpOpen = signal(false);
  readonly otp = signal<string[]>(["", "", "", "", "", ""]);

  readonly oauthEnabled = this.flags.isEnabled("auth.oauth");

  setMode(m: Mode): void {
    this.mode.set(m);
  }

  setRole(r: Extract<UserRole, "seeker" | "owner" | "agent">): void {
    this.role.set(r);
  }

  submit(): void {
    // Stub — in a real flow we'd call AuthService.signin(…)
    this.otpOpen.set(true);
    setTimeout(() => {
      const first = document.querySelector<HTMLInputElement>(".otp-box");
      first?.focus();
    }, 60);
  }

  onOtpInput(i: number, ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const v = input.value.replace(/\D/g, "").slice(0, 1);
    this.otp.update((arr) => {
      const next = [...arr];
      next[i] = v;
      return next;
    });
    if (v) {
      const siblings = Array.from(
        document.querySelectorAll<HTMLInputElement>(".otp-box"),
      );
      siblings[i + 1]?.focus();
    }
  }

  onOtpKeydown(i: number, ev: KeyboardEvent): void {
    if (ev.key === "Backspace" && !this.otp()[i] && i > 0) {
      const siblings = Array.from(
        document.querySelectorAll<HTMLInputElement>(".otp-box"),
      );
      siblings[i - 1]?.focus();
    }
  }

  verify(): void {
    const code = this.otp().join("");
    if (code.length === 6) {
      alert(
        this.i18n.locale() === "fr"
          ? "Compte vérifié (démo). Redirection vers votre espace…"
          : "Account verified (demo). Redirecting to your space…",
      );
    }
  }
}
