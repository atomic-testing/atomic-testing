import { TextFieldDriver } from '@atomic-testing/component-driver-mui-v5';
import {
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
  byDataTestId
} from '@atomic-testing/core';
import { IInputDriver } from '@atomic-testing/core/src';
import { DeepPartial } from 'utility-types';
import { ShippingModel } from '../../models/SignupModel';
import { AddressEntryDriver } from '../addressEntry/AddressEntryDriver';
import { WizardButtonDriver } from '../wizardButton/WizardButtonDriver';
import { ShippingAddressFormDataTestId } from './ShippingAddressFormDataTestId';

const parts = {
  lastNameInput: {
    locator: byDataTestId(ShippingAddressFormDataTestId.lastNameInput),
    driver: TextFieldDriver
  },
  firstNameInput: {
    locator: byDataTestId(ShippingAddressFormDataTestId.firstNameInput),
    driver: TextFieldDriver
  },
  addressInput: {
    locator: byDataTestId(ShippingAddressFormDataTestId.addressInput),
    driver: AddressEntryDriver
  },
  navigation: {
    locator: byDataTestId(ShippingAddressFormDataTestId.navigation),
    driver: WizardButtonDriver
  }
} satisfies ScenePart;

export class ShippingAddressFormDriver extends ComponentDriver<typeof parts> implements IInputDriver<ShippingModel> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts
    });
  }

  async setValue(value: ShippingModel): Promise<boolean> {
    await this.enforcePartExistence(['lastNameInput', 'firstNameInput', 'addressInput']);
    await this.parts.lastNameInput.setValue(value.lastName);
    await this.parts.firstNameInput.setValue(value.firstName);
    await this.parts.addressInput.setValue(value.address);

    return true;
  }

  async getValue(): Promise<ShippingModel> {
    await this.enforcePartExistence(['lastNameInput', 'firstNameInput', 'addressInput']);
    return Promise.all([
      this.parts.lastNameInput.getValue(),
      this.parts.firstNameInput.getValue(),
      this.parts.addressInput.getValue()
    ]).then(([lastName, firstName, address]) => {
      return {
        lastName: lastName ?? '',
        firstName: firstName ?? '',
        address
      };
    });
  }

  async getLastNameError(): Promise<string | undefined> {
    await this.enforcePartExistence('lastNameInput');
    return this.parts.lastNameInput.getHelperText();
  }

  async getFirstNameError(): Promise<string | undefined> {
    await this.enforcePartExistence('firstNameInput');
    return this.parts.firstNameInput.getHelperText();
  }

  async getAddressError(): ReturnType<typeof AddressEntryDriver.prototype.getError> {
    await this.enforcePartExistence('addressInput');
    return this.parts.addressInput.getError();
  }

  /**
   * Gets all the fields error messages, returns a promise of an object
   * with the same shape as ShippingModel, each field in the object
   * is the error message of the corresponding field
   * @returns
   */
  async getError(): Promise<DeepPartial<ShippingModel>> {
    return Promise.all([this.getLastNameError(), this.getFirstNameError(), this.getAddressError()]).then(
      ([lastName, firstName, address]) => ({
        lastName,
        firstName,
        address
      })
    );
  }

  /**
   * Whether the form has any error
   * @returns
   */
  async hasError(): Promise<boolean> {
    const hasAddressError = await this.parts.addressInput.hasError();
    if (hasAddressError) {
      return true;
    }

    const error = await this.getError();
    return error.firstName != null || error.lastName != null;
  }

  /**
   * Proceed to next step if the next button is enabled
   */
  async next(): Promise<void> {
    await this.enforcePartExistence('navigation');
    await this.parts.navigation.next();
  }

  /**
   * Proceed to previous step if the previous button is enabled
   */
  async previous(): Promise<void> {
    await this.enforcePartExistence('navigation');
    await this.parts.navigation.previous();
  }

  get driverName(): string {
    return 'ShippingAddressFormDriver';
  }
}
