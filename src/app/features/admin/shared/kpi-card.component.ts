import { ChangeDetectionStrategy, Component, Input, computed, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../../../ui/icon/icon.component";

/**
 * Admin KPI card — large mono number, delta chip (green up /
 * red down), and a small icon glyph. Kept under 2 kB of styles
 * so the dashboard grid renders instantly.
 */
@Component({
  selector: "app-kpi-card",
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kpi">
      <header class="kpi__head">
        <span class="kpi__label">{{ label }}</span>
        <span class="kpi__ic"><app-icon [name]="icon" [size]="18" /></span>
      </header>
      <div class="kpi__value mono">{{ formatted() }}</div>
      @if (delta !== null && delta !== undefined) {
        <span
          class="kpi__delta"
          [class.up]="(invertDelta ? -delta : delta) >= 0"
          [class.down]="(invertDelta ? -delta : delta) < 0"
        >
          <span class="arrow" aria-hidden="true">
            {{ delta >= 0 ? '↑' : '↓' }}
          </span>
          {{ deltaFormatted() }}
          <small>{{ deltaLabel }}</small>
        </span>
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .kpi {
        background: var(--surface-raised);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        height: 100%;
        transition: transform var(--dur-md) var(--ease-out), border-color var(--dur-md) var(--ease-out), box-shadow var(--dur-md) var(--ease-out);
      }
      :host:hover .kpi {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--border-strong);
      }
      .kpi__head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .kpi__label {
        font-size: var(--step--2);
        font-weight: 600;
        letter-spacing: var(--tracking-wide);
        text-transform: uppercase;
        color: var(--text-muted);
      }
      .kpi__ic {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px; height: 32px;
        border-radius: var(--radius-sm);
        background: var(--accent-soft);
        color: var(--accent-deep);
      }
      .kpi__value {
        font-family: var(--font-display);
        font-size: clamp(1.8rem, 1.3vw + 1.2rem, 2.4rem);
        font-weight: 600;
        letter-spacing: -0.035em;
        color: var(--ink);
        line-height: 1;
      }
      .kpi__delta {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: var(--step--1);
        font-weight: 600;
        padding: 0.25rem 0.55rem;
        border-radius: var(--radius-pill);
        width: max-content;

        small {
          font-weight: 400;
          opacity: 0.75;
        }
      }
      .kpi__delta.up {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success);
      }
      .kpi__delta.down {
        background: rgba(225, 29, 72, 0.1);
        color: var(--alert);
      }
      .arrow { font-size: 0.9em; }
    `,
  ],
})
export class KpiCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number;
  @Input() icon = "sparkles";
  @Input() delta?: number;
  @Input() deltaLabel = "vs M-1";
  @Input() suffix = "";
  /** If true, a negative delta is *good* (e.g. avg review time, moderation queue size). */
  @Input() invertDelta = false;

  formatted = computed(() => {
    const v = this.value;
    const fmt = new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0,
    }).format(v);
    return fmt + (this.suffix ? " " + this.suffix : "");
  });

  deltaFormatted = computed(() => {
    if (this.delta == null) return "";
    const abs = Math.abs(this.delta);
    return abs.toFixed(1) + "%";
  });
}
