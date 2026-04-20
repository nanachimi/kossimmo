import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-chip",
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon) {
      <app-icon [name]="icon" [size]="16" [strokeWidth]="1.75" />
    }
    <span><ng-content /></span>
  `,
  host: {
    "[attr.role]": "'button'",
    "[attr.tabindex]": "0",
    "[attr.aria-pressed]": "active ? 'true' : 'false'",
    "[class.chip--active]": "active",
    class: "chip",
    "(click)": "clicked.emit()",
    "(keydown.enter)": "clicked.emit()",
    "(keydown.space)": "$event.preventDefault(); clicked.emit()",
  },
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.55rem 1rem;
        border-radius: var(--radius-pill);
        border: 1px solid var(--border-strong);
        background: var(--surface-raised);
        color: var(--ink);
        font-size: var(--step--1);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        user-select: none;
        transition:
          background-color var(--dur-sm) var(--ease-out),
          border-color var(--dur-sm) var(--ease-out),
          color var(--dur-sm) var(--ease-out),
          transform var(--dur-sm) var(--ease-out);
        white-space: nowrap;
      }
      :host:hover {
        border-color: var(--ink);
        transform: translateY(-1px);
      }
      :host.chip--active {
        background: var(--ink);
        color: var(--paper);
        border-color: var(--ink);
      }
    `,
  ],
})
export class ChipComponent {
  @Input() icon?: string;
  @Input() active = false;
  @Output() clicked = new EventEmitter<void>();
}
