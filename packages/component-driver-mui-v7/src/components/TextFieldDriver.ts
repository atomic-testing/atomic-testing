import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byRole,
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  IRequirableDriver,
  IValidatableDriver,
  locatorUtil,
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
 * A driver for the Material UI v7 TextField component with single line or multiline text input.
 */
export class TextFieldDriver
  extends ComponentDriver<typeof parts>
  implements IInputDriver<string | null>, IRequirableDriver, IValidatableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async getInputType(): Promise<TextFieldInputType> {
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

  /**
   * Locator of the element that carries the native validation attributes
   * (`required`, `aria-invalid`, `placeholder`). For text/multiline that is the
   * visible input/textarea; for a select TextField it is the hidden value input.
   */
  private async getValueInputLocator(): Promise<PartLocator> {
    const inputType = await this.getInputType();
    switch (inputType) {
      case 'singleLine':
        return this.parts.singlelineInput.locator;
      case 'multiline':
        return this.parts.multilineInput.locator;
      case 'select':
        return locatorUtil.append(this.locator, byCssSelector('input'));
    }
  }

  /**
   * Whether the field is required. MUI sets the native `required` attribute on the
   * underlying input (present with an empty value), so a first-class accessor saves
   * consumers from reaching into the nested input themselves.
   */
  async isRequired(): Promise<boolean> {
    const locator = await this.getValueInputLocator();
    return (await this.interactor.getAttribute(locator, 'required')) != null;
  }

  /**
   * Whether the field is in the error state. MUI's `error` prop sets
   * `aria-invalid="true"` on the underlying input.
   */
  async isError(): Promise<boolean> {
    const locator = await this.getValueInputLocator();
    return (await this.interactor.getAttribute(locator, 'aria-invalid')) === 'true';
  }

  /**
   * The input's placeholder text, or `undefined` when none is set.
   */
  async getPlaceholder(): Promise<Optional<string>> {
    const locator = await this.getValueInputLocator();
    return (await this.interactor.getAttribute(locator, 'placeholder')) ?? undefined;
  }

  get driverName(): string {
    return 'MuiV7TextFieldDriver';
  }
}
