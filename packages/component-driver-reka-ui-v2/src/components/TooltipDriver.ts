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
 * Driver for a Reka UI `Tooltip` (`TooltipRoot`/`TooltipContent` from
 * `reka-ui`), anchored at the TRIGGER, like `component-driver-radix-v1`'s
 * `TooltipDriver` — not at the portalled content via static re-root hooks.
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `TooltipDriver` — the trigger is a plain
 * `<button data-state="closed"/"delayed-open"/"instant-open">` (`data-state`
 * is ALWAYS present, unlike `aria-describedby` below), and the portalled
 * `TooltipContent` outer element (`<div data-dismissable-layer
 * data-state="...">`) is ROLE-LESS — the `role="tooltip"` element is a
 * visually-hidden inner `<span>` Reka appends for screen readers, duplicating
 * the visible text. While open, Reka adds `aria-describedby` on the trigger
 * pointing at that hidden span's `id` — followed at call time with
 * `byLinkedElement`. One cosmetic-only delta noted: Reka also stamps
 * `data-grace-area-trigger=""` on the trigger (no such attribute in Radix's
 * output); it plays no role in this driver's logic.
 *
 * **jsdom vs E2E split**: opening via {@link open} (a hover) works under jsdom
 * because `DOMInteractor.hover` fires the full `userEvent.hover` pointer
 * sequence — including the `pointermove` Reka's `TooltipTrigger` listens for
 * (verified: hovering with the scene's `TooltipProvider` at `delayDuration={0}`
 * flips the trigger to `data-state="delayed-open"` synchronously observable
 * after `await hover()`) — but only the open TRANSITION driven by delays is
 * timing-faithful in a real browser. Keep example scenes at `delayDuration={0}`
 * for deterministic jsdom probes; treat delay-behavior assertions as E2E-only.
 * Closing by pointer-leave is ALSO E2E-only: Reka's `TooltipTrigger` only
 * closes on `pointerleave` when `disableHoverableContent` is set (otherwise it
 * merely cancels a pending open-delay timer, matching Radix's identical
 * hoverable-content behavior) and jsdom's `mouseOut`/`mouseLeave` fire mouse
 * events but not the `pointerleave` Reka listens for either way — {@link dismiss}
 * (Escape through `DismissableLayer`, confirmed closing the tooltip in the
 * audit) is the portable close path.
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

  async isOpen(): Promise<boolean> {
    const state = await this.interactor.getAttribute(this.locator, 'data-state');
    return state != null && state !== 'closed';
  }

  async getState(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-state');
  }

  async getContent(): Promise<Optional<string>> {
    try {
      return (await this.interactor.getText(this.contentLocator)) ?? undefined;
    } catch {
      return undefined;
    }
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.hover();
    }
  }

  async dismiss(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'RekaUiV2TooltipDriver';
  }
}
