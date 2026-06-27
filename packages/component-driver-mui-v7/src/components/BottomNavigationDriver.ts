import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  Nullable,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { BottomNavigationActionDriver } from './BottomNavigationActionDriver';

export interface BottomNavigationActionInfo {
  /** The action's visible label. */
  label: Optional<string>;
  /** Whether the action is currently selected. */
  selected: boolean;
}

/**
 * BottomNavigation actions are direct-child `<button>` siblings of the root (no
 * ARIA role). They are located by their `MuiBottomNavigationAction-root` class
 * rather than a bare `button` tag, so positional enumeration is not thrown off by
 * any incidental nested button inside an action.
 */
export const defaultBottomNavigationDriverOption: ListComponentDriverSpecificOption<BottomNavigationActionDriver> = {
  itemClass: BottomNavigationActionDriver,
  itemLocator: byCssSelector('.MuiBottomNavigationAction-root'),
};

type BottomNavigationDriverOption<ItemT extends BottomNavigationActionDriver> =
  ListComponentDriverSpecificOption<ItemT> & Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Material UI v7 BottomNavigation component.
 *
 * A {@link ListComponentDriver} over the action buttons, exposing the selected
 * index/label, selection by index/label, and per-action info, plus per-action
 * {@link BottomNavigationActionDriver} instances via `getItems`/`getItemByIndex`/
 * `getItemByLabel`.
 * @see https://mui.com/material-ui/react-bottom-navigation/
 */
export class BottomNavigationDriver<
  ItemT extends BottomNavigationActionDriver = BottomNavigationActionDriver,
> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<BottomNavigationDriverOption<ItemT>> = {}) {
    // Merge defaults so the driver works as a bare scene part (see TabsDriver).
    super(locator, interactor, {
      ...defaultBottomNavigationDriverOption,
      ...option,
    } as BottomNavigationDriverOption<ItemT>);
  }

  /**
   * Every action with its label and selected state, in order.
   */
  async getActions(): Promise<BottomNavigationActionInfo[]> {
    const actions: BottomNavigationActionInfo[] = [];
    for await (const item of listHelper.getListItemIterator(
      this,
      this.getItemLocator(),
      BottomNavigationActionDriver
    )) {
      actions.push({
        label: (await item.getText())?.trim(),
        selected: await item.isSelected(),
      });
    }
    return actions;
  }

  /**
   * Zero-based index of the selected action, or `-1` when none is selected.
   */
  async getSelectedIndex(): Promise<number> {
    let index = 0;
    for await (const item of listHelper.getListItemIterator(
      this,
      this.getItemLocator(),
      BottomNavigationActionDriver
    )) {
      if (await item.isSelected()) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /**
   * Label of the selected action, or `null` when none is selected. Returns `null`
   * (not `undefined`) to match the sibling `TabsDriver.getSelectedLabel` contract.
   */
  async getSelectedLabel(): Promise<Nullable<string>> {
    for await (const item of listHelper.getListItemIterator(
      this,
      this.getItemLocator(),
      BottomNavigationActionDriver
    )) {
      if (await item.isSelected()) {
        return (await item.getText())?.trim() ?? null;
      }
    }
    return null;
  }

  /**
   * Select the action at the given zero-based index.
   * @returns `false` when the index is out of range.
   */
  async selectByIndex(index: number): Promise<boolean> {
    const item = await this.getItemByIndex(index);
    if (item == null) {
      return false;
    }
    await item.click();
    return true;
  }

  /**
   * Select the first action whose visible label equals `label`.
   * @returns `false` when no action matches.
   */
  async selectByLabel(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      return false;
    }
    await item.click();
    return true;
  }

  override get driverName(): string {
    return 'MuiV7BottomNavigationDriver';
  }
}
