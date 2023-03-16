import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  IInteractor,
  LocatorChain,
  LocatorType,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
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
} satisfies ScenePart;

enum TextFieldInputType {
  Singleline = 'singleLine',
  Multiline = 'multiline',
}

/**
 * A driver for the Material UI v5 Input, FilledInput, OutlinedInput, and StandardInput components.
 */
export class InputDriver extends ComponentDriver<typeof parts> implements IInputDriver<string | null> {
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
      case TextFieldInputType.Multiline:
        return this.parts.multilineInput.getValue();
    }
  }

  async setValue(value: string | null): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case TextFieldInputType.Singleline:
        return this.parts.singlelineInput.setValue(value);
      case TextFieldInputType.Multiline:
        return this.parts.multilineInput.setValue(value);
    }
  }

  async isDisabled(): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case TextFieldInputType.Singleline:
        return this.parts.singlelineInput.isDisabled();
      case TextFieldInputType.Multiline:
        return this.parts.multilineInput.isDisabled();
    }
  }

  async isReadonly(): Promise<boolean> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case TextFieldInputType.Singleline:
        return this.parts.singlelineInput.isReadonly();
      case TextFieldInputType.Multiline:
        return this.parts.multilineInput.isReadonly();
    }
  }

  get driverName(): string {
    return 'MU5InputDriver';
  }
}
