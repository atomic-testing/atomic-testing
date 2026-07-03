import { byLinkedElement, IContainerDriverOption, Interactor, PartLocator, ScenePart } from '@atomic-testing/core';

import { MenuContentDriverBase } from './MenuContentDriverBase';

const defaultTransitionDuration = 250;

/**
 * Driver for one `Menubar.Menu` (trigger + portalled content) of a Radix
 * `Menubar`, anchored at the TRIGGER — the same trigger-anchored pattern as
 * `PopoverDriver`, for the same disambiguation reason.
 *
 * **Why not the static `role="menu"` re-root `DropdownMenuDriver` uses**: a
 * menubar hosts SEVERAL menus whose contents all render `role="menu"`; the
 * static hooks carry no per-instance data to tell "the File menu" from "the
 * Edit menu". The trigger (`<button role="menuitem">`, an ordinary in-tree
 * child of the `role="menubar"` bar — verified against rendered
 * `radix-ui@1.6.1` DOM) carries the per-instance contract: `data-state` and
 * `aria-expanded` are always present, and `aria-controls` appears while open,
 * pointing at the portalled `role="menu"` content — followed at call time via
 * `byLinkedElement`, re-read fresh on every interaction.
 *
 * **Consequence, same as `PopoverDriver`**: while closed the `aria-controls`
 * link is absent, so the underlying content locator cannot resolve —
 * `exists()` translates that unresolvable-link throw (the `byLinkedElement`-
 * wide gap noted on `PopoverDriver`) into `false`. {@link isOpen} avoids the
 * link entirely by reading the trigger's `data-state`. Item operations
 * (`getMenuItemByLabel`, `selectByLabel`, …) come from `MenuContentDriverBase`
 * and are only meaningful while open.
 */
export class MenubarMenuDriver<ContentT extends ScenePart = {}> extends MenuContentDriverBase<ContentT> {
  private readonly triggerLocator: PartLocator;

  constructor(
    triggerLocator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, {}>>
  ) {
    const contentLocator: PartLocator = byLinkedElement('Root')
      .onLinkedElement(triggerLocator)
      .extractAttribute('aria-controls')
      .toMatchMyAttribute('id');
    super(contentLocator, interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
    this.triggerLocator = triggerLocator;
  }

  /** See the class doc: unresolvable `aria-controls` (menu closed) reads as "not attached". */
  override async exists(): Promise<boolean> {
    try {
      return await super.exists();
    } catch {
      return false;
    }
  }

  /** Whether this menu is open, read from the trigger's always-present `data-state`. */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.triggerLocator, 'data-state')) === 'open';
  }

  /** The trigger's visible label (e.g. `File`). */
  async getTriggerLabel(): Promise<string | null> {
    return (await this.interactor.getText(this.triggerLocator))?.trim() ?? null;
  }

  /** Open this menu by clicking its trigger, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Close this menu by clicking its trigger (Radix menubar triggers toggle), if open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Wait for this menu to open (its content to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for this menu to close (its content to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'RadixV1MenubarMenuDriver';
  }
}
