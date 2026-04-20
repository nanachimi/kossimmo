import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

@Component({
  selector: "app-button, button[appButton], a[appButton]",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[slot=leading]" />
    <span class="label"><ng-content /></span>
    <ng-content select="[slot=trailing]" />
  `,
  host: {
    "[class]":
      "'btn btn--' + variant + ' btn--' + size + (block ? ' btn--block' : '') + (loading ? ' btn--loading' : '')",
    "[attr.aria-busy]": "loading ? 'true' : null",
    "[attr.disabled]":
      "disabled ? 'disabled' : null",
  },
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = "primary";
  @Input() size: ButtonSize = "md";
  @Input() block = false;
  @Input() loading = false;
  @Input() disabled = false;
}
