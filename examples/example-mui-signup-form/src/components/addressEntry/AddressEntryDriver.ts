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
import { AddressModel } from '../../models/Address';
import { AddressEntryDataTestId } from './AddressEntryDataTestId';

const parts = {
  addressInput: {
    locator: byDataTestId(AddressEntryDataTestId.addressInput),
    driver: TextFieldDriver
  },
  cityInput: {
    locator: byDataTestId(AddressEntryDataTestId.cityInput),
    driver: TextFieldDriver
  },
  stateInput: {
    locator: byDataTestId(AddressEntryDataTestId.stateInput),
    driver: TextFieldDriver
  },
  zipInput: {
    locator: byDataTestId(AddressEntryDataTestId.zipInput),
    driver: TextFieldDriver
  }
} satisfies ScenePart;

export class AddressEntryDriver extends ComponentDriver<typeof parts> implements IInputDriver<AddressModel> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts
    });
  }

  /**
   * Populate the address form with the given value regardless of the
   * correctness of the value.
   * @param value
   * @returns
   */
  async setValue(value: AddressModel): Promise<boolean> {
    await this.enforcePartExistence(['addressInput', 'cityInput', 'stateInput', 'zipInput']);
    await this.parts.addressInput.setValue(value.address);
    await this.parts.cityInput.setValue(value.city);
    await this.parts.zipInput.setValue(value.zip);
    await this.parts.stateInput.setValue(value.state);
    return true;
  }

  /**
   * Get the value of the address entry, returns a promise of the address model
   * @returns
   */
  async getValue(): Promise<AddressModel> {
    await this.enforcePartExistence(['addressInput', 'cityInput', 'stateInput', 'zipInput']);
    return Promise.all([
      this.parts.addressInput.getValue(),
      this.parts.cityInput.getValue(),
      this.parts.stateInput.getValue(),
      this.parts.zipInput.getValue()
    ]).then(([address, city, state, zip]) => ({
      address: address ?? '',
      city: city ?? '',
      state: state ?? '',
      zip: zip ?? ''
    }));
  }

  async getAddressError(): Promise<string | undefined> {
    await this.enforcePartExistence('addressInput');
    return this.parts.addressInput.getHelperText();
  }

  async getCityError(): Promise<string | undefined> {
    await this.enforcePartExistence('cityInput');
    return this.parts.cityInput.getHelperText();
  }

  async getStateError(): Promise<string | undefined> {
    await this.enforcePartExistence('stateInput');
    return this.parts.stateInput.getHelperText();
  }

  async getZipError(): Promise<string | undefined> {
    await this.enforcePartExistence('zipInput');
    return this.parts.zipInput.getHelperText();
  }

  /**
   * Gets all the fields error message, returns a promise of an object
   * with the same shape as the AddressModel, each field in the object
   * is the error message of the corresponding field.
   * @returns
   */
  async getError(): Promise<Partial<AddressModel>> {
    return Promise.all([this.getAddressError(), this.getCityError(), this.getStateError(), this.getZipError()]).then(
      ([addressError, cityError, stateError, zipError]) => ({
        address: addressError,
        city: cityError,
        state: stateError,
        zip: zipError
      })
    );
  }

  /**
   * Whether the address form has any error
   * @returns
   */
  async hasError(): Promise<boolean> {
    const error = await this.getError();
    return error.address != null || error.city != null || error.state != null || error.zip != null;
  }

  /**
   * Whether form is disabled
   */
  async isDisabled(): Promise<boolean> {
    await this.enforcePartExistence('addressInput');
    const isDisabled = await this.parts.addressInput.isDisabled();
    return isDisabled;
  }

  get driverName(): string {
    return 'AddressEntryDriver';
  }
}
