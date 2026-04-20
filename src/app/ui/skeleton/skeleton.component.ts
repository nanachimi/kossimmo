import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from "@angular/core";

@Component({
  selector: "app-skeleton",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    "[style.--sk-w]": "width",
    "[style.--sk-h]": "height",
    "[style.--sk-r]": "radius",
    "[class]": "'sk sk--' + shape",
  },
  styles: [
    `
      :host {
        display: block;
        width: var(--sk-w, 100%);
        height: var(--sk-h, 1rem);
        border-radius: var(--sk-r, var(--radius-xs));
        background: linear-gradient(
          90deg,
          var(--surface-inset) 0%,
          var(--mist) 50%,
          var(--surface-inset) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.6s var(--ease-in-out) infinite;
      }
      :host(.sk--circle) {
        border-radius: 50%;
      }
      :host(.sk--card) {
        border-radius: var(--radius-md);
      }
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `,
  ],
})
export class SkeletonComponent {
  @Input() width = "100%";
  @Input() height = "1rem";
  @Input() radius = "var(--radius-xs)";
  @Input() shape: "line" | "circle" | "card" = "line";
}
