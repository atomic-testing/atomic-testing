import {
  byLinkedElement,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

const defaultTransitionDuration = 250;

/**
 * Driver for a Radix `Tooltip` (`Tooltip.Root`/`Tooltip.Content` from
 * `radix-ui`), anchored at the TRIGGER, like `PopoverDriver` — not at the
 * portalled content via the static re-root hooks `DialogDriver` uses.
 *
 * **Why trigger-anchored**: the portalled `Tooltip.Content` outer `<div>` is
 * ROLE-LESS (verified against rendered `radix-ui@1.6.1` DOM — the
 * `role="tooltip"` element is a visually-hidden inner `<span>` Radix appends
 * for screen readers), so there is no generic role to statically re-root at,
 * and the static hooks carry no per-instance data anyway. The trigger, an
 * ordinary in-tree element, carries the full state contract instead:
 * `data-state` (`closed`/`delayed-open`/`instant-open`) is ALWAYS present, and
 * while open Radix adds `aria-describedby` pointing at the hidden
 * `role="tooltip"` span — followed at call time with `byLinkedElement`, the
 * same technique `PopoverDriver` uses for `aria-controls`.
 *
 * **jsdom vs E2E split**: opening via {@link open} (a hover) works under jsdom
 * because `DOMInteractor.hover` fires the full `userEvent.hover` pointer
 * sequence Radix's trigger listens to — but only the open TRANSITION driven by
 * delays is timing-faithful in a real browser. Keep example scenes at
 * `delayDuration={0}` for deterministic jsdom probes, and treat
 * delay-behaviour assertions (default 700ms open delay, skip-delay grace
 * window) as E2E-only. Closing by pointer-leave is ALSO E2E-only: jsdom's
 * `mouseOut`/`mouseLeave` fire mouse events but not the `pointerleave` Radix
 * listens for — {@link dismiss} (Escape through `DismissableLayer`) is the
 * portable close path.
 */
export class TooltipDriver extends ComponentDriver<{}> {
  private readonly contentLocator: PartLocator;

  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<{}>>) {
    super(locator, interactor, option);
    this.contentLocator = byLinkedElement('Root')
      .onLinkedElement(locator)
      .extractAttribute('aria-describedby')
      .toMatchMyAttribute('id');
  }

  /**
   * Whether the tooltip is open. Read from the trigger's ALWAYS-present
   * `data-state` (`delayed-open`/`instant-open` while open, `closed`
   * otherwise) — cheaper and throw-free compared to probing the portalled
   * content, which only mounts while open.
   */
  async isOpen(): Promise<boolean> {
    const state = await this.interactor.getAttribute(this.locator, 'data-state');
    return state != null && state !== 'closed';
  }

  /** The trigger's `data-state`: `closed`, `delayed-open` or `instant-open`. */
  async getState(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-state');
  }

  /**
   * The tooltip's accessible text, resolved through the trigger's
   * `aria-describedby` → the hidden `role="tooltip"` span. `undefined` while
   * closed — the link only exists while open, and the unresolvable
   * `LinkedCssLocator` throw (the `byLinkedElement`-wide gap noted on
   * `PopoverDriver`) is translated here rather than surfaced.
   */
  async getContent(): Promise<Optional<string>> {
    try {
      return (await this.interactor.getText(this.contentLocator)) ?? undefined;
    } catch {
      return undefined;
    }
  }

  /** Open the tooltip by hovering its trigger (also opens on keyboard focus in real browsers). */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.hover();
    }
  }

  /**
   * Dismiss the tooltip by pressing `Escape` on the trigger, then wait for it
   * to close. Radix's `DismissableLayer` handles `Escape` while open — the
   * portable close path, since pointer-leave closing is E2E-only (see the
   * class doc).
   */
  async dismiss(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  /** Wait for the tooltip to open. With Radix's default 700ms open delay, pass a larger `timeoutMs`. */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the tooltip to close. */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'RadixV1TooltipDriver';
  }
}
