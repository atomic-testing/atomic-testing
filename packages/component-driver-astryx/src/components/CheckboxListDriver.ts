import {
  byRole,
  byTagName,
  IComponentDriverOption,
  Interactor,
  listHelper,
  ListComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { resolveDescribedByRoleText } from '../internal/linkedLocators';
import { CheckboxListItemDriver } from './CheckboxListItemDriver';

/**
 * Driver for the Astryx CheckboxList (`@astryxdesign/core/CheckboxList`).
 *
 * CheckboxList self-emits `data-testid` on its outer `<div>` (anchored by the
 * scene); inside is a `<ul role="list">` of `<li aria-checked>` rows. The
 * per-item `value` is a React key and is NOT emitted to the DOM, so rows are
 * addressed by their visible label (the row button's text) or by index — this is
 * the documented BYROLE_NAME-gap behaviour for CheckboxList (see #909).
 */
export class CheckboxListDriver extends ListComponentDriver<CheckboxListItemDriver> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { itemClass: CheckboxListItemDriver, itemLocator: byTagName('li'), ...option });
  }

  /** Visible labels of every row, in DOM order. */
  async getItemLabels(): Promise<string[]> {
    const items = await this.getItems();
    return listHelper.collectItemLabels(items);
  }

  /** Visible labels of the checked rows, in DOM order. */
  async getCheckedLabels(): Promise<string[]> {
    const items = await this.getItems();
    const labels: string[] = [];
    for (const item of items) {
      if (await item.isChecked()) {
        const label = await item.getLabel();
        if (label != null) {
          labels.push(label);
        }
      }
    }
    return labels;
  }

  /** Whether the row with the given label is checked. */
  async isItemChecked(label: string): Promise<boolean> {
    const item = await this.findByLabel(label);
    return item != null && (await item.isChecked());
  }

  /** Check the row with the given label if it is not already checked. */
  async checkItemByLabel(label: string): Promise<boolean> {
    return this.setItemCheckedByLabel(label, true);
  }

  /** Uncheck the row with the given label if it is currently checked. */
  async uncheckItemByLabel(label: string): Promise<boolean> {
    return this.setItemCheckedByLabel(label, false);
  }

  private async setItemCheckedByLabel(label: string, checked: boolean): Promise<boolean> {
    const item = await this.findByLabel(label);
    if (item == null) {
      return false;
    }
    if ((await item.isChecked()) !== checked) {
      await item.toggle();
    }
    return true;
  }

  /**
   * The `disabledMessage` tooltip text, shown when the whole group is disabled
   * with a reason. `disabledMessage` is a group-level prop (individual rows
   * have no reason of their own), and the tooltip's `aria-describedby` link is
   * composed onto the inner `role="group"` div alongside the
   * description/status-message ids — this picks out whichever target has
   * `role="tooltip"`. `undefined` when the group has no disabled-reason
   * tooltip.
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    const group = locatorUtil.append(this.locator, byRole('group'));
    return resolveDescribedByRoleText(this.interactor, group, 'aria-describedby', 'tooltip');
  }

  private async findByLabel(label: string): Promise<CheckboxListItemDriver | null> {
    // Stream the rows and stop at the first match instead of materialising the
    // whole list first — rows are addressed by their button label, so this is the
    // label-aware analogue of the base `getItemByLabel` (which matches `getText`).
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), CheckboxListItemDriver)) {
      if ((await item.getLabel()) === label) {
        return item;
      }
    }
    return null;
  }

  override get driverName(): string {
    return 'AstryxCheckboxListDriver';
  }
}
