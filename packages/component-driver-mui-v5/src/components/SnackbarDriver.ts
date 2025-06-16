import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';
import { ComponentDriverClass } from '@atomic-testing/core';

export const parts = {
  contentDisplay: {
    locator: byCssClass('MuiSnackbarContent-message'),
    driver: HTMLElementDriver,
  },
  actionArea: {
    locator: byCssClass('MuiSnackbarContent-action'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for Material UI v5 Snackbar component.
 * @see https://mui.com/material-ui/react-snackbar/
 */
export class SnackbarDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
    });
  }

  /**
   * Get the label content of the snackbar.
   * @returns The label text content of the snackbar.
   */
  async getLabel(): Promise<string | null> {
    await this.enforcePartExistence('contentDisplay');
    const content = await this.parts.contentDisplay.getText();
    return content ?? null;
  }

  /**
   * Get a driver instance of a component in the action area of the snackbar.
   * @param locator
   * @param driverClass
   * @returns
   */
  async getActionComponent<ItemClass extends ComponentDriver>(
    locator: PartLocator,
    driverClass: ComponentDriverClass<ItemClass>
  ): Promise<ItemClass | null> {
    await this.enforcePartExistence('actionArea');
    const componentLocator = locatorUtil.append(this.parts.actionArea.locator, locator);
    const exists = await this.interactor.exists(componentLocator);
    if (exists) {
      return new driverClass(componentLocator, this.interactor, this.commutableOption);
    }
    return null;
  }

  override get driverName(): string {
    return 'MuiV5SnackbarDriver';
  }
}
