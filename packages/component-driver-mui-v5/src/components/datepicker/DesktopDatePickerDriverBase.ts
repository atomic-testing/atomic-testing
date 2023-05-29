import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  PartLocator,
  ScenePart,
  byTagName,
} from '@atomic-testing/core';
import { DatePickerCharacteristic } from './types';

const parts = {
  dateInput: {
    locator: byTagName('input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export abstract class DesktopDatePickerDriverBase
  extends ComponentDriver<typeof parts>
  implements IInputDriver<Date | null>
{
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    protected characteristic: DatePickerCharacteristic,
    option?: Partial<IComponentDriverOption>,
  ) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async setValue(value: Date | null): Promise<boolean> {
    await this.enforcePartExistence('dateInput');
    let textToEnter = '';
    if (value != null) {
      const format = await this.getFormat();
      textToEnter = this.characteristic.valueToTextEntry(value, format);
    }
    await this.interactor.enterText(this.parts.dateInput.locator, textToEnter);

    return true;
  }

  async getValue(): Promise<Date | null> {
    await this.enforcePartExistence('dateInput');
    const value = await this.interactor.getInputValue(this.parts.dateInput.locator);
    if (value != null) {
      const format = await this.getFormat();
      return this.characteristic.textEntryToValue(value, format);
    }
    return null;
  }

  async getFormat(defaultFormat: string = this.characteristic.defaultFormat): Promise<string> {
    const placeHolder = await this.parts.dateInput.getAttribute('placeholder');
    return placeHolder ?? defaultFormat;
  }
}
