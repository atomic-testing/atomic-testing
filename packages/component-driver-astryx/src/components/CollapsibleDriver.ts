import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator, timingUtil } from '@atomic-testing/core';

/**
 * Driver for the Astryx Collapsible (`@astryxdesign/core/Collapsible`).
 *
 * Collapsible self-emits `data-testid` on its root and renders a trigger
 * `<button aria-expanded>` (label + chevron) followed by the content region.
 * Open/closed state is read from the trigger's `aria-expanded`; clicking it
 * toggles — mirrors the MUI `AccordionDriver`. (True content visibility is
 * CSS-driven and only observable in a real browser; jsdom keeps the content
 * mounted, so assert via `isExpanded`.) Since Astryx 0.1.8, a single item can be
 * disabled (`isDisabled`, works standalone and inside `CollapsibleGroup`); the
 * trigger keeps the native `disabled` attribute off (staying focusable and
 * perceivable to assistive tech per the system-wide disabled convention) and
 * marks it with `aria-disabled="true"` instead — the same convention `MenuItemDriver`
 * reads.
 */
export class CollapsibleDriver extends ComponentDriver<{}> {
  private get triggerLocator(): PartLocator {
    // The trigger is the disclosure `<button aria-expanded>`; match that, not any
    // `<button>`, so a button inside the collapsible content can't be mistaken
    // for the trigger (a multi-match would fail engine strict-mode resolution).
    return locatorUtil.append(this.locator, byCssSelector('button[aria-expanded]'));
  }

  /** Whether the content is expanded (`aria-expanded="true"` on the trigger). */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.triggerLocator, 'aria-expanded')) === 'true';
  }

  /** The trigger's visible text (the chevron carries no text). */
  async getTriggerText(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.triggerLocator)) ?? undefined;
  }

  /** Whether this item is disabled (`aria-disabled="true"` on the trigger). */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.triggerLocator, 'aria-disabled')) === 'true';
  }

  /**
   * Toggle the collapsible. No-ops on a disabled trigger rather than clicking
   * it regardless — same contract as `AccordionItemDriver.click` in
   * component-driver-fluent-v9, and for the same reason: under jsdom the click
   * is silently ignored, but `PlaywrightInteractor.click`'s actionability check
   * retries "is enabled" until its own timeout, which for a trigger that can
   * never become enabled is indistinguishable from a hang. Checking
   * {@link isDisabled} first keeps the no-op identical across every
   * `Interactor`.
   */
  override async click(): Promise<void> {
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.triggerLocator);
  }

  /** Expand the content if it is collapsed. No-ops on a disabled item, as {@link click} does. */
  async expand(): Promise<void> {
    await this.setExpanded(true);
  }

  /** Collapse the content if it is expanded. No-ops on a disabled item, as {@link click} does. */
  async collapse(): Promise<void> {
    await this.setExpanded(false);
  }

  private async setExpanded(expanded: boolean): Promise<void> {
    // A disabled trigger can never reach the requested state, so bail before the wait
    // below spins for its whole timeout — and before the click, since Playwright reads
    // `aria-disabled` as "not enabled" and would retry actionability until its own
    // timeout. Toggling through `click` keeps that rule in one place.
    if ((await this.isDisabled()) || (await this.isExpanded()) === expanded) {
      return;
    }
    await this.click();
    await timingUtil.waitUntil({
      probeFn: () => this.isExpanded(),
      terminateCondition: expanded,
      timeoutMs: 1000,
    });
  }

  get driverName(): string {
    return 'AstryxCollapsibleDriver';
  }
}
