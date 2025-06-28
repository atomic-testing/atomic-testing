import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  contentDisplay: {
    locator: byCssClass('MuiChip-label'),
    driver: HTMLElementDriver,
  },
  removeButton: {
    locator: byDataTestId('CancelIcon'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for Material UI v7 Chip component.
 * @see https://mui.com/material-ui/react-chip/
 */
export class ChipDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
    });
  }

  /**
   * Get the label content of the chip.
   * @returns The label text content of the chip.
   */
  async getLabel(): Promise<string | null> {
    await this.enforcePartExistence('contentDisplay');
    const content = await this.parts.contentDisplay.getText();
    return content ?? null;
  }

  async clickRemove(): Promise<void> {
    await this.enforcePartExistence('removeButton');
    await this.parts.removeButton.click();
  }

  override get driverName(): string {
    return 'MuiV7ChipDriver';
  }
}
