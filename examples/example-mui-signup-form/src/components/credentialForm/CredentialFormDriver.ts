import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import {
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  PartLocator,
  ScenePart,
  byDataTestId
} from '@atomic-testing/core';
import { WizardButtonDriver } from '../wizardButton/WizardButtonDriver';
import { CredentialFormDataTestId } from './CredentialFormDataTestId';

const parts = {
  emailInput: {
    locator: byDataTestId(CredentialFormDataTestId.emailInput),
    driver: TextFieldDriver
  },
  passwordInput: {
    locator: byDataTestId(CredentialFormDataTestId.passwordInput),
    driver: TextFieldDriver
  },
  confirmPasswordInput: {
    locator: byDataTestId(CredentialFormDataTestId.confirmPasswordInput),
    driver: TextFieldDriver
  },
  birthdayInput: {
    locator: byDataTestId(CredentialFormDataTestId.birthdayInput),
    driver: TextFieldDriver
  },
  navigation: {
    locator: byDataTestId(CredentialFormDataTestId.navigation),
    driver: WizardButtonDriver
  }
} satisfies ScenePart;

export interface CredentialFormValue {
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
}

export class CredentialFormDriver extends ComponentDriver<typeof parts> implements IInputDriver<CredentialFormValue> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts
    });
  }

  async setValue(value: CredentialFormValue): Promise<boolean> {
    await this.enforcePartExistence(['emailInput', 'emailInput', 'confirmPasswordInput', 'birthdayInput']);
    await this.parts.emailInput.setValue(value.email);
    await this.parts.passwordInput.setValue(value.password);
    await this.parts.confirmPasswordInput.setValue(value.confirmPassword);
    await this.parts.birthdayInput.setValue(value.birthday);
    return true;
  }

  async getValue(): Promise<CredentialFormValue> {
    await this.enforcePartExistence(['emailInput', 'emailInput', 'confirmPasswordInput', 'birthdayInput']);
    return Promise.all([
      this.parts.emailInput.getValue(),
      this.parts.passwordInput.getValue(),
      this.parts.confirmPasswordInput.getValue(),
      this.parts.birthdayInput.getValue()
    ]).then(([email, password, confirmPassword, birthday]) => ({
      email: email ?? '',
      password: password ?? '',
      confirmPassword: confirmPassword ?? '',
      birthday: birthday ?? ''
    }));
  }

  async getEmailError(): Promise<string | undefined> {
    await this.enforcePartExistence(['emailInput']);
    return this.parts.emailInput.getHelperText();
  }

  async getPasswordError(): Promise<string | undefined> {
    await this.enforcePartExistence(['passwordInput']);
    return this.parts.passwordInput.getHelperText();
  }

  async getConfirmPasswordError(): Promise<string | undefined> {
    await this.enforcePartExistence(['confirmPasswordInput']);
    return this.parts.confirmPasswordInput.getHelperText();
  }

  async getBirthdayError(): Promise<string | undefined> {
    await this.enforcePartExistence(['birthdayInput']);
    return this.parts.birthdayInput.getHelperText();
  }

  /**
   * Gets all the fields error messages, return a promise of an object
   * with the same shape as the CredentialFormValue, each field in the object
   * is the error message of the corresponding field.
   * @returns
   */
  async getError(): Promise<Partial<CredentialFormValue>> {
    return Promise.all([
      this.getEmailError(),
      this.getPasswordError(),
      this.getConfirmPasswordError(),
      this.getBirthdayError()
    ]).then(([emailError, passwordError, confirmPasswordError, birthdayError]) => ({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      birthday: birthdayError
    }));
  }

  /**
   * Whether the form has any error
   * @returns
   */
  async hasError(): Promise<boolean> {
    const error = await this.getError();
    return error.email != null || error.password != null || error.confirmPassword != null || error.birthday != null;
  }

  /**
   * Proceed to next step if the next button is enabled
   */
  async next(): Promise<void> {
    await this.enforcePartExistence('navigation');
    await this.parts.navigation.next();
  }

  get driverName(): string {
    return 'CredentialFormDriver';
  }
}
