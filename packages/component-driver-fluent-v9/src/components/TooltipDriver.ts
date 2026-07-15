import {
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { tooltipContentLocator } from '../internal/tooltipLocators';

const globalTooltipLocator: PartLocator = byRole('tooltip', 'Root');
const defaultRevealTimeout = 1000;

/**
 * Driver for the Fluent v9 `Tooltip`, anchored at its TRIGGER child (not the
 * portalled content) — DOM audit, `@fluentui/react-components@9.74.3`.
 *
 * **Content mounts unconditionally, visibility is what toggles**: verified
 * against rendered DOM — a wrapped trigger's tooltip content (`role="tooltip"`)
 * is present in the portal from the FIRST render, in both `relationship`
 * modes, not just while shown. `relationship="description"` likewise sets
 * `aria-describedby` on the trigger from mount, not only once opened. So
 * {@link isOpen} checks VISIBILITY (not mere existence) of that content — the
 * same two-step "exists, then check visible" recipe
 * `component-driver-mui-v9`'s `TooltipDriver` uses — and {@link getContent}
 * (see below) is readable regardless of open state, matching this always-mounted
 * reality.
 *
 * **Two `relationship` modes, two content-reading paths**: the default
 * `relationship="label"` sets `aria-label` directly on the trigger — the
 * accessible name IS the tooltip text, so {@link getContent} reads it straight
 * off the trigger, no portal probe needed at all. `relationship="description"`
 * instead links `aria-describedby` on the trigger to the portalled content's
 * `id` — followed via `byLinkedElement` (see `../internal/tooltipLocators.ts`),
 * the same technique `component-driver-radix-v1`'s `TooltipDriver` uses for its
 * own `aria-describedby` link (that one IS conditional on open state; Fluent's
 * is not — see above).
 *
 * **No per-trigger open signal**: unlike Radix (`data-state` always present on
 * the trigger), Fluent's tooltip trigger carries no open/closed attribute at
 * all — verified against rendered DOM. {@link isOpen} therefore prefers the
 * `aria-describedby` link when present (an exact, per-instance target — only
 * set in `"description"` relationship) and falls back to the shared
 * `role="tooltip"` portal otherwise — the same "one portal, no per-trigger
 * link" caveat `component-driver-mui-v9`'s `TooltipDriver` documents for its
 * own default mode.
 *
 * **The `"label"`-relationship fallback is best-effort with multiple
 * tooltips on the page**: verified against real Chromium — with two
 * Tooltip-wrapped triggers mounted, their portalled `role="tooltip"` contents
 * do NOT land in the DOM in trigger-declaration order (Fluent's portal
 * reorders on interaction), so `isOpen`'s "first matching `role="tooltip"`"
 * fallback can resolve to the WRONG trigger's content. This affects only
 * {@link isOpen}/{@link open}/{@link dismiss}/{@link waitForOpen}/
 * {@link waitForClose} for `"label"`-relationship tooltips when more than one
 * Tooltip is mounted; {@link getContent} is unaffected (it reads the
 * trigger's own `aria-label` directly, never touching the shared portal).
 * `"description"`-relationship tooltips do not have this problem — their
 * `aria-describedby` link always resolves the exact instance.
 *

 * **jsdom vs real browsers**: opening via hover does not reveal Fluent's
 * tooltip under jsdom (verified — `fireEvent.mouseover`/`mouseOut` do not
 * trigger it), but focusing the trigger does, and focus is also the
 * accessible/keyboard path a real user relies on — so {@link open} focuses the
 * trigger rather than hovering it, portable across jsdom and Playwright alike.
 * Hover-triggered reveal remains genuine real-browser behavior worth asserting
 * E2E-only, the same gating the `docs/docs/guides/portal-and-overlays.md`
 * guide already prescribes for other environment-limited overlay behavior.
 */
export class TooltipDriver extends ComponentDriver<{}> {
  private readonly contentLocator: PartLocator;

  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<{}>>) {
    super(locator, interactor, option);
    this.contentLocator = tooltipContentLocator(locator);
  }

  /**
   * The tooltip's accessible text: the trigger's `aria-label` in the default
   * `"label"` relationship, or the linked portalled content's text in
   * `"description"` relationship. Available regardless of visual open state
   * (see the class doc) — `undefined` only when the trigger has no tooltip at
   * all.
   */
  async getContent(): Promise<Optional<string>> {
    const label = await this.interactor.getAttribute(this.locator, 'aria-label');
    if (label) {
      return label;
    }
    try {
      return (await this.interactor.getText(this.contentLocator)) ?? undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Whether the tooltip is visually shown. Prefers the `aria-describedby`
   * link's target (exact, per-instance — only set in `"description"`
   * relationship); falls back to the shared portal otherwise (see the class
   * doc's caveat). Checks visibility, not mere existence, since the content is
   * mounted from render regardless of open state.
   */
  async isOpen(): Promise<boolean> {
    try {
      if (!(await this.interactor.exists(this.contentLocator))) {
        return false;
      }
      return this.interactor.isVisible(this.contentLocator);
    } catch {
      if (!(await this.interactor.exists(globalTooltipLocator))) {
        return false;
      }
      return this.interactor.isVisible(globalTooltipLocator);
    }
  }

  /** Reveal the tooltip by focusing its trigger, waiting until it is shown. */
  async open(timeoutMs: number = defaultRevealTimeout): Promise<void> {
    await this.focus();
    await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
  }

  /** Dismiss the tooltip by blurring its trigger, then wait for it to close. */
  async dismiss(timeoutMs: number = defaultRevealTimeout): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.blur(this.locator);
    }
    return this.waitForClose(timeoutMs);
  }

  /** Wait for the tooltip to open. */
  async waitForOpen(timeoutMs: number = defaultRevealTimeout): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the tooltip to close. */
  async waitForClose(timeoutMs: number = defaultRevealTimeout): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'FluentV9TooltipDriver';
  }
}
