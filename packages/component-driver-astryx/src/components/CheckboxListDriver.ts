import { byTagName, IComponentDriverOption, Interactor, ListComponentDriver, PartLocator } from '@atomic-testing/core';

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
    const labels: string[] = [];
    for (const item of items) {
      const label = await item.getLabel();
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
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

  private async findByLabel(label: string): Promise<CheckboxListItemDriver | null> {
    for (const item of await this.getItems()) {
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
