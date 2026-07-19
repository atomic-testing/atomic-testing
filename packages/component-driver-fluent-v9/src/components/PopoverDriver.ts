import {
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

const popoverSurfaceRootLocator: PartLocator = byCssClass('fui-PopoverSurface', 'Root');
const defaultTransitionDuration = 1000;

/**
 * Driver for the Fluent v9 `Popover` (`PopoverTrigger` + `PopoverSurface`).
 *
 * **Portal re-root**: `PopoverSurface` mounts into the same cloned
 * `FluentProvider`-on-`document.body` every Fluent overlay uses (see
 * `DialogDriver`'s class doc for the shared mechanism), rendering `role="group"`
 * — DOM audit, `@fluentui/react-components@9.74.3`. `role="group"` is far too
 * generic a role to re-root on alone (it collides with plain layout groupings
 * elsewhere on a page), so this driver re-roots on the un-hashed
 * `fui-PopoverSurface` structural class instead, per Wave 1's documented
 * tier-2 fallback. The scene's own locator (forwarded onto `PopoverSurface`,
 * e.g. `<PopoverSurface data-testid="...">`) compounds onto that SAME element
 * (`'Same'` position).
 *
 * **`fui-PopoverSurface` is also carried by `TeachingPopoverSurface`**
 * (`TeachingPopover` reuses `Popover`'s surface under the hood — confirmed by
 * DOM audit: it renders `class="fui-PopoverSurface fui-TeachingPopoverSurface"`).
 * That does not break instance disambiguation (the compound still requires the
 * scene's own, per-instance test id to match), but a `PopoverDriver` pointed at
 * a `TeachingPopover` only sees `Popover`-level capabilities — use
 * {@link TeachingPopoverDriver} for that component specifically.
 *
 * Fluent unmounts `PopoverSurface` while closed (no `unmountOnExit` opt-out
 * used here), so simple existence doubles as the open signal — no separate
 * visibility check needed, unlike MUI's always-mounted-during-transition Dialog.
 */
export class PopoverDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption<ContentT, {}>>) {
    super(locator, interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return popoverSurfaceRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /** Whether the popover's surface is mounted. */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the popover to open (its surface to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the popover to close (its surface to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Dismiss the popover by pressing `Escape`, then wait for it to close.
   * Whether it actually closes depends on the consumer honoring the dismissal;
   * the returned boolean reflects the observed close, not merely the key press.
   *
   * **Escape dismisses the topmost stacked overlay, not necessarily THIS
   * one**: verified against real Chromium — with two simultaneously open
   * popovers, `Escape` closes only the most-recently-opened one, regardless of
   * which popover's locator the key event is dispatched on (Fluent's dismiss
   * handling is a global, stack-ordered listener, not per-element). Call this
   * on the LAST-opened instance when driving a stacked scenario.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.exists()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'FluentV9PopoverDriver';
  }
}
