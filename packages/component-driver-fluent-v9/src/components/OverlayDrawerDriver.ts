import { byCssClass, type LocatorRelativePosition, Optional, PartLocator, ScenePart } from '@atomic-testing/core';

import { DrawerDriverBase } from './DrawerDriverBase';

const overlayDrawerRootLocator: PartLocator = byCssClass('fui-OverlayDrawer', 'Root');
const defaultTransitionDuration = 1000;

/**
 * Driver for the Fluent v9 `OverlayDrawer` — the portal-rendered `Drawer`
 * variant (see `InlineDrawerDriver` for the in-tree sibling).
 *
 * **Portal re-root**: `OverlayDrawer` mounts into the same cloned
 * `FluentProvider`-on-`document.body` every Fluent overlay uses, rendering
 * `role="dialog" aria-modal="true"` — it reuses `Dialog`'s own modal/tabster
 * machinery (DOM audit, `@fluentui/react-components@9.74.3`). That role is
 * therefore shared with `Dialog` and `TeachingPopover` too, so — the same
 * reasoning as `DialogDriver` — this driver re-roots on the un-hashed
 * `fui-OverlayDrawer` structural class rather than the role, compounding the
 * scene's own locator (forwarded onto `OverlayDrawer`) at `'Same'` position.
 *
 * **`defaultOpen` does not work** — verified against rendered DOM: Fluent's own
 * type/behavior marks it deprecated and non-functional; `OverlayDrawer` "can
 * work only as a controlled component" via the `open` prop. Example scenes
 * must drive it with `open`/`onOpenChange`, never `defaultOpen`.
 *
 * **No portable `closeByBackdropClick`**: `fui-OverlayDrawer__backdrop` is a
 * separate `document.body` sibling of the drawer root (not its descendant),
 * with no id/data-* link back to a specific drawer instance — the same wall
 * `DialogDriver` hits, and for the same reason. Only {@link closeByEscape} is
 * offered as a portable dismissal path.
 */
export class OverlayDrawerDriver<ContentT extends ScenePart> extends DrawerDriverBase<ContentT> {
  static override overriddenParentLocator(): Optional<PartLocator> {
    return overlayDrawerRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /**
   * Dismiss the drawer by pressing `Escape`, then wait for it to close.
   * Whether it actually closes depends on the consumer honoring `onOpenChange`;
   * the returned boolean reflects the observed close, not merely the key press.
   *
   * **Escape dismisses the topmost stacked overlay, not necessarily THIS
   * one**: verified against real Chromium (see `DialogDriver`'s equivalent
   * caveat) — with more than one dismissable overlay open, `Escape` closes
   * only the most-recently-opened one, regardless of which overlay's locator
   * the key event is dispatched on.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.exists()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'FluentV9OverlayDrawerDriver';
  }
}
