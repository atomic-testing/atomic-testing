import { byCssSelector, Interactor, PartLocator } from '@atomic-testing/core';

// Shared machinery for driving a MUI X day-calendar surface (day grid + month
// paging header). The same calendar DOM renders in two hosts — the desktop
// pickers' popper popup (`.MuiPickerPopper-root`) and the mobile pickers' modal
// dialog (`[role="dialog"]`) — so every helper takes the host's root CSS
// selector and addresses the calendar from the document Root (both hosts
// portal to <body>). Only one picker surface is open at a time, so the
// singular root is unambiguous while open.

/**
 * In-month day cells are `<button>`s carrying a `data-timestamp`; out-of-month
 * cells are filler `<div>`s without one. Excluding `dayOutsideMonth` keeps the
 * set to days 1..N even when a consumer turns on `showDaysOutsideCurrentMonth`,
 * so the buttons line up with day-of-month by position.
 */
export function dayGridLocator(hostRootCss: string): PartLocator {
  return byCssSelector(`${hostRootCss} .MuiPickerDay-root[data-timestamp]:not(.MuiPickerDay-dayOutsideMonth)`, 'Root');
}

function headerLabelLocator(hostRootCss: string): PartLocator {
  return byCssSelector(`${hostRootCss} .MuiPickersCalendarHeader-label`, 'Root');
}

function previousMonthLocator(hostRootCss: string): PartLocator {
  return byCssSelector(`${hostRootCss} .MuiPickersArrowSwitcher-previousIconButton`, 'Root');
}

function nextMonthLocator(hostRootCss: string): PartLocator {
  return byCssSelector(`${hostRootCss} .MuiPickersArrowSwitcher-nextIconButton`, 'Root');
}

// While the month slide animates, MUI keeps the outgoing month grids mounted
// (marked `slideExit`) alongside the incoming one, so the day-cell list briefly
// spans several months. (Under jsdom there is no animation, so the marker never
// matches and waits on it are no-ops.)
function exitingMonthGridLocator(hostRootCss: string): PartLocator {
  return byCssSelector(`${hostRootCss} .MuiPickersSlideTransition-slideExit`, 'Root');
}

function dayByTimestampLocator(hostRootCss: string, timestamp: string): PartLocator {
  return byCssSelector(`${hostRootCss} .MuiPickerDay-root[data-timestamp="${timestamp}"]`, 'Root');
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

/**
 * Wait until the host's day grid has rendered. The grid mounts a tick after the
 * host surface itself, so waiting on the host root alone is not enough.
 */
export async function waitForDayGrid(interactor: Interactor, hostRootCss: string, timeoutMs: number): Promise<void> {
  await interactor.waitUntil({
    probeFn: () => interactor.exists(dayGridLocator(hostRootCss)),
    terminateCondition: true,
    timeoutMs,
  });
}

/**
 * Wait until no month grid is mid-exit, i.e. the calendar shows a single settled month. No-op in
 * non-animating environments (jsdom), where exiting grids never appear.
 */
export async function waitForCalendarSettled(
  interactor: Interactor,
  hostRootCss: string,
  timeoutMs: number
): Promise<void> {
  await interactor.waitUntil({
    probeFn: () => interactor.exists(exitingMonthGridLocator(hostRootCss)),
    terminateCondition: false,
    timeoutMs,
  });
}

/**
 * Page the open calendar to the given year/month by clicking the previous/next-month arrows. The
 * displayed month is re-read from the header each step, so the walk converges regardless of arrow
 * animation, and is bounded so an unreachable target (e.g. blocked by `minDate`/`maxDate`) fails
 * fast instead of looping forever.
 */
export async function navigateCalendarToMonth(
  interactor: Interactor,
  hostRootCss: string,
  year: number,
  monthIndex: number,
  timeoutMs: number,
  driverName: string
): Promise<void> {
  const target = toMonthOrdinal(year, monthIndex);
  // A calendar spans at most a couple of decades of practical navigation; cap well above that.
  const maxSteps = 24 * 30;
  for (let step = 0; step < maxSteps; step++) {
    const label = await interactor.getText(headerLabelLocator(hostRootCss));
    const displayed = label != null ? parseHeaderMonthOrdinal(label) : null;
    if (displayed == null) {
      throw new Error(`${driverName}: could not read the calendar month from header "${label}"`);
    }
    if (displayed === target) {
      // The header flips to the target immediately, but outgoing grids may still be sliding out;
      // wait for them to leave so the caller reads day cells from the target month alone.
      await waitForCalendarSettled(interactor, hostRootCss, timeoutMs);
      return;
    }
    await interactor.click(displayed < target ? nextMonthLocator(hostRootCss) : previousMonthLocator(hostRootCss));
    // Let the day grid for the new month mount before the next header read.
    await waitForDayGrid(interactor, hostRootCss, timeoutMs);
  }
  throw new Error(`${driverName}: month ${year}-${String(monthIndex + 1).padStart(2, '0')} was not reachable`);
}

/**
 * Click the day cell for the given day-of-month in the currently displayed month.
 *
 * Day cells render in DOM order as days 1..N, so the day-of-month indexes straight into the
 * timestamp list. Reading the timestamp from the DOM (rather than recomputing it) keeps the
 * selection free of any timezone assumption about how the picker stamps each day.
 */
export async function clickCalendarDay(
  interactor: Interactor,
  hostRootCss: string,
  dayOfMonth: number,
  driverName: string
): Promise<void> {
  const timestamps = await interactor.getAttribute(dayGridLocator(hostRootCss), 'data-timestamp', true);
  const targetTimestamp = timestamps[dayOfMonth - 1];
  if (targetTimestamp == null) {
    throw new Error(
      `${driverName}: day ${dayOfMonth} is not available in the displayed month (found ${timestamps.length} days)`
    );
  }
  await interactor.click(dayByTimestampLocator(hostRootCss, targetTimestamp));
}
