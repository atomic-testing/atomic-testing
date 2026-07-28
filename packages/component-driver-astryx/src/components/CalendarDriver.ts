import {
  byAriaLabel,
  byAttribute,
  byCssSelector,
  byRole,
  ComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the Astryx Calendar (`@astryxdesign/core/Calendar`).
 *
 * The scene anchors this driver on the root `<div>` (which self-emits `data-testid`
 * and carries `data-mode`). Each day is two nested elements, not one: a
 * `<div role="gridcell" aria-selected>` wrapper (the ARIA grid cell — `aria-selected`
 * lives here since Astryx 0.1.5, when it moved off the button, which as a plain
 * `role="button"` doesn't permit it) containing a `<button data-date="YYYY-MM-DD"
 * aria-disabled>` (the clickable day, keyed by the stable `data-date`). So
 * `aria-selected` reads/queries target the gridcell via {@link dayCell}, while
 * click/disabled reads target the button via {@link day}. The visible month is
 * read from the grid's `aria-label` (e.g. "January 2024"), and month navigation
 * uses the `"Previous month"`/`"Next month"` controls. The Calendar renders inline
 * (no portal/native-popover), so every accessor is faithful in jsdom and the browser.
 */
export class CalendarDriver extends ComponentDriver {
  /** The clickable day button (`data-date`, `aria-disabled`) for the given ISO date. */
  private day(isoDate: string): PartLocator {
    return locatorUtil.append(this.locator, byAttribute('data-date', isoDate));
  }

  /** The day's ARIA gridcell wrapper (`role="gridcell"`, carries `aria-selected`) for the given ISO date. */
  private dayCell(isoDate: string): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`[role="gridcell"]:has(> [data-date="${isoDate}"])`));
  }

  /** The selection mode (`'single'` | `'range'`), read from `data-mode`. */
  async getMode(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-mode');
  }

  /** The visible month label, read from the (first) grid's `aria-label`, e.g. "January 2024". */
  async getVisibleMonthLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(locatorUtil.append(this.locator, byRole('grid')), 'aria-label');
  }

  /** The number of rendered day cells. */
  async getDayCount(): Promise<number> {
    const days = locatorUtil.append(this.locator, byCssSelector('[data-date]'));
    return (await this.interactor.getAttribute(days, 'data-date', true)).length;
  }

  /** The ISO dates (`YYYY-MM-DD`) of the currently selected days, in DOM order. */
  async getSelectedDates(): Promise<readonly string[]> {
    const selected = locatorUtil.append(
      this.locator,
      byCssSelector('[role="gridcell"][aria-selected="true"] [data-date]')
    );
    return this.interactor.getAttribute(selected, 'data-date', true);
  }

  /** Whether the day with the given ISO date is selected. */
  async isDaySelected(isoDate: string): Promise<boolean> {
    return (await this.interactor.getAttribute(this.dayCell(isoDate), 'aria-selected')) === 'true';
  }

  /** Whether the day with the given ISO date is disabled. */
  async isDayDisabled(isoDate: string): Promise<boolean> {
    return (await this.interactor.getAttribute(this.day(isoDate), 'aria-disabled')) === 'true';
  }

  /**
   * Click the day with the given ISO date (`YYYY-MM-DD`).
   * @returns `false` when that day is not currently rendered.
   */
  async selectDay(isoDate: string): Promise<boolean> {
    if (!(await this.interactor.exists(this.day(isoDate)))) {
      return false;
    }
    await this.interactor.click(this.day(isoDate));
    return true;
  }

  /** Select a range by clicking the start day then the end day (range mode). */
  async selectRange(startIsoDate: string, endIsoDate: string): Promise<boolean> {
    return (await this.selectDay(startIsoDate)) && (await this.selectDay(endIsoDate));
  }

  /** Navigate to the previous month. */
  async previousMonth(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, byAriaLabel('Previous month')));
  }

  /** Navigate to the next month. */
  async nextMonth(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, byAriaLabel('Next month')));
  }

  override get driverName(): string {
    return 'AstryxCalendarDriver';
  }
}
