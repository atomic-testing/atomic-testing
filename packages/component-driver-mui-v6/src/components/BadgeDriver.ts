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
 * Driver for Material UI v6 Badge component.
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

  /**
   * Whether the badge bubble is currently hidden. The `.MuiBadge-badge` node is always
   * mounted (so inherited `isVisible`/`getContent` cannot distinguish shown from hidden);
   * MUI toggles visibility with the `MuiBadge-invisible` class.
   */
  async isInvisible(): Promise<boolean> {
    return this.interactor.hasCssClass(this.parts.contentDisplay.locator, 'MuiBadge-invisible');
  }

  /**
   * Whether the badge bubble is currently shown (the badge node exists and is not
   * marked invisible).
   */
  async isBadgeVisible(): Promise<boolean> {
    const exists = await this.interactor.exists(this.parts.contentDisplay.locator);
    if (!exists) {
      return false;
    }
    return !(await this.isInvisible());
  }

  /**
   * Whether the badge is a dot variant (`variant="dot"` → `MuiBadge-dot`), which renders
   * a marker with no content.
   */
  async isDot(): Promise<boolean> {
    return this.interactor.hasCssClass(this.parts.contentDisplay.locator, 'MuiBadge-dot');
  }

  override get driverName(): string {
    return 'MuiV6BadgeDriver';
  }
}
