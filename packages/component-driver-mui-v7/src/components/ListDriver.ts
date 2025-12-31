import {
  byRole,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  PartLocator,
} from '@atomic-testing/core';

import { ListItemDriver } from './ListItemDriver';

export const defaultListDriverOption: ListComponentDriverSpecificOption<ListItemDriver> = {
  itemClass: ListItemDriver,
  itemLocator: byRole('option'),
};

type ListDriverOption<ItemT extends ListItemDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

export class ListDriver<ItemT extends ListItemDriver = ListItemDriver> extends ListComponentDriver<ItemT> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    option: ListDriverOption<ItemT> = { ...defaultListDriverOption } as ListDriverOption<ItemT>
  ) {
    super(locator, interactor, option);
  }

  async getSelected(): Promise<ListItemDriver | null> {
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), ListItemDriver)) {
      if (await item.isSelected()) {
        return item;
      }
    }
    return null;
  }

  override get driverName(): string {
    return 'MuiV7ListDriver';
  }
}
