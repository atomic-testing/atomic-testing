import { HTMLRadioButtonGroupDriver } from '@atomic-testing/component-driver-html';
import { byChecked, byInputType, byRole, byValue, locatorUtil, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx RadioList (`@astryxdesign/core/RadioList`).
 *
 * RadioList self-emits `data-testid` on its OUTER `<div>` (which the scene
 * anchors); inside, the group label is a `<label>` and the radios are native
 * `<input type="radio" value name>` under an inner `role="radiogroup"` div.
 * Selection read/write reuse {@link HTMLRadioButtonGroupDriver} (checked radio's
 * `value`; click by `value`).
 */
export class RadioListDriver extends HTMLRadioButtonGroupDriver {
  /**
   * The selected radio's `value`, or `null` when none is selected.
   *
   * Overrides the base, which composes `:checked` directly onto the driver root;
   * here the root is the RadioList wrapper, so the checked radio must be matched
   * as a descendant.
   */
  override async getValue(): Promise<string | null> {
    const checked = locatorUtil.append(this.locator, byInputType('radio'), byChecked(true, 'Same'));
    if (!(await this.interactor.exists(checked))) {
      return null;
    }
    return (await this.interactor.getAttribute(checked, 'value')) ?? null;
  }

  /**
   * Select the radio whose `value` matches it (matched as a descendant of the
   * root).
   * @returns `false` when no such radio exists or it is `disabled` — clicking a
   * disabled native radio fires no change, so reporting success would be a lie.
   */
  override async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      throw new Error('RadioList cannot be deselected; pass a radio value.');
    }
    const radio = locatorUtil.append(this.locator, byInputType('radio'), byValue(value, 'Same'));
    if (!(await this.interactor.exists(radio)) || (await this.interactor.isDisabled(radio))) {
      return false;
    }
    await this.interactor.click(radio);
    return true;
  }

  /** The selected radio's `value`, or `null` when none is selected. Alias of `getValue`. */
  async getSelectedValue(): Promise<string | null> {
    return this.getValue();
  }

  /** Select the radio whose `value` matches. Alias of `setValue`. */
  async selectByValue(value: string): Promise<boolean> {
    return this.setValue(value);
  }

  /** Whether the radio with `value` is checked. */
  async isItemChecked(value: string): Promise<boolean> {
    const radio = locatorUtil.append(this.locator, byInputType('radio'), byValue(value, 'Same'));
    return this.interactor.isChecked(radio);
  }

  /** All radio `value`s, in DOM order. */
  async getItemValues(): Promise<readonly string[]> {
    const radios = locatorUtil.append(this.locator, byInputType('radio'));
    const values = await this.interactor.getAttribute(radios, 'value', true);
    return values.filter((v): v is string => v != null);
  }

  /** Number of radio items. */
  async getItemCount(): Promise<number> {
    return (await this.getItemValues()).length;
  }

  /**
   * The group's accessible name.
   *
   * Read from the inner radiogroup's `aria-label` (which Astryx sets to the group
   * label) rather than the `<label>` element — the root also contains each item's
   * own `<label>`, so a `label` match is ambiguous (Playwright rejects it).
   */
  async getLabel(): Promise<Optional<string>> {
    const group = locatorUtil.append(this.locator, byRole('radiogroup'));
    return this.interactor.getAttribute(group, 'aria-label');
  }

  /** Whether the group is required (`aria-required` on the inner radiogroup). */
  async isRequired(): Promise<boolean> {
    const group = locatorUtil.append(this.locator, byRole('radiogroup'));
    return (await this.interactor.getAttribute(group, 'aria-required')) === 'true';
  }

  override get driverName(): string {
    return 'AstryxRadioListDriver';
  }
}
