import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { AvatarDriver } from './AvatarDriver';

// Every avatar inside the group (including the surplus "+N" avatar) carries the
// MuiAvatarGroup-avatar class and is a direct-child sibling, so they enumerate
// positionally.
const avatarItemLocator = byCssSelector('.MuiAvatarGroup-avatar');

// The surplus avatar's only distinguishing feature is its "+N" text.
const surplusPattern = /^\+\d+$/;

export const defaultAvatarGroupDriverOption: ListComponentDriverSpecificOption<AvatarDriver> = {
  itemClass: AvatarDriver,
  itemLocator: avatarItemLocator,
};

type AvatarGroupDriverOption<ItemT extends AvatarDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Material UI v7 AvatarGroup component.
 *
 * AvatarGroup renders up to `max` avatars plus a surplus "+N" avatar when there
 * are more. This is a {@link ListComponentDriver} over the rendered avatars
 * (surplus included via `getItems`), with helpers to count the real avatars and
 * read the surplus label.
 * @see https://mui.com/material-ui/react-avatar/#grouped
 */
export class AvatarGroupDriver<ItemT extends AvatarDriver = AvatarDriver> extends ListComponentDriver<ItemT> {
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<AvatarGroupDriverOption<ItemT>> = {}) {
    // Merge defaults so the driver works as a bare scene part (see TabsDriver).
    super(locator, interactor, {
      ...defaultAvatarGroupDriverOption,
      ...option,
    } as AvatarGroupDriverOption<ItemT>);
  }

  /**
   * The number of real avatars shown, excluding the surplus "+N" indicator.
   */
  async getVisibleCount(): Promise<number> {
    let count = 0;
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), AvatarDriver)) {
      const text = (await item.getText())?.trim();
      if (text == null || !surplusPattern.test(text)) {
        count++;
      }
    }
    return count;
  }

  /**
   * The surplus indicator's label (e.g. "+3"), or `undefined` when every avatar
   * fits within `max` and no surplus is shown.
   */
  async getSurplusLabel(): Promise<Optional<string>> {
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), AvatarDriver)) {
      const text = (await item.getText())?.trim();
      if (text != null && surplusPattern.test(text)) {
        return text;
      }
    }
    return undefined;
  }

  override get driverName(): string {
    return 'MuiV5AvatarGroupDriver';
  }
}
