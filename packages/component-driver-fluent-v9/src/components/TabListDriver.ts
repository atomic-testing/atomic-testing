import {
  byRole,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  Nullable,
  PartLocator,
} from '@atomic-testing/core';

import { TabDriver } from './TabDriver';

/**
 * Tabs are located by their accessible `role="tab"` children — `TabList`
 * renders no interleaved non-tab siblings (DOM audit,
 * `@fluentui/react-components@9.74.3`: `TabList`'s root is `role="tablist"`
 * wrapping only `Tab` buttons, no focus-trap dummy elements like `MenuList`
 * has), so the homogeneous-siblings requirement `ListComponentDriver`'s
 * `:nth-of-type` addressing relies on is safe here.
 */
export const defaultTabListDriverOption: ListComponentDriverSpecificOption<TabDriver> = {
  itemClass: TabDriver,
  itemLocator: byRole('tab'),
};

type TabListDriverOption<ItemT extends TabDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `TabList` (holding `Tab` children — see
 * {@link TabDriver}).
 *
 * A {@link ListComponentDriver} over the `role="tab"` children, templated
 * directly off `component-driver-mui-v9`'s `TabsDriver` (named after Fluent's
 * OWN component, `TabList`, per this package's naming convention). `TabList`
 * has no built-in `TabPanel` — Fluent's `@fluentui/react-tabs` ships only
 * `Tab`/`TabList`, leaving panel rendering/`id`/`aria-controls` wiring
 * entirely to the consumer — so this driver, like its MUI sibling, covers
 * tab selection only.
 */
export class TabListDriver<ItemT extends TabDriver = TabDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<TabListDriverOption<ItemT>> = {}) {
    // A tab list's item shape is fixed (role="tab" buttons driven by TabDriver),
    // so the defaults are merged in rather than relying on a default parameter:
    // the test engine always passes an option object for a scene part, which
    // would otherwise shadow a default-valued parameter and leave itemLocator unset.
    super(locator, interactor, {
      ...defaultTabListDriverOption,
      ...option,
    } as TabListDriverOption<ItemT>);
  }

  /** The `TabList`'s orientation. `TabList` always reflects `aria-orientation`, defaulting to `'horizontal'`. */
  async getOrientation(): Promise<'horizontal' | 'vertical'> {
    const value = await this.interactor.getAttribute(this.locator, 'aria-orientation');
    return value === 'vertical' ? 'vertical' : 'horizontal';
  }

  /** The visible label of every tab, in DOM order. */
  async getTabLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      const text = await tab.getText();
      labels.push(text?.trim() ?? '');
    }
    return labels;
  }

  /** The number of tabs in the list. */
  async getTabCount(): Promise<number> {
    return this.getItemCount();
  }

  /** Zero-based index of the selected tab, or `-1` when no tab is selected. */
  async getSelectedIndex(): Promise<number> {
    let index = 0;
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      if (await tab.isSelected()) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /** Label of the selected tab, or `null` when no tab is selected. */
  async getSelectedLabel(): Promise<Nullable<string>> {
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      if (await tab.isSelected()) {
        return (await tab.getText())?.trim() ?? null;
      }
    }
    return null;
  }

  /** The `value` of the selected tab (see {@link TabDriver.getValue}), or `null` when no tab is selected. */
  async getSelectedValue(): Promise<Nullable<string>> {
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      if (await tab.isSelected()) {
        return (await tab.getValue()) ?? null;
      }
    }
    return null;
  }

  /**
   * Select the tab at the given zero-based index.
   * @returns `false` when the index is out of range.
   */
  async selectByIndex(index: number): Promise<boolean> {
    const tab = await this.getItemByIndex(index);
    if (tab == null) {
      return false;
    }
    await tab.click();
    return true;
  }

  /**
   * Select the first tab whose visible label equals `label`.
   * @returns `false` when no tab matches.
   */
  async selectByLabel(label: string): Promise<boolean> {
    const tab = await this.getItemByLabel(label);
    if (tab == null) {
      return false;
    }
    await tab.click();
    return true;
  }

  /**
   * Select the first tab whose `value` attribute equals `value` (see
   * {@link TabDriver.getValue}).
   * @returns `false` when no tab matches.
   */
  async selectByValue(value: string): Promise<boolean> {
    for await (const tab of listHelper.getListItemIterator(this, this.getItemLocator(), TabDriver)) {
      if ((await tab.getValue()) === value) {
        await tab.click();
        return true;
      }
    }
    return false;
  }

  /**
   * Whether the tab at the given index is disabled.
   * @returns `false` when the index is out of range.
   */
  async isTabDisabled(index: number): Promise<boolean> {
    const tab = await this.getItemByIndex(index);
    return tab == null ? false : tab.isDisabled();
  }

  override get driverName(): string {
    return 'FluentV9TabListDriver';
  }
}
