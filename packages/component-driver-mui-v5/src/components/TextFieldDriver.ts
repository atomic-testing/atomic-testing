import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  IInteractor,
  LocatorChain,
  LocatorType,
  Optional,
  ScenePart,
} from '@atomic-testing/core';

import { SelectDriver } from './SelectDriver';

export const parts = {
  label: {
    locator: byCssClass('MuiFormLabel-root'),
    driver: HTMLElementDriver,
  },
  helperText: {
    locator: byCssClass('MuiFormHelperText-root'),
    driver: HTMLElementDriver,
  },
  singlelineInput: {
    locator: {
      type: LocatorType.Css,
      selector: 'input:not([aria-hidden])',
    },
    driver: HTMLTextInputDriver,
  },
  multilineInput: {
    locator: {
      type: LocatorType.Css,
      selector: 'textarea:not([aria-hidden])',
    },
    driver: HTMLTextInputDriver,
  },
  selectInput: {
    locator: byCssClass('MuiInputBase-root'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

enum TextFieldInputType {
  Singleline = 'singleLine',
  Multiline = 'multiline',
  Select = 'select',
}

/**
 * A driver for the Material UI v5 TextField component with single line or multiline text input.
 */
export class TextFieldDriver extends ComponentDriver<typeof parts> implements IInputDriver<string | null> {
  constructor(locator: LocatorChain, interactor: IInteractor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  private async getInputType(): Promise<TextFieldInputType> {
    // TODO: Detection of both input types can be done in parallel.
    const textInputExists = await this.interactor.exists(this.parts.singlelineInput.locator);
    if (textInputExists) {
      return TextFieldInputType.Singleline;
    }

    const selectInputExists = await this.parts.selectInput.exists();
    if (selectInputExists) {
      return TextFieldInputType.Select;
    }

    const multilineExists = await this.interactor.exists(this.parts.multilineInput.locator);
    if (multilineExists) {
      return TextFieldInputType.Multiline;
    }

    throw new Error('Unable to determine input type in TextFieldInput');
  }

  async getValue(): Promise<string | null> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case TextFieldInputType.Singleline:
        return this.parts.singlelineInput.getValue();
      case TextFieldInputType.Select:
        return this.parts.selectInput.getValue();
      case TextFieldInputType.Multiline:
        return this.parts.multilineInput.getValue();
    }
  }

  async setValue(value: string | null): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case TextFieldInputType.Singleline:
        return this.parts.singlelineInput.setValue(value);
      case TextFieldInputType.Select:
        return this.parts.selectInput.setValue(value);
      case TextFieldInputType.Multiline:
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
      case TextFieldInputType.Singleline:
        return this.parts.singlelineInput.isDisabled();
      case TextFieldInputType.Select:
        return this.parts.selectInput.isDisabled();
      case TextFieldInputType.Multiline:
        return this.parts.multilineInput.isDisabled();
    }
  }

  async isReadonly(): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case TextFieldInputType.Singleline:
        return this.parts.singlelineInput.isReadonly();
      case TextFieldInputType.Select:
        return this.interactor.hasCssClass(this.parts.selectInput.locator, 'MuiInputBase-readOnly');
      case TextFieldInputType.Multiline:
        return this.parts.multilineInput.isReadonly();
    }
  }

  get driverName(): string {
    return 'MU5TextFieldDriver';
  }
}
