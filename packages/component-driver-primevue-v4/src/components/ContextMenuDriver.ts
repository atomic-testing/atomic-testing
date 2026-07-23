import {
  byCssSelector,
  byRole,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

import { MenuContentDriverBase } from './MenuContentDriverBase';

/**
 * `data-pc-name="contextmenu"` lives on the teleported root itself (unlike
 * `Menu`, where `role="menu"` sits on an inner `<ul>` one level down from that
 * root) — see the class doc's DOM audit.
 */
const contextMenuRootLocator: PartLocator = byCssSelector('[data-pc-name="contextmenu"]', 'Root');
// A ceiling, not a sleep — see MenuDriver's identical constant for the rationale.
const defaultTransitionDuration = 1000;

/**
 * Driver for the PrimeVue `ContextMenu` component, anchored at the TRIGGER —
 * the element the consumer wires a right-click handler onto — since the menu
 * surface itself doesn't exist in the DOM until opened (PrimeVue mounts it
 * only while visible, same as `Menu`'s popup mode).
 *
 * DOM audit (primevue@4.5.5): `ContextMenu` has no built-in trigger of its
 * own — the consumer wires `@contextmenu="cm.show($event)"` (or the `global`
 * prop) onto whatever region should open it — so unlike `Menu`'s
 * `data-pc-name="menu"` popup, there is no scene-declared `data-testid` on
 * the `ContextMenu` component to anchor a portal re-root through; the driver
 * is constructed from the TRIGGER locator instead, and {@link open} dispatches
 * the `contextMenu` interactor primitive there. The mounted surface then
 * resolves document-rooted on PrimeVue's own `data-pc-name="contextmenu"`
 * marker. The top-level item list carries `role="menubar"` (not `role="menu"`
 * — verified empirically; nested submenu lists get `role="menu"`, out of this
 * driver's v1 scope, see "Nested items" below), so {@link itemListLocator}
 * differs from `MenuDriver`'s.
 *
 * **Single-open-menu scoping caveat**: the surface locator is document-rooted
 * and generic (`[data-pc-name="contextmenu"]`) rather than instance-linked —
 * safe only while at most one `ContextMenu` is mounted at a time. PrimeVue
 * unmounts a closed `ContextMenu`, but separate `ContextMenu` instances don't
 * coordinate with each other (opening one doesn't close another that's
 * already open — verified empirically: an instance's outside-dismiss listener
 * only binds a `click` handler, which a `contextmenu` event never fires), so
 * a scene with two instances CAN end up with two surfaces mounted at once if
 * a caller opens the second without first closing the first. In that state,
 * item reads resolve against whichever surface the underlying `querySelector`
 * / `page.locator()` matches first, not necessarily the intended instance —
 * so close one `ContextMenuDriver` before opening another when a scene
 * renders more than one (mirrors `component-driver-radix-v1`'s
 * `ContextMenuDriver`, which documents the same limit for the same
 * structural reason).
 *
 * **Nested items** (a `model` entry with its own `items`, rendered as a
 * `role="menu"` submenu on hover): out of scope for this driver — item reads
 * cover the top-level `role="menubar"` list only, the same one-level scope
 * `MenuDriver` has for `Menu` (which has no nested items at all). Deeper
 * submenu traversal is `TieredMenu` territory per #1036's scope note.
 */
export class ContextMenuDriver extends MenuContentDriverBase {
  private readonly triggerLocator: PartLocator;

  constructor(triggerLocator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<{}>>) {
    super(contextMenuRootLocator, interactor, option);
    this.triggerLocator = triggerLocator;
  }

  protected get itemListLocator(): PartLocator {
    return locatorUtil.append(this.locator, byRole('menubar'));
  }

  /** Whether the menu is open — PrimeVue mounts it only while open. */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /**
   * Open the menu by dispatching a right-click (`contextmenu`) on the
   * trigger — unconditionally, never guarded by {@link isOpen}. `isOpen`
   * reads the document-rooted, non-instance-scoped surface locator (see the
   * class doc), so it can't tell "this instance is open" from "some other
   * `ContextMenuDriver`'s menu is open"; guarding on it would silently no-op
   * a second instance's `open()` while a first instance's menu is still
   * showing. PrimeVue's own `show()` handles a redundant call safely
   * (repositions rather than re-opening), so dispatching every time is safe
   * for the same-instance case too.
   */
  async open(): Promise<void> {
    await this.interactor.contextMenu(this.triggerLocator);
  }

  /**
   * Dismiss the menu by pressing `Escape` on the open item list, then wait for
   * it to close. There is no toggle path: right-clicking the trigger again
   * while open only repositions the menu, it doesn't close it.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.itemListLocator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  /** Wait for the menu to open (mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the menu to close (unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'PrimeVueV4ContextMenuDriver';
  }
}
