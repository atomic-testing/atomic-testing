import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { DatePickerCharacteristic } from './types';

// Since MUI X v6 the desktop pickers no longer use a plain editable <input>. The visible field
// is a `PickersSectionList`: a `role="group"` of `contenteditable` `role="spinbutton"` section
// spans (`.MuiPickersSectionList-sectionContent`, one per Month/Day/Year). A single hidden,
// `aria-hidden` `<input class="MuiPickersInputBase-input">` mirrors the committed value as a
// locale-formatted string for form submission — the stable, portable READ path.
//
// The WRITE path goes through the calendar popup, not the section field: typing into a section
// is not portable (the Playwright interactor's `fill` replaces innerText, which MUI ignores, and
// the DOM interactor's `pressKey` dispatches only `keydown`/`keyup` with no `input` event), but a
// mouse click behaves identically across engines. So `setValue` opens the popup, walks to the
// target month, and clicks the day cell. See {@link DesktopDatePickerDriverBase.setValue}.
const parts = {
  // The hidden input mirrors the committed value as a formatted string (e.g. "06/27/2026").
  valueInput: {
    locator: byCssClass('MuiPickersInputBase-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

// The open ("Choose date") adornment button carries a stable, locale-independent marker attribute
// (its `aria-label` interpolates the selected date, so it is not a reliable handle).
const openButtonLocator = byCssSelector('[data-mui-picker-open-button="true"]');

// The calendar popup is portaled to <body>, so its parts are addressed from the document Root, not
// as descendants of the picker. Only one picker popup is open at a time, so the singular root is
// unambiguous while open.
const popupRoot = '.MuiPickerPopper-root';
const popupLocator = byCssSelector(popupRoot, 'Root');
const calendarHeaderLabelLocator = byCssSelector(`${popupRoot} .MuiPickersCalendarHeader-label`, 'Root');
const previousMonthLocator = byCssSelector(`${popupRoot} .MuiPickersArrowSwitcher-previousIconButton`, 'Root');
const nextMonthLocator = byCssSelector(`${popupRoot} .MuiPickersArrowSwitcher-nextIconButton`, 'Root');
// In-month day cells are <button>s carrying a `data-timestamp`; out-of-month cells are filler
// <div>s without one. Excluding `dayOutsideMonth` keeps the set to days 1..N even when a consumer
// turns on `showDaysOutsideCurrentMonth`, so the buttons line up with day-of-month by position.
const inMonthDayButtonsLocator = byCssSelector(
  `${popupRoot} .MuiPickerDay-root[data-timestamp]:not(.MuiPickerDay-dayOutsideMonth)`,
  'Root'
);
// While the month slide animates, MUI keeps the outgoing month grids mounted (marked
// `slideExit`) alongside the incoming one, so the day-cell list briefly spans several months.
// Waiting for no exiting grid to remain collapses the view back to a single month before any day
// is read. (Under jsdom there is no animation, so this never matches and the wait is a no-op.)
const exitingMonthGridLocator = byCssSelector(`${popupRoot} .MuiPickersSlideTransition-slideExit`, 'Root');

function dayByTimestampLocator(timestamp: string): PartLocator {
  return byCssSelector(`${popupRoot} .MuiPickerDay-root[data-timestamp="${timestamp}"]`, 'Root');
}

// Collapse a year+month to a single comparable ordinal so month deltas are a subtraction.
function toMonthOrdinal(year: number, monthIndex: number): number {
  return year * 12 + monthIndex;
}

// The header label (e.g. "June 2026") is parsed in the driver's own JS runtime — never in the
// browser — so this `Date` parse runs on V8 in both the DOM and Playwright paths and needs no
// cross-engine guarantee. Assumes the default (English) locale, matching this driver family's
// other English defaults (e.g. the `mm/dd/yyyy` format fallback).
function parseHeaderMonthOrdinal(label: string): number | null {
  const parsed = new Date(label);
  return Number.isNaN(parsed.getTime()) ? null : toMonthOrdinal(parsed.getFullYear(), parsed.getMonth());
}

export abstract class DesktopDatePickerDriverBase extends ComponentDriver<typeof parts> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    protected characteristic: DatePickerCharacteristic,
    option?: Partial<IComponentDriverOption>
  ) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /**
   * The committed value parsed into a `Date`, or `null` when the field is empty.
   * Reads the hidden input that mirrors the field's locale-formatted value.
   */
  async getValue(): Promise<Date | null> {
    const text = await this.getValueText();
    if (text == null) {
      return null;
    }
    const format = await this.getFormat();
    return this.characteristic.textEntryToValue(text, format);
  }

  /**
   * The raw locale-formatted text shown by the field (e.g. "06/27/2026"), or `undefined`
   * when the field is empty.
   */
  async getValueText(): Promise<Optional<string>> {
    await this.enforcePartExistence('valueInput');
    const value = await this.interactor.getInputValue(this.parts.valueInput.locator);
    return value != null && value.length > 0 ? value : undefined;
  }

  /**
   * The v5 driver read the field's `placeholder` to discover the format, but the v9 section
   * field has no placeholder attribute. The format is carried implicitly by the section spans,
   * so fall back to the driver's declared default format.
   */
  async getFormat(defaultFormat: string = this.characteristic.defaultFormat): Promise<string> {
    return defaultFormat;
  }

  /**
   * Set the picker's committed value to `value` by operating the calendar popup the way a user
   * would: open it, page to the target month, and click the day cell. Returns `true` once the day
   * is clicked.
   *
   * Only the year/month/day of `value` are used — any time component is ignored. Clearing (setting
   * an empty value) is not handled here; the default desktop picker has no clear affordance.
   *
   * @param value The date to select.
   * @param timeoutMs Budget for the popup to open and the day grid to render. Defaults to 10s.
   */
  async setValue(value: Date, timeoutMs: number = 10000): Promise<boolean> {
    await this.openCalendar(timeoutMs);
    await this.navigateToMonth(value.getFullYear(), value.getMonth(), timeoutMs);

    // Day cells render in DOM order as days 1..N, so the day-of-month indexes straight into the
    // timestamp list. Reading the timestamp from the DOM (rather than recomputing it) keeps the
    // selection free of any timezone assumption about how the picker stamps each day.
    const timestamps = await this.interactor.getAttribute(inMonthDayButtonsLocator, 'data-timestamp', true);
    const targetTimestamp = timestamps[value.getDate() - 1];
    if (targetTimestamp == null) {
      throw new Error(
        `${this.driverName}: day ${value.getDate()} is not available in the displayed month (found ${timestamps.length} days)`
      );
    }

    await this.interactor.click(dayByTimestampLocator(targetTimestamp));
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
   * Convenience wrapper over {@link setValue} that accepts an ISO `yyyy-mm-dd` calendar date. The
   * parts are read as a local date (no timezone shift), so the day clicked is exactly the one named.
   *
   * @param isoDate A `yyyy-mm-dd` string, e.g. `'2026-06-27'`.
   */
  async pickDate(isoDate: string): Promise<boolean> {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    if (match == null) {
      throw new Error(`${this.driverName}: pickDate expects a 'yyyy-mm-dd' date, received '${isoDate}'`);
    }
    const [, year, month, day] = match;
    return this.setValue(new Date(Number(year), Number(month) - 1, Number(day)));
  }

  /**
   * Open the calendar popup (no-op when already open) and wait until its day grid has rendered.
   */
  protected async openCalendar(timeoutMs: number = 10000): Promise<void> {
    if (!(await this.interactor.exists(popupLocator))) {
      await this.interactor.click(locatorUtil.append(this.locator, openButtonLocator));
    }
    // The day grid mounts a tick after the popup, so wait for an actual day cell, not just the popup.
    await this.waitUntil({
      probeFn: () => this.interactor.exists(inMonthDayButtonsLocator),
      terminateCondition: true,
      timeoutMs,
    });
  }

  /**
   * Page the open calendar to the given year/month by clicking the previous/next-month arrows. The
   * displayed month is re-read from the header each step, so the walk converges regardless of arrow
   * animation, and is bounded so an unreachable target (e.g. blocked by `minDate`/`maxDate`) fails
   * fast instead of looping forever.
   */
  protected async navigateToMonth(year: number, monthIndex: number, timeoutMs: number = 10000): Promise<void> {
    const target = toMonthOrdinal(year, monthIndex);
    // A calendar spans at most a couple of decades of practical navigation; cap well above that.
    const maxSteps = 24 * 30;
    for (let step = 0; step < maxSteps; step++) {
      const label = await this.interactor.getText(calendarHeaderLabelLocator);
      const displayed = label != null ? parseHeaderMonthOrdinal(label) : null;
      if (displayed == null) {
        throw new Error(`${this.driverName}: could not read the calendar month from header "${label}"`);
      }
      if (displayed === target) {
        // The header flips to the target immediately, but outgoing grids may still be sliding out;
        // wait for them to leave so the caller reads day cells from the target month alone.
        await this.waitForCalendarSettled(timeoutMs);
        return;
      }
      await this.interactor.click(displayed < target ? nextMonthLocator : previousMonthLocator);
      // Let the day grid for the new month mount before the next header read.
      await this.waitUntil({
        probeFn: () => this.interactor.exists(inMonthDayButtonsLocator),
        terminateCondition: true,
        timeoutMs,
      });
    }
    throw new Error(`${this.driverName}: month ${year}-${String(monthIndex + 1).padStart(2, '0')} was not reachable`);
  }

  /**
   * Wait until no month grid is mid-exit, i.e. the calendar shows a single settled month. No-op in
   * non-animating environments (jsdom), where exiting grids never appear.
   */
  protected async waitForCalendarSettled(timeoutMs: number = 5000): Promise<void> {
    await this.waitUntil({
      probeFn: () => this.interactor.exists(exitingMonthGridLocator),
      terminateCondition: false,
      timeoutMs,
    });
  }
}
