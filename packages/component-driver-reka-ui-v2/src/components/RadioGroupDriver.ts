import {
  byAttribute,
  byRole,
  ComponentDriver,
  IDisableableDriver,
  IInputDriver,
  IRequirableDriver,
  listHelper,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

import { RadioGroupItemDriver } from './RadioGroupItemDriver';

const itemLocator = byRole('radio');

/**
 * Driver for the Reka UI RadioGroup primitive (`RadioGroupRoot` +
 * `RadioGroupItem` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `RadioGroupDriver` — the root renders `<div
 * role="radiogroup" aria-required="true"/"false" data-disabled>` (`data-disabled`
 * present only when the group's own `disabled` prop is set, absent otherwise),
 * and each descendant `<button role="radio">` carries `aria-checked`,
 * `data-state="checked"/"unchecked"`, and its own `value` attribute. Verified by
 * rendering a live multi-item group, a group-level-disabled group (confirming
 * `disabled`/`data-disabled` cascade onto every item), and a required group.
 */
export class RadioGroupDriver
  extends ComponentDriver<{}>
  implements IInputDriver<string | null>, IDisableableDriver, IRequirableDriver
{
  private get itemsLocator(): PartLocator {
    return locatorUtil.append(this.locator, itemLocator);
  }

  async getValue(): Promise<string | null> {
    const checked = locatorUtil.append(this.locator, itemLocator, byAttribute('data-state', 'checked', 'Same'));
    if (!(await this.interactor.exists(checked))) {
      return null;
    }
    return (await this.interactor.getAttribute(checked, 'value')) ?? null;
  }

  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      throw new Error('RadioGroup cannot be deselected; pass an item value.');
    }
    const item = await this.getItemByValue(value);
    if (item == null || (await item.isDisabled())) {
      return false;
    }
    await item.setSelected(true);
    return true;
  }

  async getItemByValue(value: string): Promise<RadioGroupItemDriver | null> {
    for await (const item of listHelper.getListItemIterator(this, this.itemsLocator, RadioGroupItemDriver)) {
      if ((await item.getValue()) === value) {
        return item;
      }
    }
    return null;
  }

  async getItemCount(): Promise<number> {
    return listHelper.getListItemCount(this, this.itemsLocator);
  }

  /**
   * Whether the group itself was rendered with `disabled` — distinct from a
   * single item's own disabled state, though a disabled group cascades
   * `data-disabled` onto every item too (see `RadioGroupItemDriver`).
   */
  async isDisabled(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'data-disabled');
  }

  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  get driverName(): string {
    return 'RekaUiV2RadioGroupDriver';
  }
}
