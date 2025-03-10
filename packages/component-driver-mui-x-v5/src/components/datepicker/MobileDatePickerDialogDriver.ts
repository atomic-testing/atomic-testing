import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { ButtonDriver } from '@atomic-testing/component-driver-mui-v5';
import {
  byAttribute,
  byCssClass,
  byCssSelector,
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { dateToTextEntry, textEntryToDate } from './dateUtil';

const parts = {
  editButton: {
    locator: byCssClass('MuiPickersToolbar-root').chain(byAttribute('type', 'button')),
    driver: ButtonDriver,
  },
  dateInput: {
    locator: byTagName('input'),
    driver: HTMLTextInputDriver,
  },
  cancelButton: {
    // Cancel button is the 1st button in the toolbar's DOM
    locator: byCssClass('MuiDialogActions-root').chain(byCssSelector('button:nth-of-type(1)')),
    driver: ButtonDriver,
  },
  submitButton: {
    // OK button is the 2nd button in the toolbar's DOM
    locator: byCssClass('MuiDialogActions-root').chain(byCssSelector('button:nth-of-type(2)')),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export class MobileDatePickerDialogDriver extends ComponentDriver<typeof parts> implements IInputDriver<Date | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async enterManualEditMode(): Promise<void> {
    const inputExists = await this.parts.dateInput.exists();
    if (inputExists) {
      return;
    }
    await this.enforcePartExistence('editButton');
    await this.parts.editButton.click();
    await this.parts.dateInput.waitUntilComponentState({ timeoutMs: 250 });
  }

  async getValue(): Promise<Date | null> {
    await this.enterManualEditMode();
    const value = await this.interactor.getInputValue(this.parts.dateInput.locator);
    let result: Date | null = null;
    if (value != null) {
      const format = await this.getFormat();
      result = textEntryToDate(value, format);
    }
    await this.parts.cancelButton.click();
    return result;
  }

  async setValue(value: Date | null): Promise<boolean> {
    await this.enterManualEditMode();
    let textToEnter = '';
    if (value != null) {
      const format = await this.getFormat();
      textToEnter = dateToTextEntry(value, format);
    }
    await this.interactor.enterText(this.parts.dateInput.locator, textToEnter);
    await this.parts.submitButton.click();
    return true;
  }

  async getFormat(defaultFormat: string = 'mm/dd/yyyy'): Promise<string> {
    const placeHolder = await this.parts.dateInput.getAttribute('placeholder');
    return placeHolder ?? defaultFormat;
  }

  get driverName(): string {
    return 'MuiV5MobileDateDialogPicker';
  }
}
