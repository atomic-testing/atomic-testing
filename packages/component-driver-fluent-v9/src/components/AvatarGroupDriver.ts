import {
  byCssClass,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  PartLocator,
} from '@atomic-testing/core';

import { AvatarGroupItemDriver } from './AvatarGroupItemDriver';

/**
 * `AvatarGroupItem`s are homogeneous `<div class="fui-AvatarGroupItem">`
 * siblings directly under the `<div role="group" class="fui-AvatarGroup">`
 * root (DOM audit, `@fluentui/react-components@9.74.3`) — the same shape as
 * `AccordionDriver`'s items — so `ListComponentDriver`'s `:nth-of-type`
 * addressing is safe. Addressing the nested `.fui-Avatar` elements directly
 * instead would NOT be safe: each lives under its own single-child wrapper,
 * so every one of them independently matches `:nth-of-type(1)` — this is why
 * the item class is {@link AvatarGroupItemDriver} (the wrapper), not
 * `AvatarDriver` (the avatar) directly.
 */
export const defaultAvatarGroupDriverOption: ListComponentDriverSpecificOption<AvatarGroupItemDriver> = {
  itemClass: AvatarGroupItemDriver,
  itemLocator: byCssClass('fui-AvatarGroupItem'),
};

type AvatarGroupDriverOption<ItemT extends AvatarGroupItemDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `AvatarGroup` component.
 *
 * A {@link ListComponentDriver} over the inline `AvatarGroupItem`s, mirroring
 * `AccordionDriver`'s shape. **Overflow (`AvatarGroupPopover`) is out of
 * scope for this wave** — when a group's `layout` overflows its inline
 * items into the popover's `+N` trigger button, those overflowed items are
 * not enumerated by this driver (see the package README's Known gaps); only
 * the inline items are covered.
 */
export class AvatarGroupDriver<
  ItemT extends AvatarGroupItemDriver = AvatarGroupItemDriver,
> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<AvatarGroupDriverOption<ItemT>> = {}) {
    super(locator, interactor, {
      ...defaultAvatarGroupDriverOption,
      ...option,
    } as AvatarGroupDriverOption<ItemT>);
  }

  /** The `name` of every inline avatar, in DOM order. */
  async getNames(): Promise<string[]> {
    const names: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), this.getItemClass())) {
      names.push((await item.getAvatar().getName()) ?? '');
    }
    return names;
  }

  override get driverName(): string {
    return 'FluentV9AvatarGroupDriver';
  }
}
