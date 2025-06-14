import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v5';
import {
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  PartLocator,
  ScenePart,
  byDataTestId,
  listHelper,
  locatorUtil
} from '@atomic-testing/core';
import { InterestModel } from '../../models/SignupModel';
import { WizardButtonDriver } from '../wizardButton/WizardButtonDriver';
import { InterestFormDataTestId } from './InterestFormDataTestId';

const parts = {
  errorDisplay: {
    locator: byDataTestId(InterestFormDataTestId.selectedInterestError),
    driver: HTMLElementDriver
  },
  interestToggle: {
    locator: byDataTestId(InterestFormDataTestId.interestToggle),
    driver: HTMLElementDriver
  },
  navigation: {
    locator: byDataTestId(InterestFormDataTestId.navigation),
    driver: WizardButtonDriver
  }
} satisfies ScenePart;

export class InterestFormDriver extends ComponentDriver<typeof parts> implements IInputDriver<InterestModel> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts
    });
  }

  async setValue(value: InterestModel): Promise<boolean> {
    this.enforcePartExistence('interestToggle');
    const { interestIds } = value;
    const interestIdSet = new Set(interestIds);
    const itemLocatorBase = locatorUtil.append(this.locator, byDataTestId(InterestFormDataTestId.interestToggle));
    for await (const interestCheckbox of listHelper.getListItemIterator(
      this,
      itemLocatorBase,
      // @ts-expect-error - A type bug in testing framework
      CheckboxDriver
    )) {
      const cbd: CheckboxDriver = interestCheckbox as unknown as CheckboxDriver;
      const value = await cbd.getValue();
      if (value != null) {
        await cbd.setSelected(interestIdSet.has(value));
      }
    }
    return true;
  }

  async getValue(): Promise<InterestModel> {
    this.enforcePartExistence('interestToggle');
    const interestIds: string[] = [];
    for await (const interestCheckbox of listHelper.getListItemIterator(
      this,
      this.parts.interestToggle.locator,
      // @ts-expect-error - A type bug in testing framework
      CheckboxDriver
    )) {
      const cbd: CheckboxDriver = interestCheckbox as unknown as CheckboxDriver;
      if (await cbd.isSelected()) {
        const value = await cbd.getValue();
        if (value != null) {
          interestIds.push(value);
        }
      }
    }
    return {
      interestIds
    };
  }

  /**
   * Gets all the fields error messages, returns a promise of an object
   * with the same shape as InterestModel, each field in the object
   * is the error message of the corresponding field
   * @returns
   */
  async getError(): Promise<{ interestIds?: string }> {
    if (await this.parts.errorDisplay.exists()) {
      const selectionError = await this.parts.errorDisplay.getText();
      return {
        interestIds: selectionError
      };
    }

    return {};
  }

  /**
   * Whether the form has any error
   * @returns
   */
  async hasError(): Promise<boolean> {
    const { interestIds } = await this.getError();
    return interestIds != null;
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
    return 'InterestFormDriver';
  }
}
