import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
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
export class BadgeDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
      content: (option?.content ?? {}) as ContentT,
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
    return 'MuiV5BadgeDriver';
  }
}
