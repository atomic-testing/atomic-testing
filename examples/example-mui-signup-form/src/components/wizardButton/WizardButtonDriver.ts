import { ButtonDriver } from '@atomic-testing/component-driver-mui-v5';
import {
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
  byDataTestId
} from '@atomic-testing/core';
import { WizardButtonDataTestId } from './WizardButtonDataTestId';

const parts = {
  previous: {
    locator: byDataTestId(WizardButtonDataTestId.previousButton),
    driver: ButtonDriver
  },
  next: {
    locator: byDataTestId(WizardButtonDataTestId.nextButton),
    driver: ButtonDriver
  }
} satisfies ScenePart;

export class WizardButtonDriver extends ComponentDriver<typeof parts> {
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
    const nextDisabled = await this.isNextDisabled();
    if (nextDisabled) {
      throw new Error('Cannot click next because it is disabled');
    }
    await this.parts.next.click();
  }

  /**
   * Whether the next button is disabled
   * @returns
   */
  async isNextDisabled(): Promise<boolean> {
    await this.enforcePartExistence('next');
    return this.parts.next.isDisabled();
  }

  /**
   * Proceed to previous step if the previous button is enabled
   */
  async previous(): Promise<void> {
    const previousDisabled = await this.isPreviousDisabled();
    if (previousDisabled) {
      throw new Error('Cannot click next because it is disabled');
    }
    await this.parts.previous.click();
  }

  /**
   * Whether the previous button is disabled
   * @returns
   */
  async isPreviousDisabled(): Promise<boolean> {
    await this.enforcePartExistence('previous');
    return this.parts.previous.isDisabled();
  }

  get driverName(): string {
    return 'WizardButtonDriver';
  }
}
