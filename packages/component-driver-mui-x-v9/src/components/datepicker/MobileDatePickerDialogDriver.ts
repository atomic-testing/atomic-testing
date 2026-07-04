import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { clickCalendarDay, navigateCalendarToMonth, waitForDayGrid } from './calendarNavigation';

// The mobile picker's entry dialog is portaled to <body> as a modal `[role="dialog"]` hosting the
// same calendar DOM as the desktop popup, plus an action bar. Only one picker dialog is open at a
// time, so every locator is addressed from the document Root.
const dialogRootCss = '[role="dialog"]';

const parts = {
  // The action bar renders Cancel then OK, in that order, as its only buttons.
  cancelButton: {
    locator: byCssSelector(`${dialogRootCss} .MuiDialogActions-root button:nth-of-type(1)`, 'Root'),
    driver: HTMLButtonDriver,
  },
  okButton: {
    locator: byCssSelector(`${dialogRootCss} .MuiDialogActions-root button:nth-of-type(2)`, 'Root'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the modal entry dialog a MUI X v9 mobile picker opens. Day selection reuses the
 * shared calendar machinery (month paging header + day grid); the selection only commits to the
 * field when the dialog's OK action is accepted.
 * @see https://mui.com/x/react-date-pickers/date-picker/
 */
export class MobileDatePickerDialogDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /**
   * Page the dialog's calendar to `value`'s month and click its day cell. Only the
   * year/month/day of `value` are used. The choice is not committed until {@link accept} runs.
   *
   * @param value The date to select.
   * @param timeoutMs Budget for the day grid to render and the month paging to settle.
   */
  async pickDay(value: Date, timeoutMs: number = 10000): Promise<void> {
    await waitForDayGrid(this.interactor, dialogRootCss, timeoutMs);
    await navigateCalendarToMonth(
      this.interactor,
      dialogRootCss,
      value.getFullYear(),
      value.getMonth(),
      timeoutMs,
      this.driverName
    );
    await clickCalendarDay(this.interactor, dialogRootCss, value.getDate(), this.driverName);
  }

  /**
   * Commit the dialog's current selection to the field (the OK action).
   */
  async accept(): Promise<void> {
    await this.parts.okButton.click();
  }

  /**
   * Dismiss the dialog without committing the selection (the Cancel action).
   */
  async cancel(): Promise<void> {
    await this.parts.cancelButton.click();
  }

  get driverName(): string {
    return 'MuiV9MobileDatePickerDialog';
  }
}
