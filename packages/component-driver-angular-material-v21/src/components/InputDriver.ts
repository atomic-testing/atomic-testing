import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  IInputDriver,
  Interactor,
  IReadonlyableDriver,
  IRequirableDriver,
  IValidatableDriver,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

export const inputParts = {
  // `matInput` is the public directive selector users write in their template
  // (`<input matInput>` / `<textarea matInput>`), so anchoring on the attribute
  // is contract, not internals.
  singlelineInput: {
    locator: byCssSelector('input[matInput]'),
    driver: HTMLTextInputDriver,
  },
  multilineInput: {
    locator: byCssSelector('textarea[matInput]'),
    driver: HTMLTextInputDriver,
  },
  // The hint/error messages render inside the form field's subscript area;
  // `mat-hint`/`mat-error` (and the `[matError]` attribute form) are the public
  // component selectors, stable unlike the wrapper's `.mat-mdc-*` classes.
  hint: {
    locator: byCssSelector('mat-hint'),
    driver: HTMLElementDriver,
  },
  error: {
    locator: byCssSelector('mat-error'),
    driver: HTMLElementDriver,
  },
  errorAttr: {
    locator: byCssSelector('[matError]'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

type InputType = 'singleLine' | 'multiline';

/**
 * Driver for an Angular Material text field: a `MatInput` control hosted in a
 * `MatFormField`.
 *
 * Locate it by the `<mat-form-field>` host element — the form field owns the
 * label, hint and error message DOM, while the value/disabled/required state
 * lives on the `matInput` control inside it.
 *
 * @see https://material.angular.dev/components/input
 * @see https://material.angular.dev/components/form-field
 */
export class InputDriver
  extends ComponentDriver<typeof inputParts>
  implements
    IInputDriver<string | null>,
    IDisableableDriver,
    IReadonlyableDriver,
    IRequirableDriver,
    IValidatableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: inputParts,
    });
  }

  /**
   * Whether the form field hosts a single-line `<input matInput>` or a
   * multiline `<textarea matInput>`.
   */
  async getInputType(): Promise<InputType> {
    if (await this.parts.singlelineInput.exists()) {
      return 'singleLine';
    }
    if (await this.parts.multilineInput.exists()) {
      return 'multiline';
    }
    throw new Error('Unable to determine the input type of the Angular Material form field');
  }

  private async getControl(): Promise<HTMLTextInputDriver> {
    return (await this.getInputType()) === 'singleLine' ? this.parts.singlelineInput : this.parts.multilineInput;
  }

  async getValue(): Promise<string | null> {
    return (await this.getControl()).getValue();
  }

  async setValue(value: string | null): Promise<boolean> {
    return (await this.getControl()).setValue(value);
  }

  /**
   * The text of the form field's `<mat-label>`, or `undefined` when the field
   * has none. The form field links its floating `<label>` to the control via
   * `for`↔`id`, so the driver resolves that link; the required-marker asterisk
   * is CSS-generated content and never part of the returned text.
   */
  async getLabel(): Promise<Optional<string>> {
    const control = await this.getControl();
    return resolveLinkedLabelText(this.interactor, control.locator);
  }

  /**
   * The text of the field's `<mat-hint>` (including one produced by the
   * `hintLabel` input), or `undefined` when no hint is shown. Material hides
   * the hint while an error message is displayed.
   */
  async getHintText(): Promise<Optional<string>> {
    if (await this.parts.hint.exists()) {
      return this.parts.hint.getText();
    }
    return undefined;
  }

  /**
   * The text of the field's error message (`<mat-error>` or the `[matError]`
   * attribute form), or `undefined` when the field is not showing an error.
   */
  async getErrorText(): Promise<Optional<string>> {
    if (await this.parts.error.exists()) {
      return this.parts.error.getText();
    }
    if (await this.parts.errorAttr.exists()) {
      return this.parts.errorAttr.getText();
    }
    return undefined;
  }

  /**
   * Whether the field is in the error state. The control signals it via
   * `aria-invalid="true"`; Material deliberately drops that attribute on an
   * empty required field, so a rendered error message also counts.
   */
  async isError(): Promise<boolean> {
    if (await (await this.getControl()).isError()) {
      return true;
    }
    return (await this.parts.error.exists()) || (await this.parts.errorAttr.exists());
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getControl()).isDisabled();
  }

  async isReadonly(): Promise<boolean> {
    return (await this.getControl()).isReadonly();
  }

  /**
   * Whether the field is required (Material reflects the control's `required`
   * state as both the native attribute and `aria-required`).
   */
  async isRequired(): Promise<boolean> {
    return (await this.getControl()).isRequired();
  }

  get driverName(): string {
    return 'AngularMaterialV21InputDriver';
  }
}
