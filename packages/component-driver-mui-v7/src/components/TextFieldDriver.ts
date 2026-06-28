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
  // The required-field asterisk renders as a `.MuiFormLabel-asterisk` span *inside*
  // the `<label>`; tracked separately so getLabel can subtract it from the label text.
  labelAsterisk: {
    locator: byCssSelector('>label .MuiFormLabel-asterisk'),
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
 * A driver for the Material UI v7 TextField component with single line or multiline text input.
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
    const label = await this.parts.label.getText();
    if (label == null) {
      return label;
    }
    // A required field appends a `.MuiFormLabel-asterisk` span (" *") to the label text;
    // strip it so getLabel returns just the field's label (e.g. "Email", not "Email *").
    // Guard with exists() first — reading text off an absent node auto-waits to the
    // timeout in Playwright (jsdom returns undefined immediately).
    if (await this.interactor.exists(this.parts.labelAsterisk.locator)) {
      const asterisk = await this.parts.labelAsterisk.getText();
      if (asterisk != null && asterisk !== '' && label.endsWith(asterisk)) {
        return label.slice(0, label.length - asterisk.length).trim();
      }
    }
    return label.trim();
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
    return 'MuiV7TextFieldDriver';
  }
}
