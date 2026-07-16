import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const drawerParts = {
  headerTitle: {
    locator: byCssClass('fui-DrawerHeaderTitle'),
    driver: HTMLElementDriver,
  },
  body: {
    locator: byCssClass('fui-DrawerBody'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const defaultTransitionDuration = 1000;

/**
 * Shared base for the Fluent v9 `Drawer` family — `OverlayDrawer` (portalled)
 * and `InlineDrawer` (in-tree) — which render identical `fui-DrawerHeader`/
 * `fui-DrawerHeaderTitle`/`fui-DrawerBody` interior structure (DOM audit,
 * `@fluentui/react-components@9.74.3`) and differ only in WHERE their root
 * mounts. Each subclass supplies its own root locator strategy (portal re-root
 * vs. plain in-tree); this base owns the interior reads and the open/close
 * lifecycle common to both.
 *
 * Deliberately two subclasses rather than one driver with a runtime branch:
 * the portal re-root hooks (`overriddenParentLocator`/
 * `overrideLocatorRelativePosition`) are **static** class metadata read before
 * any instance exists (see `ComponentDriver`), so which recipe applies must be
 * a compile-time class choice, not an instance-time one.
 */
export abstract class DrawerDriverBase<ContentT extends ScenePart> extends ContainerDriver<
  ContentT,
  typeof drawerParts
> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: drawerParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  /** The drawer header's title text, or `null` when `DrawerHeaderTitle` is absent. */
  async getHeaderTitle(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.headerTitle.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.headerTitle.getText()) ?? null;
  }

  /** The drawer body's text content, or `null` when `DrawerBody` is absent. */
  async getBodyText(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.body.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.body.getText()) ?? null;
  }

  /** Whether the drawer is mounted. Fluent mounts a drawer's root only while open. */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the drawer to open (its root to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the drawer to close (its root to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }
}
