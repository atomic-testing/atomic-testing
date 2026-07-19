import { byCssClass, Optional, type LocatorRelativePosition, type PartLocator } from '@atomic-testing/core';

import { NavDriverBase } from './NavDriverBase';

const navDrawerRootLocator: PartLocator = byCssClass('fui-NavDrawer', 'Root');
const defaultTransitionDuration = 1000;

/**
 * Driver for the Fluent v9 `NavDrawer` — the drawer-chromed sibling of plain
 * `Nav` (see {@link NavDriver} for the un-chromed list, and
 * {@link NavDriverBase} for the item-walk both share).
 *
 * **Portal re-root, and a correction to the umbrella issue's hypothesis**:
 * DOM audit (@fluentui/react-components@9.4.2) — `NavDrawer`'s root slot is
 * built on `Drawer` (from `@fluentui/react-drawer`) with `role="navigation"`
 * force-set on it; `Drawer` itself defaults to the PORTAL-BACKED
 * `OverlayDrawer` variant unless `type="inline"` is passed. So "Nav's
 * flyouts are overlay-backed" (the issue's framing) is true only of
 * `NavDrawer`'s OWN outer surface — NOT of `NavCategory` expansion inside
 * it, which is a same-tree animated accordion (see
 * {@link NavCategoryItemDriver}'s class doc for the DOM-audit proof). This
 * driver targets the default (portal-backed) variant only — `type="inline"`
 * switches the underlying element to a non-portal `InlineDrawer`, which this
 * re-root recipe does not resolve; a scene using `type="inline"` needs a
 * plain descendant locator instead (no static hooks), the same asymmetry
 * `OverlayDrawerDriver`/`InlineDrawerDriver` are split into two classes over.
 *
 * Re-roots on the un-hashed `fui-NavDrawer` class rather than the injected
 * `role="navigation"` — consistent with every other Wave 2 portal recipe in
 * this package (class over role), and doubly warranted here since a host
 * page's own `<nav>` landmark could otherwise collide with a bare role
 * selector.
 */
export class NavDrawerDriver extends NavDriverBase {
  static override overriddenParentLocator(): Optional<PartLocator> {
    return navDrawerRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /** Whether the drawer is mounted. Fluent mounts a drawer's surface only while open. */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the drawer to open (its surface to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the drawer to close (its surface to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Dismiss the drawer by pressing `Escape`, then wait for it to close.
   * **Escape dismisses the topmost stacked overlay, not necessarily THIS
   * one** — see `DialogDriver`'s equivalent caveat.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.exists()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'FluentV9NavDrawerDriver';
  }
}
