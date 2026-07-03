import { byRole, IContainerDriverOption, Interactor, PartLocator, ScenePart } from '@atomic-testing/core';

import { MenuContentDriverBase } from './MenuContentDriverBase';

const defaultTransitionDuration = 250;

/**
 * Driver for a Radix `ContextMenu` (`ContextMenu.Root`/`ContextMenu.Content`
 * from `radix-ui`), anchored at the TRIGGER — the only element that exposes
 * any per-instance state.
 *
 * **Why not `DropdownMenuDriver`'s static re-root or `PopoverDriver`'s
 * `aria-controls` link**: the rendered DOM (verified against `radix-ui@1.6.1`)
 * shows the trigger is a bare `<span data-state="open|closed">` with NO
 * `aria-controls`, `aria-haspopup` or id link to the portalled content, and
 * the only open gesture is a real `contextmenu` (right-click) event — there is
 * no click-to-toggle. So the driver is constructed from the scene's TRIGGER
 * locator, {@link open} fires the dedicated `contextMenu` interactor primitive
 * (Wave 0 verified it opens Radix's menu in both jsdom — `fireEvent.contextMenu`
 * — and Playwright — `click({button:'right'})`), {@link isOpen} reads the
 * trigger's always-present `data-state`, and the menu surface itself resolves
 * as the document-rooted `role="menu"`.
 *
 * **Single-open-menu scoping caveat**: `byRole('menu', 'Root')` is generic
 * rather than instance-linked, which is safe here because Radix menus are
 * modal — opening any menu dismisses other open menus/popovers, so at most one
 * `role="menu"` surface exists while this context menu is open. A consumer
 * composition that force-mounts a second menu (`forceMount`) is outside this
 * driver's contract; Astryx's `ContextMenuDriver` documents the same
 * single-instance limit for the same structural reason.
 */
export class ContextMenuDriver<ContentT extends ScenePart = {}> extends MenuContentDriverBase<ContentT> {
  private readonly triggerLocator: PartLocator;

  constructor(
    triggerLocator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, {}>>
  ) {
    super(byRole('menu', 'Root'), interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
    this.triggerLocator = triggerLocator;
  }

  /**
   * Whether the menu is open, read from the trigger's ALWAYS-present
   * `data-state` — the trigger is the only element that stays mounted (and
   * instance-scoped) in both states.
   */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.triggerLocator, 'data-state')) === 'open';
  }

  /** Open the menu by dispatching a right-click (`contextmenu`) on the trigger. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.contextMenu(this.triggerLocator);
    }
  }

  /**
   * Dismiss the menu by pressing `Escape` on the open menu surface, then wait
   * for it to close — the same `DismissableLayer` path the other Radix
   * overlays use. There is no toggle path: right-clicking the trigger again
   * would re-open, not close.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  /** Wait for the menu to open (its content to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the menu to close (its content to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'RadixV1ContextMenuDriver';
  }
}
