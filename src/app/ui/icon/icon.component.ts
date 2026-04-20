import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  computed,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

/**
 * Inline-SVG icon component. Paths are hand-curated from Lucide
 * (ISC license) and kept in-repo so they can be tree-shaken and
 * styled via `currentColor`. Adding a new icon = one entry in the
 * map below; no HTTP request, no font, no extra bundle.
 */

type IconDef = { viewBox: string; body: string };

const ICONS: Record<string, IconDef> = {
  search: {
    viewBox: "0 0 24 24",
    body: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
  },
  pin: {
    viewBox: "0 0 24 24",
    body: `<path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>`,
  },
  chevron: {
    viewBox: "0 0 24 24",
    body: `<path d="m9 18 6-6-6-6"/>`,
  },
  chevronDown: {
    viewBox: "0 0 24 24",
    body: `<path d="m6 9 6 6 6-6"/>`,
  },
  arrow: {
    viewBox: "0 0 24 24",
    body: `<path d="M5 12h14M13 5l7 7-7 7"/>`,
  },
  heart: {
    viewBox: "0 0 24 24",
    body: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
  },
  bed: {
    viewBox: "0 0 24 24",
    body: `<path d="M2 4v16M22 8v12M2 10h20v6H2zM6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>`,
  },
  bath: {
    viewBox: "0 0 24 24",
    body: `<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 2.12L7 8M4 17h16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2zM2 12h20v5H2zM5 12V5a1 1 0 0 1 1-1h4"/>`,
  },
  ruler: {
    viewBox: "0 0 24 24",
    body: `<path d="M21.3 8.7 15.3 2.7a1 1 0 0 0-1.4 0L2.7 13.9a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0L21.3 10.1a1 1 0 0 0 0-1.4zM7.5 10.5l2 2M11 7l2 2M14.5 3.5l2 2"/>`,
  },
  shield: {
    viewBox: "0 0 24 24",
    body: `<path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z"/><path d="m9 12 2 2 4-4"/>`,
  },
  check: {
    viewBox: "0 0 24 24",
    body: `<path d="m20 6-11 11-5-5"/>`,
  },
  whatsapp: {
    viewBox: "0 0 24 24",
    body: `<path d="M17.6 6.3A8 8 0 0 0 4.1 15.7L3 20.5a.5.5 0 0 0 .6.6l4.8-1.1a8 8 0 0 0 9.2-13.7z"/><path d="M8 10.5c.3 1.5 1.5 2.8 2.9 3.4.4.2 1 .3 1.4 0l.6-.5a.8.8 0 0 1 .9-.1l1.4.7c.3.1.4.4.3.6-.3.8-1.2 1.3-2.1 1.3-2.7 0-5.2-2.5-5.2-5.2 0-.9.5-1.8 1.3-2.1.2-.1.5 0 .6.3l.7 1.4a.8.8 0 0 1-.1.9l-.5.6c-.3.3-.2.5-.2.7z"/>`,
  },
  phone: {
    viewBox: "0 0 24 24",
    body: `<path d="M22 16.9v3a2 2 0 0 1-2.2 2 20 20 0 0 1-8.6-3.1 19.7 19.7 0 0 1-6-6A20 20 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2L8 9.6a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9z"/>`,
  },
  menu: {
    viewBox: "0 0 24 24",
    body: `<path d="M4 6h16M4 12h16M4 18h16"/>`,
  },
  close: {
    viewBox: "0 0 24 24",
    body: `<path d="M18 6 6 18M6 6l12 12"/>`,
  },
  user: {
    viewBox: "0 0 24 24",
    body: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  },
  globe: {
    viewBox: "0 0 24 24",
    body: `<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>`,
  },
  droplet: {
    viewBox: "0 0 24 24",
    body: `<path d="M12 2s7 7.6 7 13a7 7 0 1 1-14 0c0-5.4 7-13 7-13z"/>`,
  },
  bolt: {
    viewBox: "0 0 24 24",
    body: `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>`,
  },
  road: {
    viewBox: "0 0 24 24",
    body: `<path d="M4 21 9 3M20 21 15 3M12 4v3M12 10v3M12 16v3"/>`,
  },
  home: {
    viewBox: "0 0 24 24",
    body: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21V12h6v9"/>`,
  },
  building: {
    viewBox: "0 0 24 24",
    body: `<path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"/>`,
  },
  tree: {
    viewBox: "0 0 24 24",
    body: `<path d="M12 2a5 5 0 0 1 5 5c1.5 0 3 1.5 3 3.5S18.5 14 17 14h-1v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H7c-1.5 0-3-1.5-3-3.5S5.5 7 7 7a5 5 0 0 1 5-5z"/><path d="M12 14v8"/>`,
  },
  leaf: {
    viewBox: "0 0 24 24",
    body: `<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9s9 4 9 9-4 7-9 7z"/><path d="M2 22s4-8 9-9"/>`,
  },
  store: {
    viewBox: "0 0 24 24",
    body: `<path d="M3 9h18l-2-5H5L3 9zM4 9v11h16V9M10 14h4"/>`,
  },
  sparkles: {
    viewBox: "0 0 24 24",
    body: `<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2"/>`,
  },
};

@Component({
  selector: "app-icon",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (def()) {
      <svg
        [attr.viewBox]="def()!.viewBox"
        [attr.width]="size"
        [attr.height]="size"
        [attr.aria-hidden]="label ? null : 'true'"
        [attr.role]="label ? 'img' : null"
        [attr.aria-label]="label ?? null"
        [attr.stroke-width]="strokeWidth"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        [innerHTML]="safeBody()"
      ></svg>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
      }
      svg {
        display: block;
      }
    `,
  ],
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  private readonly _name = signal<string>("");
  @Input({ required: true })
  set name(value: string) {
    this._name.set(value);
  }

  @Input() size = 20;
  @Input() strokeWidth = 1.75;
  @Input() label?: string;

  readonly def = computed<IconDef | undefined>(() => ICONS[this._name()]);

  readonly safeBody = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.def()?.body ?? ""),
  );
}
