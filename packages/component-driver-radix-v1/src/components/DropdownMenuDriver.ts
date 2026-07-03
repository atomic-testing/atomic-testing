import {
  byRole,
  childListHelper,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuItemNotFoundError } from '../errors/MenuItemNotFoundError';
import { MenuItemDriver } from './MenuItemDriver';

const menuRootLocator: PartLocator = byRole('menu', 'Root');

/** CSS for a Radix menu item — the ARIA role, never a Tailwind/shadcn class. */
const menuItemSelector = '[role="menuitem"]';

/**
 * Driver for a Radix `DropdownMenu` (`DropdownMenu.Root`/`DropdownMenu.Content`
 * from `radix-ui`).
 *
 * **Portal re-root**: `DropdownMenu.Content` renders `role="menu"` inside a
 * `div[data-radix-popper-content-wrapper]`, itself a direct child of
 * `document.body` (see `agent-docs/modules/component-driver-radix.md`). The
 * static portal hooks re-root this driver at the document root exactly like
 * `DialogDriver`; the scene's declared locator (e.g. a `data-testid` forwarded
 * onto `DropdownMenu.Content`) compounds onto the SAME `[role="menu"]` element.
 *
 * Extends `ContainerDriver` (not a plain `ComponentDriver`, unlike
 * `component-driver-mui-v7`'s `MenuDriver`) because Radix menus commonly mix
 * plain items with richer content — `DropdownMenu.CheckboxItem`,
 * `DropdownMenu.RadioGroup`, submenus — so callers can declare a custom
 * `content` scene the same way `DialogDriver`/`PopoverDriver` do.
 *
 * **Item iteration uses `childListHelper`, not `listHelper`**: a plain
 * `:nth-of-type` walk (what `component-driver-mui-v7`'s `MenuDriver` uses) counts
 * positions among same-tag siblings, but Radix renders `DropdownMenu.Separator`
 * as a plain `<div>` — the same tag as `DropdownMenu.Item` — interspersed
 * between items. `:nth-of-type(3)` would then require the 3rd `<div>` to BOTH be
 * at that tag-position AND carry `role="menuitem"`, which fails the moment a
 * separator occupies an earlier position, silently truncating the item list
 * (see the CLAUDE.md stale-`childListHelper` trap this exact failure mode
 * describes). `childListHelper`'s `:nth-child` walk instead checks each child
 * position against `menuItemSelector`, correctly skipping non-matching
 * siblings without losing count.
 */
export class DropdownMenuDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption<ContentT, {}>>) {
    super(locator, interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return menuRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /**
   * Whether the menu is open. Radix mounts `DropdownMenu.Content` only while
   * open (`forceMount` off by default), so existence is the open signal.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** The item whose visible label matches `label`, or `null` when absent. */
  async getMenuItemByLabel(label: string): Promise<MenuItemDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemSelector,
      MenuItemDriver
    )) {
      const itemLabel = await item.getLabel();
      if (itemLabel === label) {
        return item;
      }
    }
    return null;
  }

  /** Click the item whose visible label matches `label`. @throws {MenuItemNotFoundError} when absent. */
  async selectByLabel(label: string): Promise<void> {
    const item = await this.getMenuItemByLabel(label);
    if (item) {
      await item.click();
    } else {
      throw new MenuItemNotFoundError(label, this);
    }
  }

  /** The number of items (`role="menuitem"`) in the open menu. */
  async getMenuItemCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, menuItemSelector);
  }

  /** The item at the given zero-based index, or `null` if out of range. */
  async getMenuItemByIndex(index: number): Promise<MenuItemDriver | null> {
    let position = 0;
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      menuItemSelector,
      MenuItemDriver
    )) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }

  get driverName(): string {
    return 'RadixV1DropdownMenuDriver';
  }
}
