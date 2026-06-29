import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

const dialogPanel = byCssSelector('[role="dialog"]');
// Astryx wraps the caller's content in `<div class="astryx-popover">`; the hidden
// close button (`button[aria-label="Close popover"]`) is a separate sibling. The
// content is read from that stable semantic class — a documented last-resort
// anchor (cf. Toast's `.astryx-toast`) — so it never picks up the close button and
// does not depend on the content being the dialog's first `<div>` child.
const contentChild = byCssSelector('.astryx-popover');

/**
 * Driver for the Astryx Popover (`@astryxdesign/core/Popover`).
 *
 * The scene anchors this driver on the **trigger** `<button>` (which carries
 * `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`). The floating
 * panel is rendered as a sibling of the trigger (no portal) and linked by
 * `aria-controls` → the popover element's `id`; inside it Astryx renders a
 * `role="dialog"` with the popover's accessible name (`aria-label`) and the
 * caller's content in an `astryx-popover` wrapper. {@link resolvePanelLocator}
 * re-roots from the document via that link, so reads are instance-safe and never
 * coupled to a StyleX-hashed class.
 *
 * Open state is the trigger's `aria-expanded` (faithful in jsdom); the panel's
 * true visibility is a native-popover behaviour exercised only by the E2E run. The
 * content is always mounted, so `getLabel`/`getContent` read in both states.
 */
export class PopoverDriver extends ComponentDriver {
  /** The popover panel element (the `aria-controls` target), or `null` when unlinked. */
  private async resolvePanelLocator(): Promise<PartLocator | null> {
    const panelId = await this.interactor.getAttribute(this.locator, 'aria-controls');
    if (!panelId) {
      return null;
    }
    return byCssSelector(`[id="${panelId}"]`, 'Root');
  }

  /** Whether the popover is open — read from the trigger's `aria-expanded`. */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-expanded')) === 'true';
  }

  /** Open the popover by clicking the trigger, if it is not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.click();
    }
  }

  /** Close the popover by clicking the trigger, if it is open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.click();
    }
  }

  /** The popover's accessible name — the panel dialog's `aria-label` (from the `label` prop). */
  async getLabel(): Promise<Optional<string>> {
    const panel = await this.resolvePanelLocator();
    if (panel == null) {
      return undefined;
    }
    return this.interactor.getAttribute(locatorUtil.append(panel, dialogPanel), 'aria-label');
  }

  /**
   * The popover's content text, read from the `astryx-popover` content wrapper so
   * the hidden close button's label is never included.
   */
  async getContent(): Promise<Optional<string>> {
    const panel = await this.resolvePanelLocator();
    if (panel == null) {
      return undefined;
    }
    return (await this.interactor.getText(locatorUtil.append(panel, contentChild))) ?? undefined;
  }

  override get driverName(): string {
    return 'AstryxPopoverDriver';
  }
}
