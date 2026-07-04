import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator, timingUtil } from '@atomic-testing/core';

/**
 * Driver for the Radix Collapsible primitive (`Collapsible.Root` from `radix-ui`).
 *
 * The trigger is `<button aria-expanded data-state="open"/"closed">`, matched
 * specifically (not any `<button>`) so a button inside the collapsible content
 * is never mistaken for the trigger — a multi-match would fail engine
 * strict-mode resolution. This mirrors the Astryx `CollapsibleDriver` shape,
 * which targets the same non-portal, in-tree DOM. The content wrapper stays in
 * the DOM (`hidden` toggled) but its children are lazily mounted only while
 * expanded (empty while closed, like `Tabs.Content`), so `isExpanded` — which
 * reads the trigger's `aria-expanded`, not the content — is faithful under
 * jsdom regardless; true visibility is CSS/layout and therefore E2E-only.
 * @see https://www.radix-ui.com/primitives/docs/components/collapsible
 */
export class CollapsibleDriver extends ComponentDriver<{}> {
  private get triggerLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-expanded]'));
  }

  /** Whether the content is expanded (`aria-expanded="true"` on the trigger). */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.triggerLocator, 'aria-expanded')) === 'true';
  }

  /** The trigger's visible text. */
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
    return 'RadixV1CollapsibleDriver';
  }
}
