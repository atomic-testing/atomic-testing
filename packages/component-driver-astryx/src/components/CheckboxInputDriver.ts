import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import { Optional } from '@atomic-testing/core';

import { linkedLabelLocator } from '../internal/linkedLocators';

/**
 * Driver for the Astryx CheckboxInput (`@astryxdesign/core/CheckboxInput`).
 *
 * The accessible control is the native `<input type="checkbox">` (its implicit
 * role is `checkbox`); the root is a plain styling `<div>` and Astryx does NOT
 * forward `data-testid`, so the scene anchors the `<input>` itself (e.g. scoped
 * `byInputType('checkbox')`). Checked/disabled come from {@link HTMLCheckboxDriver};
 * the indeterminate state is reported as `aria-checked="mixed"`, and the label is
 * resolved through the `<label for>`↔`id` link.
 */
export class CheckboxInputDriver extends HTMLCheckboxDriver {
  /** Whether the checkbox is checked. Alias of {@link isSelected}. */
  async isChecked(): Promise<boolean> {
    return this.isSelected();
  }

  /** Whether the checkbox is indeterminate (`aria-checked="mixed"`). */
  async isIndeterminate(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-checked')) === 'mixed';
  }

  /** Toggle the checked state. */
  async toggle(): Promise<void> {
    await this.interactor.click(this.locator);
  }

  /** The checkbox's visible label, resolved via the `<label for>`↔`id` link. */
  async getLabel(): Promise<Optional<string>> {
    const labelLocator = linkedLabelLocator(this.locator);
    if (!(await this.interactor.exists(labelLocator))) {
      return undefined;
    }
    return (await this.interactor.getText(labelLocator)) ?? undefined;
  }

  override get driverName(): string {
    return 'AstryxCheckboxInputDriver';
  }
}
