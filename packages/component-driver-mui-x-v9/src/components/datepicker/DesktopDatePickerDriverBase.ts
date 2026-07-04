import { byCssSelector, IComponentDriverOption, Interactor, locatorUtil, PartLocator } from '@atomic-testing/core';

import { clickCalendarDay, navigateCalendarToMonth, waitForDayGrid } from './calendarNavigation';
import { openPickerButtonLocator, PickerFieldDriverBase } from './PickerFieldDriverBase';
import { DatePickerCharacteristic } from './types';

// The calendar popup is portaled to <body>, so it is addressed from the document Root, not as a
// descendant of the picker. Only one picker popup is open at a time, so the singular root is
// unambiguous while open.
const popupRootCss = '.MuiPickerPopper-root';
const popupLocator = byCssSelector(popupRootCss, 'Root');

/**
 * Base driver for the desktop pickers: the section field mechanics (typed-keystroke
 * `setValue`, hidden-input reads) come from {@link PickerFieldDriverBase}; this base adds the
 * calendar popup as a pointer-driven alternative write path ({@link pickDate}) — open the
 * popup, page to the target month, click the day cell — the way a mouse user would.
 */
export abstract class DesktopDatePickerDriverBase extends PickerFieldDriverBase<Date> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    characteristic: DatePickerCharacteristic<Date>,
    option?: Partial<IComponentDriverOption>
  ) {
    super(locator, interactor, characteristic, option);
  }

  /**
   * Select a calendar date by operating the popup the way a user would: open it, page to the
   * target month, and click the day cell. Accepts an ISO `yyyy-mm-dd` calendar date; the parts
   * are read as a local date (no timezone shift), so the day clicked is exactly the one named.
   *
   * This is the pointer-driven alternative to the keystroke-driven {@link setValue}.
   *
   * @param isoDate A `yyyy-mm-dd` string, e.g. `'2026-06-27'`.
   */
  async pickDate(isoDate: string): Promise<boolean> {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    if (match == null) {
      throw new Error(`${this.driverName}: pickDate expects a 'yyyy-mm-dd' date, received '${isoDate}'`);
    }
    const [, year, month, day] = match;
    return this.pickDayViaCalendar(new Date(Number(year), Number(month) - 1, Number(day)));
  }

  /**
   * Open the popup, page to `value`'s month, and click its day cell. Only the year/month/day of
   * `value` are used — any time component is ignored.
   *
   * @param value The date to select.
   * @param timeoutMs Budget for the popup to open and the day grid to render. Defaults to 10s.
   */
  protected async pickDayViaCalendar(value: Date, timeoutMs: number = 10000): Promise<boolean> {
    await this.openCalendar(timeoutMs);
    await navigateCalendarToMonth(
      this.interactor,
      popupRootCss,
      value.getFullYear(),
      value.getMonth(),
      timeoutMs,
      this.driverName
    );
    await clickCalendarDay(this.interactor, popupRootCss, value.getDate(), this.driverName);
    // Selecting a day closes the popup (closeOnSelect). Best-effort wait so a lingering popup does
    // not overlay later interactions; the value is already committed by the click regardless.
    await this.waitUntil({
      probeFn: () => this.interactor.exists(popupLocator),
      terminateCondition: false,
      timeoutMs: 2000,
    }).catch(() => undefined);
    return true;
  }

  /**
   * Open the calendar popup (no-op when already open) and wait until its day grid has rendered.
   */
  protected async openCalendar(timeoutMs: number = 10000): Promise<void> {
    if (!(await this.interactor.exists(popupLocator))) {
      await this.interactor.click(locatorUtil.append(this.locator, openPickerButtonLocator));
    }
    await waitForDayGrid(this.interactor, popupRootCss, timeoutMs);
  }
}
