import { byCssSelector, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { DateInputDriver } from './DateInputDriver';

/**
 * Driver for the Astryx DateTimeInput (`@astryxdesign/core/DateTimeInput`).
 *
 * DateTimeInput pairs a date field — an `<input role="combobox">` with a calendar
 * popover, identical to {@link DateInputDriver}, whose behaviour this driver
 * inherits — with a separate time `<input>`. The root `<div>` self-emits
 * `data-testid`. The date field's accessors are reused as {@link getDateValue}/
 * {@link setDate}; the time field adds {@link getTimeValue}/{@link setTime}.
 *
 * The time input's accessible name is no longer a fixed `aria-label="Time"` as of
 * Astryx 0.1.3 — it defaults to `"{label} time"` (and is overridable via a
 * `timeLabel` prop), so it's no longer a stable match value. Since the widget only
 * ever renders these two `<input>`s, the time field is instead reached as
 * whichever one is NOT the date combobox.
 */
export class DateTimeInputDriver extends DateInputDriver {
  private get timeInput(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('input:not([role="combobox"])'));
  }

  /** The date field's displayed value (formatted date), or `undefined` when empty. */
  async getDateValue(): Promise<Optional<string>> {
    return this.getValue();
  }

  /** Type into the date field (replacing any existing text). */
  async setDate(text: string): Promise<void> {
    await this.setValue(text);
  }

  /** The time field's displayed value (e.g. "10:30 AM"), or `undefined` when empty. */
  async getTimeValue(): Promise<Optional<string>> {
    return (await this.interactor.getInputValue(this.timeInput)) || undefined;
  }

  /** Type into the time field (replacing any existing text). */
  async setTime(text: string): Promise<void> {
    await this.interactor.enterText(this.timeInput, text);
  }

  override get driverName(): string {
    return 'AstryxDateTimeInputDriver';
  }
}
