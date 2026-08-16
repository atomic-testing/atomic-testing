import { byInputType, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for a single Astryx CheckboxList row (`<li>`).
 *
 * Each row is a plain `<li role="listitem">` containing the native
 * `<input type="checkbox">` and the row's visible label. Astryx 0.1.3 dropped the
 * row's `aria-checked` (invalid on `role="listitem"` — axe: aria-allowed-attr);
 * checked state is conveyed solely by the inner checkbox, so this driver reads it
 * there. The item's identity is NOT emitted as a DOM value (it is a React key), so
 * rows are addressed by label text or index — this driver exposes both the label
 * and the checked state.
 *
 * Astryx 0.3.0 made the checkbox the row's **single** focusable control (WCAG
 * 4.1.2): the invisible row `<button>` is gone, and the row surface delegates its
 * clicks to the checkbox through `ListItem`'s `interactiveRef`. That removed the
 * one element whose text was exactly the label — the row's own text now reads the
 * label *twice*, once from the checkbox's visually-hidden `<label>` and once from
 * the visible one. So the label is resolved through the `<label for>`↔`id` link
 * instead, which is both unambiguous and the checkbox's real accessible name.
 */
export class CheckboxListItemDriver extends ComponentDriver<{}> {
  private get checkbox(): PartLocator {
    return locatorUtil.append(this.locator, byInputType('checkbox'));
  }

  /** The row's visible label (the checkbox's associated `<label for>` text). */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.checkbox);
  }

  /** Whether the row is checked (the inner checkbox's checked state). */
  async isChecked(): Promise<boolean> {
    return this.interactor.isChecked(this.checkbox);
  }

  /** Toggle the row by clicking its checkbox. */
  async toggle(): Promise<void> {
    await this.interactor.click(this.checkbox);
  }

  get driverName(): string {
    return 'AstryxCheckboxListItemDriver';
  }
}
