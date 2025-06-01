import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  contentDisplay: {
    locator: byCssClass('MuiBadge-badge'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for Material UI v5 Badge component.
 * @see https://mui.com/material-ui/react-badge/
 */
export class BadgeDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
    });
  }

  /**
   * Get the content of the badge.
   * @returns The content of the badge.
   */
  async getContent(): Promise<string | null> {
    await this.enforcePartExistence('contentDisplay');
    const content = await this.parts.contentDisplay.getText();
    return content ?? null;
  }

  override get driverName(): string {
    return 'MuiV7BadgeDriver';
  }
}
