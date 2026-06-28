import { byRole, ComponentDriver, Optional, PartLocator } from '@atomic-testing/core';

// MUI renders the tooltip into a portal outside this driver's subtree, so it is
// addressed from the document root by its `role="tooltip"`.
const tooltipLocator: PartLocator = byRole('tooltip', 'Root');

const defaultRevealTimeout = 250;

/**
 * Driver for the Material UI v9 Tooltip component.
 *
 * The driver is rooted at the **trigger** element. MUI shows the tooltip on
 * hover/focus and renders it into a portal (a `role="tooltip"` popper) outside the
 * trigger's subtree, so the text is read from the document root via
 * {@link tooltipLocator} after revealing it. The tooltip unmounts when not shown,
 * so presence of that element doubles as the visible state.
 *
 * Note: hover reveal depends on the tooltip's `enterDelay`; with a non-zero delay
 * the reveal is timer-bound. {@link getTitle} waits for the tooltip to appear.
 * @see https://mui.com/material-ui/react-tooltip/
 */
export class TooltipDriver extends ComponentDriver {
  /**
   * Reveal the tooltip by hovering its trigger, waiting until it is shown (or the
   * timeout elapses, e.g. when the trigger has no tooltip).
   */
  async show(timeoutMs: number = defaultRevealTimeout): Promise<void> {
    await this.interactor.hover(this.locator);
    await this.interactor.waitUntil({
      probeFn: () => this.isVisible(),
      terminateCondition: true,
      timeoutMs,
    });
  }

  /**
   * Hide the tooltip by moving the pointer off its trigger, waiting until it is gone.
   */
  async hide(timeoutMs: number = defaultRevealTimeout): Promise<void> {
    await this.interactor.mouseLeave(this.locator);
    await this.interactor.waitUntil({
      probeFn: () => this.isVisible(),
      terminateCondition: false,
      timeoutMs,
    });
  }

  /**
   * Whether a tooltip is currently shown.
   */
  async isVisible(): Promise<boolean> {
    if (!(await this.interactor.exists(tooltipLocator))) {
      return false;
    }
    return this.interactor.isVisible(tooltipLocator);
  }

  /**
   * Reveal the tooltip, read its text, then restore the un-hovered state. Returns
   * `undefined` when the trigger has no tooltip (none appears within the timeout).
   *
   * The hover is undone before returning so a subsequent read on a *different*
   * trigger isn't shadowed by this still-open tooltip: MUI renders all tooltips into
   * one portal and provides no per-trigger DOM link, and jsdom's synthetic hover does
   * not fire `mouseout` on the previously-hovered sibling.
   *
   * @param timeoutMs How long to wait for the tooltip to appear after hovering.
   */
  async getTitle(timeoutMs: number = defaultRevealTimeout): Promise<Optional<string>> {
    await this.show(timeoutMs);
    if (!(await this.interactor.exists(tooltipLocator))) {
      return undefined;
    }
    const text = (await this.interactor.getText(tooltipLocator))?.trim();
    await this.hide(timeoutMs);
    return text;
  }

  override get driverName(): string {
    return 'MuiV9TooltipDriver';
  }
}
