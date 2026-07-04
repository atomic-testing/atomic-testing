import {
  byCssSelector,
  byRole,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
  timingUtil,
} from '@atomic-testing/core';

const triggerLocator = byCssSelector('button[aria-expanded]');
const contentLocator = byRole('region');

/**
 * Driver for a single Radix Accordion item (`Accordion.Item` from `radix-ui`).
 *
 * Models one item — templated off `component-driver-mui-v7`'s `AccordionDriver`
 * per the issue's own "Accordion -> AccordionDriver" guidance — rather than the
 * whole `Accordion.Root` list: `type="single"` vs. `type="multiple"` selection
 * across items is exercised by driving each item's own trigger, so one driver
 * shape covers both accordion variants without needing to model cross-item
 * exclusivity itself.
 *
 * The item's own `<div data-state data-disabled>` mirrors the trigger's state,
 * but the driver reads directly off the trigger/content to avoid depending on
 * which element the scene's locator happens to anchor (item root vs. trigger).
 * Content is `role="region"` with `hidden` present only while collapsed; the
 * wrapper stays mounted but its children are lazily rendered only while
 * expanded (empty while collapsed, matching `CollapsibleDriver`/`Tabs.Content`),
 * so `getContentText` is only meaningful for an expanded item — true
 * visibility itself is E2E-only.
 * @see https://www.radix-ui.com/primitives/docs/components/accordion
 */
export class AccordionDriver extends ComponentDriver<{}> {
  private get triggerLocator(): PartLocator {
    return locatorUtil.append(this.locator, triggerLocator);
  }

  private get contentLocator(): PartLocator {
    return locatorUtil.append(this.locator, contentLocator);
  }

  /** Whether the item is expanded (`aria-expanded="true"` on the trigger). */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.triggerLocator, 'aria-expanded')) === 'true';
  }

  /** Whether the item is disabled (native `disabled` on the trigger). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.triggerLocator);
  }

  /** The item's summary/title text. */
  async getSummary(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.triggerLocator)) ?? undefined;
  }

  /** The item's content text, or `undefined` when the content region is absent. */
  async getContentText(): Promise<Optional<string>> {
    return (await this.interactor.exists(this.contentLocator))
      ? this.interactor.getText(this.contentLocator)
      : undefined;
  }

  override async click(): Promise<void> {
    await this.interactor.click(this.triggerLocator);
  }

  /** Expand the item if it is collapsed. A no-op if it's already disabled-closed. */
  async expand(): Promise<void> {
    await this.setExpanded(true);
  }

  /** Collapse the item if it is expanded. */
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
    return 'RadixV1AccordionDriver';
  }
}
