import { SwitchDriver } from '@atomic-testing/component-driver-mui-v5';
import {
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  PartLocator,
  ScenePart,
  byDataTestId
} from '@atomic-testing/core';

import { DeepPartial } from 'utility-types';
import { AddressModel } from '../../models/Address';
import { BillingModel } from '../../models/SignupModel';
import { AddressEntryDriver } from '../addressEntry/AddressEntryDriver';
import { WizardButtonDriver } from '../wizardButton/WizardButtonDriver';
import { BillingAddressFormDataTestId } from './BillingAddressFormDataTestId';

const parts = {
  sameAsShipping: {
    locator: byDataTestId(BillingAddressFormDataTestId.sameAsShippingInput),
    driver: SwitchDriver
  },
  billingAddress: {
    locator: byDataTestId(BillingAddressFormDataTestId.billingAddressInput),
    driver: AddressEntryDriver
  },
  navigation: {
    locator: byDataTestId(BillingAddressFormDataTestId.navigation),
    driver: WizardButtonDriver
  }
} satisfies ScenePart;

export class BillingAddressFormDriver extends ComponentDriver<typeof parts> implements IInputDriver<BillingModel> {
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
  async setValue(value: BillingModel): Promise<boolean> {
    await this.enforcePartExistence(['sameAsShipping', 'billingAddress']);
    await this.parts.sameAsShipping.setSelected(value.sameAsShipping);
    await this.parts.billingAddress.setValue(value.address);
    return true;
  }

  /**
   * Get the value of the billing, returns a promise of the billing model
   * @returns
   */
  async getValue(): Promise<BillingModel> {
    await this.enforcePartExistence(['sameAsShipping', 'billingAddress']);
    return Promise.all([this.parts.sameAsShipping.isSelected(), this.parts.billingAddress.getValue()]).then(
      ([sameAsShipping, address]) => {
        return {
          sameAsShipping,
          address
        };
      }
    );
  }

  /**
   * Toggle off switch to use the same address as the shipping address
   * and populate the billing address form with the given address
   * @param address
   */
  async useDifferentBillAddress(address: Readonly<AddressModel>): Promise<void> {
    await this.enforcePartExistence(['sameAsShipping', 'billingAddress']);
    await this.parts.sameAsShipping.setSelected(false);
    await this.parts.billingAddress.setValue(address);
  }

  /**
   * Toggle on switch to use the same address as the shipping address
   */
  async useSameBillAddress(): Promise<void> {
    await this.enforcePartExistence(['sameAsShipping']);
    await this.parts.sameAsShipping.setSelected(true);
  }

  async isAddressDisabled(): Promise<boolean> {
    await this.enforcePartExistence(['billingAddress']);
    return this.parts.billingAddress.isDisabled();
  }

  async getAddressError(): ReturnType<typeof AddressEntryDriver.prototype.getError> {
    await this.enforcePartExistence('billingAddress');
    return this.parts.billingAddress.getError();
  }

  /**
   * Gets all the fields error messages, returns a promise of an object
   * with the same shape as BillingModel, each field in the object
   * is the error message of the corresponding field
   * @returns
   */
  async getError(): Promise<DeepPartial<BillingModel>> {
    return Promise.all([this.getAddressError()]).then(([address]) => ({
      address
    }));
  }

  /**
   * Whether the form has any error
   * @returns
   */
  async hasError(): Promise<boolean> {
    const isAddressDisabled = await this.isAddressDisabled();
    if (isAddressDisabled) {
      return false;
    }
    const hasAddressError = await this.parts.billingAddress.hasError();
    return hasAddressError;
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
    return 'BillingAddressFormDriver';
  }
}
