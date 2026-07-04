import { byCssSelector, IComponentDriverOption, Interactor, locatorUtil, PartLocator } from '@atomic-testing/core';

import { dateToTextEntry, textEntryToDate } from './dateUtil';
import { MobileDatePickerDialogDriver } from './MobileDatePickerDialogDriver';
import { openPickerButtonLocator, PickerFieldDriverBase } from './PickerFieldDriverBase';
import { DatePickerCharacteristic } from './types';

const dialogLocator = byCssSelector('[role="dialog"]', 'Root');

/**
 * Driver for the MUI X v9 MobileDatePicker.
 *
 * The mobile field renders the same section list + hidden mirror input as the desktop pickers,
 * so reads come from {@link PickerFieldDriverBase} unchanged. Writes differ: on a real (touch)
 * browser, pointer interaction with the mobile field opens the modal entry dialog rather than
 * focusing a section, so `setValue` drives the dialog — open it, pick the day on its calendar,
 * accept — instead of typing keystrokes.
 * @see https://mui.com/x/react-date-pickers/date-picker/
 */
export class MobileDatePickerDriver extends PickerFieldDriverBase<Date> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    const characteristic: DatePickerCharacteristic = {
      valueToTextEntry: dateToTextEntry,
      textEntryToValue: textEntryToDate,
      defaultFormat: 'mm/dd/yyyy',
    };
    super(locator, interactor, characteristic, option);
  }

  /**
   * Set the picker's committed value by operating the entry dialog: open it, page its calendar
   * to the target month, click the day cell, and accept. Only the year/month/day of `value` are
   * used.
   *
   * Clearing is not supported: the mobile dialog renders only Cancel/OK actions by default (no
   * Clear), and the field itself rejects keystrokes on mobile.
   *
   * @param value The date to select.
   */
  override async setValue(value: Date | null): Promise<boolean> {
    if (value == null) {
      throw new Error(
        `${this.driverName}: clearing is not supported — the mobile entry dialog has no Clear action by default`
      );
    }
    const dialog = await this.openEntryDialog();
    await dialog.pickDay(value);
    await dialog.accept();
    await this.waitForEntryDialogClose();
    return true;
  }

  /**
   * Open the entry dialog (no-op when already open) and return its driver.
   */
  async openEntryDialog(): Promise<MobileDatePickerDialogDriver> {
    if (!(await this.interactor.exists(dialogLocator))) {
      await this.interactor.click(locatorUtil.append(this.locator, openPickerButtonLocator));
      await this.waitUntil({
        probeFn: () => this.interactor.exists(dialogLocator),
        terminateCondition: true,
        timeoutMs: 10000,
      });
    }
    return new MobileDatePickerDialogDriver(dialogLocator, this.interactor, this.commutableOption);
  }

  protected async waitForEntryDialogClose(timeoutMs: number = 10000): Promise<void> {
    await this.waitUntil({
      probeFn: () => this.interactor.exists(dialogLocator),
      terminateCondition: false,
      timeoutMs,
    });
  }

  get driverName(): string {
    return 'MuiV9MobileDatePicker';
  }
}
