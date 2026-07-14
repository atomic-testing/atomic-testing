import { ComponentDriver, IDisableableDriver, IToggleDriver, Optional } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for a single Fluent v9 `Radio` item (used inside a `RadioGroup`).
 *
 * DOM audit (@fluentui/react-components@9.74.3): the locator forwards to a
 * REAL native `<input type="radio" class="fui-Radio__input">` sharing one
 * `name` per group (Fluent auto-generates it from the group), with the
 * `label` prop rendering a sibling `<label for>` inside the same `fui-Radio`
 * wrapper — resolved via the `for`↔`id` link, same as {@link CheckboxDriver}.
 *
 * `setSelected(false)` is rejected: a native radio cannot deselect itself,
 * only a different item's selection can displace it (same contract as
 * `component-driver-primevue-v4`'s `RadioButtonDriver` and
 * `component-driver-radix-v1`'s `RadioGroupItemDriver`).
 */
export class RadioDriver extends ComponentDriver<{}> implements IToggleDriver, IDisableableDriver {
  /** Whether this radio is selected (native input `checked` property). */
  isSelected(): Promise<boolean> {
    return this.interactor.isChecked(this.locator);
  }

  async setSelected(selected: boolean): Promise<void> {
    if (!selected) {
      throw new Error('A Radio cannot be deselected directly; select a different item instead.');
    }
    if (!(await this.isSelected())) {
      await this.interactor.click(this.locator);
    }
  }

  /** Whether this radio is disabled (native `disabled` attribute; cascades from a disabled `RadioGroup`). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /** The `value` this radio represents (native `value` attribute). */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.locator, 'value')) ?? null;
  }

  /**
   * The text of the `<label for>` linked to this radio via its `id`, or
   * `undefined` when the radio has no id / no matching label.
   */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  get driverName(): string {
    return 'FluentV9RadioDriver';
  }
}
