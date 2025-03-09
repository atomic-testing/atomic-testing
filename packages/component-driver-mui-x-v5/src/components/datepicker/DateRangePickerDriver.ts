import { byCssSelector, ComponentDriver, locatorUtil, PartLocator } from '@atomic-testing/core';

import { DateTimePickerDriver } from './DateTimePickerDriver';
import { DesktopDatePickerDriver } from './DesktopDatePickerDriver';
import { DesktopDatePickerDriverBase } from './DesktopDatePickerDriverBase';
import { TimePickerDriver } from './TimePickerDriver';
import { DateRangeInput, DateType } from './types';

const fromLocator = byCssSelector('.MuiFormControl-root:first-of-type');
const toLocator = byCssSelector('.MuiFormControl-root:last-of-type');

const inputTypeToDriver = {
  date: DesktopDatePickerDriver,
  time: TimePickerDriver,
  datetime: DateTimePickerDriver,
};

export class DateRangePickerDriver extends ComponentDriver {
  getDateInputDriver(locator: PartLocator, type: DateType = 'date'): DesktopDatePickerDriverBase | null {
    const driverClass = inputTypeToDriver[type];
    if (driverClass == null) {
      return null;
    }
    const partLocator = locatorUtil.append(this.locator, locator);
    const driver = new driverClass(partLocator, this.interactor, this.commutableOption);
    return driver;
  }

  async setValue(value: DateRangeInput): Promise<void> {
    const type: DateType = value.type ?? 'date';
    const fromDriver = this.getDateInputDriver(fromLocator, type);
    const toDriver = this.getDateInputDriver(toLocator, type);
    if (fromDriver != null && toDriver != null) {
      await fromDriver.setValue(value.start);
      await toDriver.setValue(value.end);
    }
  }

  async getValue(type: DateType = 'date'): Promise<DateRangeInput | null> {
    const fromDriver = this.getDateInputDriver(fromLocator, type);
    const toDriver = this.getDateInputDriver(toLocator, type);
    if (fromDriver != null && toDriver != null) {
      const start = await fromDriver.getValue();
      const end = await toDriver.getValue();
      return { start, end, type };
    }
    return null;
  }

  override get driverName(): string {
    return 'MuiV5DateRangePicker';
  }
}
