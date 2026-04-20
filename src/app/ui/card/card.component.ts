import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";

export type CardElevation = "flat" | "raised" | "lifted";

@Component({
  selector: "app-card, [appCard]",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    "[class]": "'card card--' + elevation + (interactive ? ' card--interactive' : '')",
  },
  styles: [
    `
      :host {
        display: block;
        background: var(--surface-raised);
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        overflow: hidden;
        transition:
          transform var(--dur-md) var(--ease-out),
          box-shadow var(--dur-md) var(--ease-out),
          border-color var(--dur-md) var(--ease-out);
      }
      :host(.card--flat) {
        box-shadow: none;
      }
      :host(.card--raised) {
        box-shadow: var(--shadow-sm);
      }
      :host(.card--lifted) {
        box-shadow: var(--shadow-lg);
      }
      :host(.card--interactive) {
        cursor: pointer;
      }
      :host(.card--interactive):hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--border-strong);
      }
    `,
  ],
})
export class CardComponent {
  @Input() elevation: CardElevation = "raised";
  @Input() interactive = false;
}
