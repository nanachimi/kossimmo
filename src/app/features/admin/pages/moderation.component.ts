import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { I18nService } from "../../../core/services/i18n.service";
import { BadgeComponent } from "../../../ui/badge/badge.component";
import { ButtonComponent } from "../../../ui/button/button.component";
import { ChipComponent } from "../../../ui/chip/chip.component";
import { IconComponent } from "../../../ui/icon/icon.component";
import { MOCK_MODERATION } from "../../../mocks/admin.mock";
import type { ModerationItem } from "../../../core/models/admin.model";

@Component({
  selector: "app-admin-moderation",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BadgeComponent,
    ButtonComponent,
    ChipComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./moderation.component.html",
  styleUrl: "./moderation.component.scss",
})
export class AdminModerationComponent {
  readonly i18n = inject(I18nService);

  readonly queue = signal<readonly ModerationItem[]>(MOCK_MODERATION);
  readonly priority = signal<"all" | "high" | "normal" | "low">("all");
  readonly query = signal("");

  readonly filtered = computed<readonly ModerationItem[]>(() => {
    const p = this.priority();
    const q = this.query().trim().toLowerCase();
    return this.queue().filter((i) => {
      if (p !== "all" && i.priority !== p) return false;
      if (!q) return true;
      return (
        i.propertyTitle.toLowerCase().includes(q) ||
        i.submittedBy.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q)
      );
    });
  });

  readonly selectedId = signal<string | null>(null);
  readonly selected = computed<ModerationItem | null>(
    () => this.queue().find((i) => i.id === this.selectedId()) ?? null,
  );

  select(id: string): void {
    this.selectedId.set(id);
  }

  decide(
    id: string,
    verdict: "approve" | "reject" | "flag",
  ): void {
    // Stub — would call the backend moderation service.
    this.queue.update((list) => list.filter((i) => i.id !== id));
    if (this.selectedId() === id) this.selectedId.set(null);
    void verdict;
  }
}
