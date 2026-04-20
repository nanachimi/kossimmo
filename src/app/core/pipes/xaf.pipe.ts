import { Pipe, PipeTransform, inject } from "@angular/core";
import { I18nService } from "../services/i18n.service";
import type { Money } from "../models/property.model";

@Pipe({ name: "xaf", standalone: true, pure: false })
export class XafPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(money: Money | null | undefined): string {
    if (!money) return "";
    this.i18n.locale();
    return this.i18n.formatPrice(money.amount, money.period);
  }
}
