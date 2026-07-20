import {
  byCssClass,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  PartLocator,
} from '@atomic-testing/core';

import { ListItemDriver } from './ListItemDriver';

/**
 * `ListItem`s are homogeneous `.fui-ListItem` siblings directly under the
 * `List` root regardless of element tag (`<ul>`/`<ol>`/`<div>`) or role
 * (`role="list"` plain, `role="listbox"` when `selectionMode` is set) — DOM
 * audit, `@fluentui/react-components@9.74.3` — so `ListComponentDriver`'s
 * `:nth-of-type` addressing is safe, mirroring `AccordionDriver`.
 */
export const defaultListDriverOption: ListComponentDriverSpecificOption<ListItemDriver> = {
  itemClass: ListItemDriver,
  itemLocator: byCssClass('fui-ListItem'),
};

type ListDriverOption<ItemT extends ListItemDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `List` component.
 *
 * A {@link ListComponentDriver} over `ListItem`s. `navigationMode` has no
 * DOM reflection to read back; `selectionMode` is only observable indirectly
 * (whether `aria-selected` appears on items at all — see
 * {@link ListItemDriver.isSelected}), so this driver exposes no mode getter,
 * the same call `AccordionDriver` makes for its own unreflected `multiple`/
 * `collapsible` props.
 */
export class ListDriver<ItemT extends ListItemDriver = ListItemDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<ListDriverOption<ItemT>> = {}) {
    super(locator, interactor, {
      ...defaultListDriverOption,
      ...option,
    } as ListDriverOption<ItemT>);
  }

  /** The `value` of every currently-selected item, in DOM order (supports `multiselect` mode). */
  async getSelectedValues(): Promise<string[]> {
    const selected: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), this.getItemClass())) {
      if (await item.isSelected()) {
        selected.push((await item.getValue()) ?? '');
      }
    }
    return selected;
  }

  override get driverName(): string {
    return 'FluentV9ListDriver';
  }
}
