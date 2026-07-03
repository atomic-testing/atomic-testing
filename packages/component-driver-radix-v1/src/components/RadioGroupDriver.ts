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
 * Driver for the Radix RadioGroup primitive (`RadioGroup.Root` from `radix-ui`).
 *
 * `RadioGroup.Root` renders `role="radiogroup"`; each `RadioGroup.Item` is a
 * `<button role="radio">` (no native `<input>`), so selection is read/written
 * through `data-state`/`aria-checked` rather than `:checked` —
 * `Interactor.isChecked` only recognizes native inputs. Mirrors the shape of
 * the Astryx `RadioListDriver` / MUI `HTMLRadioButtonGroupDriver`, templated
 * per the issue's own "RadioGroup -> HTMLRadioButtonGroup" guidance, adapted
 * for the button-based item DOM.
 */
export class RadioGroupDriver
  extends ComponentDriver<{}>
  implements IInputDriver<string | null>, IDisableableDriver, IRequirableDriver
{
  private get itemsLocator(): PartLocator {
    return locatorUtil.append(this.locator, itemLocator);
  }

  /** The selected item's `value`, or `null` when none is selected. */
  async getValue(): Promise<string | null> {
    const checked = locatorUtil.append(this.locator, itemLocator, byAttribute('data-state', 'checked', 'Same'));
    if (!(await this.interactor.exists(checked))) {
      return null;
    }
    return (await this.interactor.getAttribute(checked, 'value')) ?? null;
  }

  /**
   * Select the item whose `value` matches.
   * @returns `false` when no such item exists or it is disabled.
   */
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

  /** Get the item whose `value` matches, or `null` if none. */
  async getItemByValue(value: string): Promise<RadioGroupItemDriver | null> {
    for await (const item of listHelper.getListItemIterator(this, this.itemsLocator, RadioGroupItemDriver)) {
      if ((await item.getValue()) === value) {
        return item;
      }
    }
    return null;
  }

  /** Number of items in the group. */
  async getItemCount(): Promise<number> {
    return listHelper.getListItemCount(this, this.itemsLocator);
  }

  /** Whether the whole group is disabled (`data-disabled` on the root). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'data-disabled');
  }

  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  get driverName(): string {
    return 'RadixV1RadioGroupDriver';
  }
}
