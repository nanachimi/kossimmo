import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { IconComponent } from "../icon/icon.component";

let idSeq = 0;

@Component({
  selector: "app-input",
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    @if (label) {
      <label [for]="id" class="lbl">{{ label }}</label>
    }
    <div class="wrap" [class.wrap--filled]="!!value">
      @if (leadingIcon) {
        <span class="lead">
          <app-icon [name]="leadingIcon" [size]="18" />
        </span>
      }
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [attr.inputmode]="inputMode"
        [attr.aria-label]="!label ? placeholder : null"
      />
    </div>
    @if (hint) {
      <small class="hint">{{ hint }}</small>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .lbl {
        display: block;
        font-size: var(--step--1);
        font-weight: 500;
        letter-spacing: var(--tracking-wide);
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: 0.4rem;
      }
      .wrap {
        display: flex;
        align-items: center;
        background: var(--surface-raised);
        border: 1px solid var(--border-strong);
        border-radius: var(--radius-sm);
        transition: border-color var(--dur-sm) var(--ease-out),
          box-shadow var(--dur-sm) var(--ease-out),
          background-color var(--dur-sm) var(--ease-out);
      }
      .wrap:hover {
        border-color: var(--ink);
      }
      .wrap:focus-within {
        border-color: var(--ochre);
        box-shadow: var(--shadow-focus);
      }
      .lead {
        display: flex;
        padding-left: 0.9rem;
        color: var(--text-muted);
      }
      input {
        flex: 1;
        padding: 0.85rem 1rem;
        font-size: var(--step-0);
        background: transparent;
        color: var(--ink);
        outline: none;
        min-width: 0;
      }
      input::placeholder {
        color: var(--text-muted);
      }
      .hint {
        display: block;
        margin-top: 0.35rem;
        font-size: var(--step--2);
        color: var(--text-muted);
      }
    `,
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = "";
  @Input() hint?: string;
  @Input() type: "text" | "email" | "tel" | "number" | "search" = "text";
  @Input() inputMode?: "text" | "numeric" | "tel" | "search" | "email";
  @Input() leadingIcon?: string;

  readonly id = `inp-${++idSeq}`;
  value = "";
  disabled = false;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value ?? "";
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
