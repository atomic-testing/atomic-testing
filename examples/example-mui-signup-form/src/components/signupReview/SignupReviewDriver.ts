import {
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
  byDataTestId
} from '@atomic-testing/core';
import { WizardButtonDriver } from '../wizardButton/WizardButtonDriver';
import { SignupReviewDataTestId } from './SignupReviewDataTestId';

const parts = {
  navigation: {
    locator: byDataTestId(SignupReviewDataTestId.navigation),
    driver: WizardButtonDriver
  }
} satisfies ScenePart;

export class SignupReviewDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts
    });
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
    return 'SignupReviewDriver';
  }
}
