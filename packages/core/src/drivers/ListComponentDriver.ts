import { Interactor } from '../interactor';
import { PartLocator } from '../locators/PartLocator';
import { IComponentDriverOption, ComponentDriverCtor } from '../partTypes';
import * as locatorUtil from '../utils/locatorUtil';

import { ComponentDriver } from './ComponentDriver';
import * as listHelper from './listHelper';

export interface ListComponentDriverSpecificOption<ItemT extends ComponentDriver> {
  itemClass: new (locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) => ItemT;
  itemLocator: PartLocator;
}

export interface ListComponentDriverOption<ItemT extends ComponentDriver>
  extends IComponentDriverOption,
    ListComponentDriverSpecificOption<ItemT> {}

export class ListComponentDriver<ItemT extends ComponentDriver> extends ComponentDriver {
  private readonly _option: ListComponentDriverSpecificOption<ItemT> & Partial<ListComponentDriverOption<ItemT>>;
  private _itemLocator: PartLocator;
  constructor(locator: PartLocator, interactor: Interactor, option: ListComponentDriverSpecificOption<ItemT>) {
    super(locator, interactor, {
      ...option,
      parts: {},
    });

    this._option = option;
    const childLocator = option.itemLocator;
    this._itemLocator = locatorUtil.append(locator, childLocator);
  }

  protected getItemLocator(): PartLocator {
    return this._itemLocator;
  }

  protected getItemClass<ItemClass extends ComponentDriver = ItemT>(
    itemDriverClass?: ComponentDriverCtor<ItemClass>
  ): ComponentDriverCtor<ItemClass> {
    return itemDriverClass ?? (this._option.itemClass as unknown as ComponentDriverCtor<ItemClass>);
  }

  /**
   * Get the item's driver instance at the given index
   * @param index
   * @param itemDriverClass
   * @returns The item's driver instance at the given index, if the index is out of range, return null
   */
  async getItemByIndex<ItemClass extends ComponentDriver = ItemT>(
    index: number,
    itemDriverClass?: ComponentDriverCtor<ItemClass>
  ): Promise<ItemClass | null> {
    const driverClass = this.getItemClass<ItemClass>(itemDriverClass);
    return listHelper.getListItemByIndex(this, this._itemLocator, index, driverClass);
  }

  /**
   * Get the item's driver instance by the given text
   * @param text
   * @param itemDriverClass
   * @returns The item's driver instance by the given text, if the text is not found, return null
   */
  async getItemByLabel<ItemClass extends ComponentDriver = ItemT>(
    text: string,
    itemDriverClass?: ComponentDriverCtor<ItemClass>
  ): Promise<ItemClass | null> {
    const driverClass = this.getItemClass(itemDriverClass);

    for await (const item of listHelper.getListItemIterator(this, this._itemLocator, driverClass)) {
      const itemText = await item.getText();
      if (itemText?.trim() === text) {
        return item;
      }
    }
    return null;
  }

  /**
   * Get all the items' driver instances in the list
   * @param itemDriverClass
   * @returns
   */
  async getItems<ItemClass extends ComponentDriver = ItemT>(
    itemDriverClass?: ComponentDriverCtor<ItemClass>
  ): Promise<ItemClass[]> {
    const driverClass = this.getItemClass(itemDriverClass);
    const result: ItemClass[] = [];
    for await (const item of listHelper.getListItemIterator(this, this._itemLocator, driverClass)) {
      result.push(item);
    }
    return result;
  }

  /**
   * Get the number of items in the list.
   * This is more efficient than calling getItems().length when you only need the count,
   * as it does not instantiate driver instances for each item.
   * @returns The number of items in the list
   */
  async getItemCount(): Promise<number> {
    return listHelper.getListItemCount(this, this._itemLocator);
  }

  override get driverName(): string {
    return 'ListComponentDriver';
  }
}
