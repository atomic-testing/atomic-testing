import { ComponentDriver, IDisableableDriver, IToggleDriver } from '@atomic-testing/core';

/**
 * Driver for a single Reka UI RadioGroup item (`RadioGroupItem` from
 * `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `RadioGroupItemDriver` — a real `<button
 * role="radio" aria-checked="true"/"false" data-state="checked"/"unchecked"
 * value="..." disabled data-disabled>` (no wrapping element between the item
 * and its parent `RadioGroupRoot`). A disabled parent group cascades `disabled`/
 * `data-disabled` onto every item, so `isDisabled` reads true here even when
 * only the group, not the item itself, was marked disabled.
 */
export class RadioGroupItemDriver extends ComponentDriver<{}> implements IToggleDriver, IDisableableDriver {
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'checked';
  }

  /**
   * No-ops on a disabled item rather than clicking it regardless — see
   * `SwitchDriver.setSelected` for why.
   */
  async setSelected(selected: boolean): Promise<void> {
    if (!selected) {
      throw new Error('A RadioGroup item cannot be deselected directly; select a different item instead.');
    }
    if (await this.isSelected()) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.locator, 'value')) ?? null;
  }

  get driverName(): string {
    return 'RekaUiV2RadioGroupItemDriver';
  }
}
