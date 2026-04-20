import { ChangeDetectionStrategy, Component, Input, computed, input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * Monogram avatar — used everywhere we show a person whose
 * photograph we do not yet have. Produces a deterministic warm
 * gradient from the input name (so the same person always lands
 * on the same colors across pages) plus large display-typography
 * initials. Reads as a deliberate brand surface, not a missing-image
 * placeholder.
 *
 * If the source has a valid `url`, we render the image instead and
 * the monogram becomes the alt-text fallback.
 */
@Component({
  selector: "app-monogram",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (url) {
      <img [src]="url" [alt]="name" loading="lazy" />
    } @else {
      <span class="mono-inner" [style.background]="gradient()">
        <span class="mono-initials">{{ initials() }}</span>
      </span>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: var(--mono-size, 48px);
        height: var(--mono-size, 48px);
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .mono-inner {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        color: #fff;
        font-family: var(--font-display);
        letter-spacing: -0.02em;
      }
      .mono-initials {
        font-size: calc(var(--mono-size, 48px) * 0.42);
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(10, 10, 10, 0.15);
      }
    `,
  ],
})
export class MonogramComponent {
  @Input({ required: true }) name!: string;
  @Input() url?: string;

  /** First letter of first + last name (or one letter for single-word names). */
  initials = computed(() => {
    const parts = (this.name || "?").trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
    return (
      (parts[0]![0] ?? "") + (parts[parts.length - 1]![0] ?? "")
    ).toUpperCase();
  });

  /**
   * Deterministic warm gradient drawn from a small curated set.
   * The hash of the name picks a palette — same person = same color.
   * All palettes stay inside the Kossimmo accent family so avatars
   * never clash with the editorial palette.
   */
  gradient = computed(() => {
    const palettes = [
      // ochre → terracotta
      "linear-gradient(135deg, #ff4e1a 0%, #b52f00 100%)",
      // forest → ink
      "linear-gradient(135deg, #166840 0%, #0a0a0a 100%)",
      // ink → terracotta
      "linear-gradient(135deg, #0a0a0a 0%, #9b3e1f 100%)",
      // ochre → lime
      "linear-gradient(135deg, #ff4e1a 0%, #7d9c12 100%)",
      // terracotta → forest
      "linear-gradient(135deg, #9b3e1f 0%, #0f5132 100%)",
      // sand → ochre
      "linear-gradient(135deg, #b89050 0%, #ff4e1a 100%)",
    ];
    let hash = 0;
    for (let i = 0; i < this.name.length; i++) {
      hash = (hash << 5) - hash + this.name.charCodeAt(i);
      hash |= 0;
    }
    return palettes[Math.abs(hash) % palettes.length]!;
  });
}
