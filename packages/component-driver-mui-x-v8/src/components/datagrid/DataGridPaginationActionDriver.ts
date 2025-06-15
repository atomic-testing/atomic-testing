import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import {
  byAttribute,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

const parts = {
  previousButton: {
    locator: byAttribute('aria-label', 'Go to previous page'),
    driver: HTMLButtonDriver,
  },
  nextButton: {
    locator: byAttribute('aria-label', 'Go to next page'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

/**
 * Driver for Material UI v6 DataGridPro component.
 * @see https://mui.com/x/react-data-grid/
 */
export class DataGridPaginationActionDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async isPreviousPageEnabled(): Promise<boolean> {
    await this.enforcePartExistence('previousButton');
    const isDisabled = await this.parts.previousButton.isDisabled();
    return !isDisabled;
  }

  async gotoPreviousPage(): Promise<void> {
    await this.enforcePartExistence('previousButton');
    await this.parts.previousButton.click();
  }

  async isNextPageEnabled(): Promise<boolean> {
    await this.enforcePartExistence('nextButton');
    const isDisabled = await this.parts.nextButton.isDisabled();
    return !isDisabled;
  }

  async gotoNextPage(): Promise<void> {
    await this.enforcePartExistence('nextButton');
    await this.parts.nextButton.click();
  }

  override get driverName(): string {
    return 'MuiV8DataGridPaginationActionDriver';
  }
}
