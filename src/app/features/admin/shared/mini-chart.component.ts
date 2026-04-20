import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import type { TimeSeriesPoint } from "../../../core/models/admin.model";

/**
 * Lightweight inline-SVG chart. Two modes:
 *  - `line`: smooth area + stroke
 *  - `bar` : vertical bars (defaults to this when the dataset is categorical)
 *
 * No chart library. Works at every size, prints cleanly, and
 * respects prefers-reduced-motion.
 */
@Component({
  selector: "app-mini-chart",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" width="100%" [style.aspect-ratio]="W + '/' + H" role="img" [attr.aria-label]="label">
      <defs>
        <linearGradient [attr.id]="gradId()" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" [attr.stop-color]="accent" stop-opacity="0.35" />
          <stop offset="100%" [attr.stop-color]="accent" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- grid baselines -->
      @for (y of [0.25, 0.5, 0.75]; track y) {
        <line [attr.x1]="PAD" [attr.x2]="W - PAD" [attr.y1]="PAD + (H - PAD * 2) * y" [attr.y2]="PAD + (H - PAD * 2) * y" stroke="var(--border)" stroke-width="1" stroke-dasharray="2 4" />
      }

      @if (mode === 'line') {
        <path [attr.d]="areaPath()" [attr.fill]="'url(#' + gradId() + ')'" />
        <path [attr.d]="linePath()" fill="none" [attr.stroke]="accent" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        @for (pt of positions(); track $index) {
          <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="3" [attr.fill]="accent" />
        }
      } @else {
        @for (pt of positions(); track $index) {
          <rect
            [attr.x]="pt.x - barWidth() / 2"
            [attr.y]="pt.y"
            [attr.width]="barWidth()"
            [attr.height]="H - PAD - pt.y"
            [attr.fill]="$index === maxIndex() ? accent : 'var(--border-strong)'"
            rx="4"
          />
        }
      }

      <!-- x-axis labels -->
      @for (pt of positions(); track $index) {
        @if (showAllLabels || $index === 0 || $index === positions().length - 1 || $index % labelEvery === 0) {
          <text
            [attr.x]="pt.x"
            [attr.y]="H - 4"
            text-anchor="middle"
            font-size="10"
            font-family="'JetBrains Mono', monospace"
            fill="var(--text-muted)"
          >{{ data[$index].label }}</text>
        }
      }
    </svg>
  `,
  styles: [
    `
      :host { display: block; width: 100%; }
      svg { display: block; overflow: visible; }
    `,
  ],
})
export class MiniChartComponent {
  @Input({ required: true }) data!: readonly TimeSeriesPoint[];
  @Input() mode: "line" | "bar" = "line";
  @Input() accent = "var(--accent)";
  @Input() label = "Trend";
  @Input() labelEvery = 3;
  @Input() showAllLabels = false;

  readonly W = 560;
  readonly H = 180;
  readonly PAD = 12;

  private readonly _id = signal(`g-${Math.random().toString(36).slice(2, 8)}`);
  gradId = this._id;

  readonly positions = computed(() => {
    const d = this.data;
    if (!d?.length) return [];
    const max = Math.max(...d.map((p) => p.value));
    const min = Math.min(...d.map((p) => p.value));
    const range = max - min || 1;
    const innerW = this.W - this.PAD * 2;
    const innerH = this.H - this.PAD * 2 - 14; // room for x-axis labels
    return d.map((p, i) => {
      const x =
        this.PAD + (d.length === 1 ? innerW / 2 : (innerW * i) / (d.length - 1));
      const y = this.PAD + innerH - ((p.value - min) / range) * innerH;
      return { x, y };
    });
  });

  readonly maxIndex = computed(() => {
    let best = 0;
    for (let i = 1; i < this.data.length; i++) {
      if (this.data[i]!.value > this.data[best]!.value) best = i;
    }
    return best;
  });

  readonly barWidth = computed(() => {
    const innerW = this.W - this.PAD * 2;
    return Math.min(32, (innerW / Math.max(this.data.length, 1)) * 0.7);
  });

  readonly linePath = computed(() => {
    const pts = this.positions();
    if (!pts.length) return "";
    const d: string[] = [`M ${pts[0]!.x} ${pts[0]!.y}`];
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1]!;
      const cur = pts[i]!;
      const cx = (prev.x + cur.x) / 2;
      d.push(`Q ${prev.x} ${prev.y} ${cx} ${(prev.y + cur.y) / 2}`);
      d.push(`T ${cur.x} ${cur.y}`);
    }
    return d.join(" ");
  });

  readonly areaPath = computed(() => {
    const pts = this.positions();
    if (!pts.length) return "";
    const base = this.H - this.PAD - 14;
    return (
      this.linePath() +
      ` L ${pts[pts.length - 1]!.x} ${base}` +
      ` L ${pts[0]!.x} ${base} Z`
    );
  });
}
