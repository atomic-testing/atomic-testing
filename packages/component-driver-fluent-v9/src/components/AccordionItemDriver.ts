import {
  byCssClass,
  ComponentDriver,
  IDisableableDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

const headerButtonLocator = byCssClass('fui-AccordionHeader__button');
const panelLocator = byCssClass('fui-AccordionPanel');
const defaultTransitionDuration = 1000;

/**
 * Driver for a single Fluent v9 `AccordionItem` (a child of `Accordion` —
 * see {@link AccordionDriver}), folding in `AccordionHeader`'s and
 * `AccordionPanel`'s state directly rather than exposing them as separate
 * driver classes — templated off `component-driver-radix-v1`'s
 * `AccordionDriver` (itself modeling one item, per that driver's own doc),
 * since here too every item has exactly one header and at most one panel,
 * neither independently addressable as a collection.
 *
 * DOM audit (@fluentui/react-components@9.74.3): `AccordionItem` itself
 * renders a plain `<div class="fui-AccordionItem">` with NO `role` and NO
 * `data-state` reflecting open/closed — `AccordionHeader` renders
 * `<div class="fui-AccordionHeader"><button class="fui-AccordionHeader__button"
 * aria-expanded="true|false" type="button">`, the one reliable un-hashed
 * state signal, which this driver reads directly rather than trusting the
 * item root. Grepped the entire compiled package for `role=`/`aria-labelledby`/
 * `aria-level`: Fluent's Accordion does NOT implement the ARIA APG
 * accordion pattern's heading/`role="region"`/id-linkage wiring at all —
 * unlike Radix's, whose content is `role="region"`.
 *
 * **`AccordionPanel` fully UNMOUNTS while collapsed** (`unmountOnExit: true`
 * is Fluent's hard-coded default, confirmed against
 * `@fluentui/react-motion-components-preview`'s `Collapse`): a panel that was
 * never opened never mounts at all, and toggling open→closed plays the exit
 * animation before removing it from the DOM — a STRONGER case than Radix's
 * accordion, whose content wrapper stays mounted with lazily-rendered
 * children. {@link getPanelText} therefore returns `null` whenever the panel
 * isn't currently present (collapsed, or mid-exit-animation under a real
 * browser's timing), not merely when the item has never been opened.
 *
 * **{@link collapse} is a no-op on the parent `Accordion`'s OWN `collapsible`
 * prop, not a driver limitation**: verified against Fluent's source
 * (`updateOpenItems` in `useAccordion.js`) — with the default
 * `collapsible={false}`, clicking the header of the single currently-open
 * item (in single-select mode, or the last remaining open item in `multiple`
 * mode) is silently ignored; Fluent refuses to ever reach zero open items
 * unless the `Accordion` itself sets `collapsible`. `expand()` is unaffected
 * either way.
 */
export class AccordionItemDriver extends ComponentDriver<{}> implements IDisableableDriver {
  private get headerButtonLocator(): PartLocator {
    return locatorUtil.append(this.locator, headerButtonLocator);
  }

  private get panelLocator(): PartLocator {
    return locatorUtil.append(this.locator, panelLocator);
  }

  /** The item's summary/header text. */
  async getSummary(): Promise<Optional<string>> {
    const text = await this.interactor.getText(this.headerButtonLocator);
    return text?.trim();
  }

  /** Whether the item is expanded (`aria-expanded="true"` on the header button). */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.headerButtonLocator, 'aria-expanded')) === 'true';
  }

  /** Whether the item's header is disabled (native `disabled` on the header button). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.headerButtonLocator);
  }

  /** The panel's text content, or `null` when the panel is not currently mounted — see class doc. */
  async getPanelText(): Promise<string | null> {
    const exists = await this.interactor.exists(this.panelLocator);
    if (!exists) {
      return null;
    }
    return (await this.interactor.getText(this.panelLocator)) ?? null;
  }

  /**
   * Click the header, toggling this item's expanded state. No-ops on a
   * disabled header rather than clicking it regardless: under jsdom,
   * `userEvent.click` already silently skips a disabled native `<button>`,
   * but `PlaywrightInteractor.click`'s actionability check instead retries
   * "is enabled" until the click's own timeout — indistinguishable from a
   * hang for a header that can never become enabled (same contract as
   * `RadioDriver.setSelected`). Checking {@link isDisabled} first keeps the
   * no-op behavior identical across every `Interactor`.
   */
  override async click(): Promise<void> {
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.headerButtonLocator);
  }

  /** Expand the item if it is collapsed (a no-op otherwise). */
  async expand(timeoutMs: number = defaultTransitionDuration): Promise<void> {
    await this.setExpanded(true, timeoutMs);
  }

  /** Collapse the item if it is expanded (a no-op otherwise). */
  async collapse(timeoutMs: number = defaultTransitionDuration): Promise<void> {
    await this.setExpanded(false, timeoutMs);
  }

  private async setExpanded(expanded: boolean, timeoutMs: number): Promise<void> {
    if ((await this.isExpanded()) === expanded) {
      return;
    }
    await this.click();
    await this.interactor.waitUntil({
      probeFn: () => this.isExpanded(),
      terminateCondition: expanded,
      timeoutMs,
    });
  }

  get driverName(): string {
    return 'FluentV9AccordionItemDriver';
  }
}
