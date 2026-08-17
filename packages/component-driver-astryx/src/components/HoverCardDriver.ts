import { ComponentDriver, Optional } from '@atomic-testing/core';

import { resolveLinkedElementText } from '../internal/linkedLocators';

/**
 * Budget for the hover-intent delay plus the lazy mount's render, after which a
 * card that has not revealed is reported as having no content. Deliberately larger
 * than the overlay-transition budget the dialog drivers share: this waits on an
 * intent timer as well as a transition.
 */
const REVEAL_TIMEOUT_MS = 1000;

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
 * **{@link getContent} must open the card as of Astryx 0.4.2.** The layer used to
 * stay mounted while closed, so its content read in either state. 0.4.2 gave
 * `Layer` a `lazyMount` option and turned it on for HoverCard — closed content is
 * now a bare `<template>` marker with nothing inside, mounted when the card opens
 * and unmounted again on hide. The mount is driven by the component's own open
 * state rather than by the native Popover API, so it happens under jsdom too and
 * `getContent` stays faithful in both runners — but it is asynchronous (hover
 * intent, then a render), which is why the read probes rather than assumes. What
 * remains E2E-only is the same thing as before: the layer's actual **visibility**,
 * for which there is still no portable `isOpen`. Blocking dependency: Astryx
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
   * `aria-describedby` → layer `id` link.
   *
   * Hovers the trigger first, because the content only exists while the card is
   * open (see the class note on `lazyMount`), then probes until it appears —
   * mounting runs through the hover-intent delay and a React render, so reading
   * straight after the hover races them. `undefined` when the trigger has no
   * linked layer, or when the card has not revealed within
   * {@link REVEAL_TIMEOUT_MS}.
   */
  async getContent(): Promise<Optional<string>> {
    await this.open();
    return this.interactor.waitUntil({
      probeFn: () => resolveLinkedElementText(this.interactor, this.locator, 'aria-describedby'),
      terminateCondition: (content: Optional<string>) => content != null,
      timeoutMs: REVEAL_TIMEOUT_MS,
    });
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
