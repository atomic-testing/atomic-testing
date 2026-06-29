import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator, timingUtil } from '@atomic-testing/core';

/**
 * Driver for the Astryx Collapsible (`@astryxdesign/core/Collapsible`).
 *
 * Collapsible self-emits `data-testid` on its root and renders a trigger
 * `<button aria-expanded>` (label + chevron) followed by the content region.
 * Open/closed state is read from the trigger's `aria-expanded`; clicking it
 * toggles — mirrors the MUI `AccordionDriver`. (True content visibility is
 * CSS-driven and only observable in a real browser; jsdom keeps the content
 * mounted, so assert via `isExpanded`.)
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

  /** Toggle the collapsible. */
  override async click(): Promise<void> {
    await this.interactor.click(this.triggerLocator);
  }

  /** Expand the content if it is collapsed. */
  async expand(): Promise<void> {
    await this.setExpanded(true);
  }

  /** Collapse the content if it is expanded. */
  async collapse(): Promise<void> {
    await this.setExpanded(false);
  }

  private async setExpanded(expanded: boolean): Promise<void> {
    if ((await this.isExpanded()) === expanded) {
      return;
    }
    await this.interactor.click(this.triggerLocator);
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
