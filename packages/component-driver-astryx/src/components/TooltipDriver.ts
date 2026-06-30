import { ComponentDriver, Optional } from '@atomic-testing/core';

import { resolveLinkedElementText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx Tooltip (`@astryxdesign/core/Tooltip`).
 *
 * **Best-effort v1** — the same structural constraint as {@link HoverCardDriver}:
 * the tooltip layer is a body-level `popover` with **no role at all, no testid,
 * and no open-state attribute**; the only stable link is the trigger's injected
 * `aria-describedby` → the layer's `id`. The scene anchors on the trigger
 * (`data-testid`); {@link getContent} re-roots to the layer through that link
 * (`'Root'`). (The layer additionally carries an `astryx-tooltip` class, but the
 * `aria-describedby` link is preferred — it is instance-safe.)
 *
 * The layer is always mounted (jsdom has no native Popover API), so its text reads
 * in both states; the **open/closed transition is E2E-only** and there is no
 * portable `isOpen`. Blocking dependency: an upstream `role="tooltip"`/open-state
 * attribute on the layer (filed upstream).
 */
export class TooltipDriver extends ComponentDriver<{}> {
  /** The trigger's own text. */
  async getTriggerText(): Promise<Optional<string>> {
    return (await this.getText()) ?? undefined;
  }

  /**
   * The tooltip text, resolved through the trigger's `aria-describedby` → layer
   * `id` link. `undefined` when the trigger has no linked layer.
   */
  async getContent(): Promise<Optional<string>> {
    return resolveLinkedElementText(this.interactor, this.locator, 'aria-describedby');
  }

  /**
   * Hover the trigger to reveal the tooltip. The reveal (native popover) is only
   * observable in a real browser; in jsdom the hover dispatches but visibility is
   * unchanged.
   */
  async open(): Promise<void> {
    return this.hover();
  }

  get driverName(): string {
    return 'AstryxTooltipDriver';
  }
}
