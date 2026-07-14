import { ComponentDriver, IDisableableDriver, IRequirableDriver, IToggleDriver, Optional } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Fluent v9 `Switch` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): same shape as
 * {@link CheckboxDriver} — the locator forwards to a REAL native
 * `<input role="switch" class="fui-Switch__input" type="checkbox">`, with the
 * `label` prop rendering a sibling `<label for>` inside the same `fui-Switch`
 * wrapper, resolved the same way via the `for`↔`id` link. Unlike Checkbox, a
 * Switch renders no `value` attribute at all (it is a pure on/off control), so
 * this driver does not implement `IFormFieldDriver` — there is no value to read.
 */
export class SwitchDriver extends ComponentDriver<{}> implements IToggleDriver, IDisableableDriver, IRequirableDriver {
  /** Whether the switch is on (native input `checked` property). */
  isSelected(): Promise<boolean> {
    return this.interactor.isChecked(this.locator);
  }

  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  /** Whether the switch is disabled (native `disabled` attribute). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /** Whether the switch is marked required (native `required` attribute). */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.locator);
  }

  /**
   * The text of the `<label for>` linked to this switch via its `id`, or
   * `undefined` when the switch has no id / no matching label.
   */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  get driverName(): string {
    return 'FluentV9SwitchDriver';
  }
}
