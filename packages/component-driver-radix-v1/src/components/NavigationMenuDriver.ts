import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Radix `NavigationMenu` root (`NavigationMenu.Root` from
 * `radix-ui`) — an ordinary IN-TREE `<nav>` element (no portal anywhere in
 * this primitive; open content mounts into the in-tree
 * `NavigationMenu.Viewport`).
 *
 * This driver covers root-level reads; each expandable item (trigger +
 * viewport-mounted content) is driven by `NavigationMenuItemDriver`, declared
 * as its own scene part anchored at that item's trigger — see its class doc
 * for why the re-parented content cannot be chained structurally. Plain
 * `NavigationMenu.Link` items are ordinary in-tree anchors; declare them as
 * plain scene parts.
 */
export class NavigationMenuDriver extends ComponentDriver<{}> {
  /** The menu's orientation (`data-orientation`), `horizontal` by default. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-orientation');
  }

  /** The root `<nav>`'s accessible name (`aria-label`, Radix defaults it to `Main`). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  get driverName(): string {
    return 'RadixV1NavigationMenuDriver';
  }
}
