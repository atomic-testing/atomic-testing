import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  PartLocator,
} from '@atomic-testing/core';

import { ListItemDriver } from './ListItemDriver';

// A plain MUI `<List>` renders its `<ListItem>`s as `<li>` elements that carry no
// explicit `role` attribute (the `listitem` role is implicit). `byRole('listitem')`
// resolves to `[role="listitem"]` and would therefore match none of them, so the
// portable default is the `<li>` tag itself. Consumers whose items render as other
// roles (e.g. `<ListItemButton>` → `role="button"`, MenuList → `menuitem`) override
// `itemLocator`.
export const defaultListDriverOption: ListComponentDriverSpecificOption<ListItemDriver> = {
  itemClass: ListItemDriver,
  itemLocator: byCssSelector('li'),
};

type ListDriverOption<ItemT extends ListItemDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

export class ListDriver<ItemT extends ListItemDriver = ListItemDriver> extends ListComponentDriver<ItemT> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    option: ListDriverOption<ItemT> = { ...defaultListDriverOption } as ListDriverOption<ItemT>
  ) {
    // The framework always supplies a (defined) option object, so a default-valued
    // constructor parameter never applies; merge the defaults so `itemLocator`/`itemClass`
    // are filled for a plain `<List>` while any explicit override still wins.
    super(locator, interactor, { ...defaultListDriverOption, ...option } as ListDriverOption<ItemT>);
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
    return 'MuiV6ListDriver';
  }
}
