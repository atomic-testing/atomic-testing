import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, locatorUtil, Optional } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx CheckboxInput (`@astryxdesign/core/CheckboxInput`).
 *
 * The accessible control is the native `<input type="checkbox">` (its implicit
 * role is `checkbox`); the root is a plain styling `<div>` and Astryx does NOT
 * forward `data-testid`, so the scene anchors the `<input>` itself (e.g. scoped
 * `byInputType('checkbox')`). Checked/disabled come from {@link HTMLCheckboxDriver}.
 * Astryx 0.1.3 dropped the redundant `aria-checked="mixed"` it used to set for the
 * indeterminate state — only the native `.indeterminate` DOM property is set now
 * (it isn't reflected as an HTML attribute), so this driver reads it via the
 * `:indeterminate` CSS pseudo-class instead. The label is resolved through the
 * `<label for>`↔`id` link.
 */
export class CheckboxInputDriver extends HTMLCheckboxDriver {
  /** Whether the checkbox is checked. Alias of {@link isSelected}. */
  async isChecked(): Promise<boolean> {
    return this.isSelected();
  }

  /** Whether the checkbox is indeterminate (matches `:indeterminate`). */
  async isIndeterminate(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, byCssSelector(':indeterminate', 'Same')));
  }

  /** Toggle the checked state. */
  async toggle(): Promise<void> {
    await this.interactor.click(this.locator);
  }

  /** The checkbox's visible label, resolved via the `<label for>`↔`id` link. */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  override get driverName(): string {
    return 'AstryxCheckboxInputDriver';
  }
}
