import { ComponentDriver, Optional } from '@atomic-testing/core';

import { resolveLinkedElementText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx HoverCard (`@astryxdesign/core/HoverCard`).
 *
 * **Best-effort v1** — HoverCard is structurally hard to anchor: the floating
 * layer is a body-level `popover` with **no role, no testid, and no open-state
 * attribute**. The only stable link is the trigger's injected
 * `aria-describedby` → the layer's `id`, so the scene anchors on the trigger
 * (`data-testid`) and {@link getContent} re-roots to the layer through that link
 * (`'Root'`), mirroring how {@link PopoverDriver} follows `aria-controls`.
 *
 * The layer is always mounted in the DOM (jsdom does not implement the native
 * Popover API), so its content reads in both states; the **open/closed transition
 * is E2E-only** and there is no portable `isOpen`. Blocking dependency: Astryx
 * exposing a `role`/`data-testid`/open-state attribute on the layer (filed
 * upstream) — that would promote this driver from best-effort to first-class.
 */
export class HoverCardDriver extends ComponentDriver<{}> {
  /** The trigger's own text. */
  async getTriggerText(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /**
   * The hover-card layer's content text, resolved through the trigger's
   * `aria-describedby` → layer `id` link. `undefined` when the trigger has no
   * linked layer.
   */
  async getContent(): Promise<Optional<string>> {
    return resolveLinkedElementText(this.interactor, this.locator, 'aria-describedby');
  }

  /**
   * Hover the trigger to reveal the card. The reveal itself (native popover) is
   * only observable in a real browser; in jsdom this dispatches the hover but the
   * layer's visibility does not change.
   */
  async open(): Promise<void> {
    return this.hover();
  }

  get driverName(): string {
    return 'AstryxHoverCardDriver';
  }
}
