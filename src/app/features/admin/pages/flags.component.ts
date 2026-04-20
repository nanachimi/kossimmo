import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { I18nService } from "../../../core/services/i18n.service";
import { FeatureFlagService } from "../../../core/services/feature-flag.service";
import { IconComponent } from "../../../ui/icon/icon.component";
import { BadgeComponent } from "../../../ui/badge/badge.component";

/**
 * Feature-flag control panel. Every flag has two toggles:
 *   - enabled:  whether the feature appears in the UI at all
 *   - premium:  whether it costs / is gated behind an upgrade
 *
 * Toggling here updates the central FeatureFlagService signal,
 * so the rest of the app reacts instantly.
 */
@Component({
  selector: "app-admin-flags",
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./flags.component.html",
  styleUrl: "./flags.component.scss",
})
export class AdminFlagsComponent {
  readonly i18n = inject(I18nService);
  readonly flagService = inject(FeatureFlagService);

  toggle(key: string, field: "enabled" | "premium"): void {
    this.flagService.toggle(key, field);
  }
}
