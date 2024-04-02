import { Interactor } from '../interactor';
import { PartLocator } from '../locators/PartLocator';
import { IComponentDriverOption } from '../partTypes';
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

  protected getItemClass<ItemClass extends ComponentDriver = ItemT>(itemDriverClass?: ItemClass): ItemClass {
    return itemDriverClass ?? (this._option.itemClass as unknown as ItemClass);
  }

  /**
   * Get the item's driver instance at the given index
   * @param index
   * @param itemDriverClass
   * @returns The item's driver instance at the given index, if the index is out of range, return null
   */
  async getItemByIndex<ItemClass extends ComponentDriver = ItemT>(
    index: number,
    itemDriverClass?: ItemClass,
  ): Promise<ItemClass | null> {
    const driverClass = this.getItemClass<ItemClass>(itemDriverClass);
    // @ts-ignore
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
    itemDriverClass?: ItemClass,
  ): Promise<ItemClass | null> {
    const driverClass = this.getItemClass(itemDriverClass);

    // @ts-ignore
    for await (const item of listHelper.getListItemIterator<ItemClass>(this, this._itemLocator, driverClass)) {
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
  async getItems<ItemClass extends ComponentDriver = ItemT>(itemDriverClass?: ItemClass): Promise<ItemClass[]> {
    const driverClass = this.getItemClass(itemDriverClass);
    const result: ItemClass[] = [];
    // @ts-ignore
    for await (const item of listHelper.getListItemIterator<ItemClass>(this, this._itemLocator, driverClass)) {
      result.push(item);
    }
    return result;
  }

  override get driverName(): string {
    return 'ListComponentDriver';
  }
}
