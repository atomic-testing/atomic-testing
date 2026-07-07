import { byCssSelector, byRole, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { resolveDescribedByRoleText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx DateInput (`@astryxdesign/core/DateInput`).
 *
 * The scene anchors this driver on the root `<div>` (which self-emits
 * `data-testid`). The editable control is an `<input role="combobox">` whose value
 * is the **display** string (e.g. "January 15, 2024", not the ISO value) and which
 * carries `aria-haspopup="dialog"`, `aria-expanded`, `aria-invalid`, and — when open
 * — `aria-controls` → the calendar popover. A `"Open calendar"`/`"Close calendar"`
 * button toggles the popover. The calendar's day cells are `[data-date]` buttons
 * that render in jsdom once opened (reachable via `aria-controls`), so
 * {@link pickDate} is faithful there as well as in the browser; the popover's true
 * top-layer *visibility* is native-popover behaviour exercised by E2E.
 */
export class DateInputDriver extends ComponentDriver {
  protected get input(): PartLocator {
    return locatorUtil.append(this.locator, byRole('combobox'));
  }

  private get toggle(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-label$="calendar"]'));
  }

  /** The displayed value text (formatted date), or `undefined` when empty. */
  async getValue(): Promise<Optional<string>> {
    return (await this.interactor.getInputValue(this.input)) || undefined;
  }

  /** Type a value into the input (replacing any existing text). */
  async setValue(text: string): Promise<void> {
    await this.interactor.enterText(this.input, text);
  }

  /** Whether the calendar popover is open — read from the input's `aria-expanded`. */
  async isExpanded(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.input, 'aria-expanded')) === 'true';
  }

  /** Whether the input is invalid (`aria-invalid="true"`). */
  async isInvalid(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.input, 'aria-invalid')) === 'true';
  }

  /**
   * The `disabledMessage` tooltip text, resolved via the input's composed
   * `aria-describedby` — the id list also carries the description/status-message
   * ids, so this picks out whichever target has `role="tooltip"`. `undefined`
   * when the input has no disabled-reason tooltip.
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    return resolveDescribedByRoleText(this.interactor, this.input, 'aria-describedby', 'tooltip');
  }

  /**
   * Open the calendar popover by clicking the toggle, if not already open, then wait
   * for `aria-expanded` to flip — `click()` resolves before React mounts the popover
   * (and sets `aria-controls`), so a {@link pickDate} that raced ahead would miss the
   * day cells.
   */
  async open(): Promise<void> {
    if (!(await this.isExpanded())) {
      await this.interactor.click(this.toggle);
      await this.waitForExpanded();
    }
  }

  /** Wait until the input reports `aria-expanded="true"` (the popover has mounted). */
  private async waitForExpanded(): Promise<void> {
    await this.interactor.waitUntil({
      probeFn: () => this.isExpanded(),
      terminateCondition: (open: boolean) => open,
      timeoutMs: 2000,
      probeCount: 20,
    });
  }

  /** Close the calendar popover by clicking the toggle, if open. */
  async close(): Promise<void> {
    if (await this.isExpanded()) {
      await this.interactor.click(this.toggle);
    }
  }

  /** The open calendar popover's day cell for the given ISO date, scoped via `aria-controls`. */
  protected async popoverDay(isoDate: string): Promise<PartLocator | null> {
    const controlsId = await this.interactor.getAttribute(this.input, 'aria-controls');
    if (controlsId == null) {
      return null;
    }
    return byCssSelector(`[id="${controlsId}"] [data-date="${isoDate}"]`, 'Root');
  }

  /**
   * Open the calendar and click the day with the given ISO date (`YYYY-MM-DD`).
   * @returns `false` when that day is not rendered in the open popover.
   */
  async pickDate(isoDate: string): Promise<boolean> {
    await this.open();
    const day = await this.popoverDay(isoDate);
    if (day == null || !(await this.interactor.exists(day))) {
      return false;
    }
    await this.interactor.click(day);
    return true;
  }

  /**
   * Clear the value via the clear control.
   * @returns `false` when there is no clear control (`hasClear` is off or the input is empty).
   */
  async clear(): Promise<boolean> {
    const clear = locatorUtil.append(this.locator, byCssSelector('button[aria-label^="Clear"]'));
    if (!(await this.interactor.exists(clear))) {
      return false;
    }
    await this.interactor.click(clear);
    return true;
  }

  override get driverName(): string {
    return 'AstryxDateInputDriver';
  }
}
