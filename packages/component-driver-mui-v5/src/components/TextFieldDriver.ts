import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byRole,
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { SelectDriver } from './SelectDriver';

export const parts = {
  label: {
    locator: byCssSelector('>label'),
    driver: HTMLElementDriver,
  },
  helperText: {
    locator: byCssSelector('>p'),
    driver: HTMLElementDriver,
  },
  singlelineInput: {
    locator: byCssSelector('input:not([aria-hidden])'),
    driver: HTMLTextInputDriver,
  },
  multilineInput: {
    locator: byCssSelector('textarea:not([aria-hidden])'),
    driver: HTMLTextInputDriver,
  },
  selectInput: {
    locator: byCssSelector('>div'),
    driver: SelectDriver,
  },
  // Used to detect the presence of select input
  richSelectInputDetect: {
    locator: byRole('combobox'),
    driver: HTMLElementDriver,
  },
  nativeSelectInputDetect: {
    locator: byTagName('SELECT'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

type TextFieldInputType = 'singleLine' | 'multiline' | 'select';

/**
 * A driver for the Material UI v5 TextField component with single line or multiline text input.
 */
export class TextFieldDriver extends ComponentDriver<typeof parts> implements IInputDriver<string | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  private async getInputType(): Promise<TextFieldInputType> {
    const result = await Promise.all([
      this.parts.singlelineInput.exists(),
      this.parts.richSelectInputDetect.exists(),
      this.parts.nativeSelectInputDetect.exists(),
      this.parts.multilineInput.exists(),
    ]).then(([singlelineExists, richSelectExists, nativeSelectExists, multilineExists]) => {
      if (singlelineExists) {
        return 'singleLine';
      }
      if (richSelectExists || nativeSelectExists) {
        return 'select';
      }
      if (multilineExists) {
        return 'multiline';
      }

      throw new Error('Unable to determine input type in TextFieldInput');
    });

    return result;
  }

  async getValue(): Promise<string | null> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case 'singleLine':
        return this.parts.singlelineInput.getValue();
      case 'select':
        return this.parts.selectInput.getValue();
      case 'multiline':
        return this.parts.multilineInput.getValue();
    }
  }

  async setValue(value: string | null): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case 'singleLine':
        return this.parts.singlelineInput.setValue(value);
      case 'select':
        return this.parts.selectInput.setValue(value);
      case 'multiline':
        return this.parts.multilineInput.setValue(value);
    }
  }

  async getLabel(): Promise<Optional<string>> {
    return this.parts.label.getText();
  }

  async getHelperText(): Promise<Optional<string>> {
    const helperTextExists = await this.interactor.exists(this.parts.helperText.locator);
    if (helperTextExists) {
      return this.parts.helperText.getText();
    }
  }

  async isDisabled(): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case 'singleLine':
        return this.parts.singlelineInput.isDisabled();
      case 'select':
        return this.parts.selectInput.isDisabled();
      case 'multiline':
        return this.parts.multilineInput.isDisabled();
    }
  }

  async isReadonly(): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case 'singleLine':
        return this.parts.singlelineInput.isReadonly();
      case 'select':
        return this.interactor.hasCssClass(this.parts.selectInput.locator, 'MuiInputBase-readOnly');
      case 'multiline':
        return this.parts.multilineInput.isReadonly();
    }
  }

  get driverName(): string {
    return 'MuiV5TextFieldDriver';
  }
}
