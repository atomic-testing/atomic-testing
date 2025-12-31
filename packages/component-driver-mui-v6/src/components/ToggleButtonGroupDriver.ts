import { byTagName, ComponentDriver, IInputDriver, listHelper, locatorUtil } from '@atomic-testing/core';

import { ToggleButtonDriver } from './ToggleButtonDriver';

const toggleButtonLocator = byTagName('button');

export class ToggleButtonGroupDriver extends ComponentDriver implements IInputDriver<readonly string[]> {
  protected itemLocator = locatorUtil.append(this.locator, toggleButtonLocator);
  /**
   * Get all the selected toggle buttons' values.
   * @returns
   */
  async getValue(): Promise<readonly string[]> {
    const result: string[] = [];
    for await (const itemDriver of listHelper.getListItemIterator(this, this.itemLocator, ToggleButtonDriver)) {
      const isSelected = await itemDriver.isSelected();
      if (isSelected) {
        const value = await itemDriver.getValue();
        if (value != null) {
          result.push(value);
        }
      }
    }
    return result;
  }

  /**
   * Toggle all the toggle buttons such that only those with value in the given array are selected.
   * @param value Always true
   * @returns
   */
  async setValue(value: readonly string[]): Promise<boolean> {
    const valueSet = new Set(value);
    for await (const itemDriver of listHelper.getListItemIterator(this, this.itemLocator, ToggleButtonDriver)) {
      const value = await itemDriver.getValue();
      await itemDriver.setSelected(valueSet.has(value!));
    }
    return true;
  }

  get driverName(): string {
    return 'MuiV6ToggleButtonGroupDriver';
  }
}

/**
 * A toggle button group driver that only allows a single selection.
 *
 * INTENTIONAL @ts-ignore comments below: This class intentionally narrows the return type
 * from `readonly string[]` to `string | null` for exclusive selection mode. TypeScript
 * correctly flags this as a type incompatibility because the subclass changes the interface
 * contract. However, this design is intentional as exclusive and multi-select toggle groups
 * have fundamentally different value semantics, and we want the type system to reflect
 * `string | null` for exclusive mode rather than forcing consumers to work with arrays.
 */
export class ExclusiveToggleButtonGroupDriver extends ToggleButtonGroupDriver implements IInputDriver<string | null> {
  // @ts-ignore - See class comment for explanation of intentional type narrowing
  async getValue(): Promise<string | null> {
    const values = await super.getValue();
    return values?.[0] ?? null;
  }

  // @ts-ignore - See class comment for explanation of intentional type narrowing
  async setValue(value: string | null): Promise<boolean> {
    if (value === null) {
      return super.setValue([]);
    } else {
      return super.setValue([value]);
    }
  }

  get driverName(): string {
    return 'MuiV6ExclusiveToggleButtonGroupDriver';
  }
}
