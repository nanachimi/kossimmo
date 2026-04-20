import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../icon/icon.component";

export type BadgeTone =
  | "neutral"
  | "accent"
  | "success"
  | "forest"
  | "alert"
  | "paper";

@Component({
  selector: "app-badge",
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon) {
      <app-icon [name]="icon" [size]="14" [strokeWidth]="2" />
    }
    <span><ng-content /></span>
  `,
  host: {
    "[class]": "'badge badge--' + tone",
  },
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.3rem 0.65rem;
        border-radius: var(--radius-pill);
        font-size: var(--step--2);
        font-weight: 600;
        letter-spacing: var(--tracking-wide);
        text-transform: uppercase;
        line-height: 1;
        border: 1px solid transparent;
        white-space: nowrap;
      }
      :host(.badge--neutral) {
        background: var(--surface-inset);
        color: var(--ink-soft);
        border-color: var(--border);
      }
      :host(.badge--accent) {
        background: rgba(198, 123, 46, 0.12);
        color: var(--ochre-deep);
        border-color: rgba(198, 123, 46, 0.28);
      }
      :host(.badge--success) {
        background: rgba(63, 122, 94, 0.12);
        color: var(--success);
        border-color: rgba(63, 122, 94, 0.28);
      }
      :host(.badge--forest) {
        background: var(--forest);
        color: var(--paper);
      }
      :host(.badge--alert) {
        background: rgba(184, 58, 38, 0.12);
        color: var(--alert);
        border-color: rgba(184, 58, 38, 0.28);
      }
      :host(.badge--paper) {
        background: var(--paper);
        color: var(--ink);
        border-color: var(--border-strong);
      }
    `,
  ],
})
export class BadgeComponent {
  @Input() tone: BadgeTone = "neutral";
  @Input() icon?: string;
}
