import {
  byRole,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuContentDriverBase } from './MenuContentDriverBase';

const menuRootLocator: PartLocator = byRole('menu', 'Root');

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
 * Extends `MenuContentDriverBase` (a `ContainerDriver`, not a plain
 * `ComponentDriver`, unlike `component-driver-mui-v7`'s `MenuDriver`) because
 * Radix menus commonly mix plain items with richer content —
 * `DropdownMenu.CheckboxItem`, `DropdownMenu.RadioGroup`, submenus — so callers
 * can declare a custom `content` scene the same way `DialogDriver`/
 * `PopoverDriver` do. The item operations shared with `ContextMenuDriver`/
 * `MenubarMenuDriver` (and the `childListHelper` separator rationale) live on
 * the base.
 */
export class DropdownMenuDriver<ContentT extends ScenePart = {}> extends MenuContentDriverBase<ContentT> {
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

  get driverName(): string {
    return 'RadixV1DropdownMenuDriver';
  }
}
