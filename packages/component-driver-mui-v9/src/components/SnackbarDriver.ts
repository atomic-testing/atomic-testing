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
    locator: byCssClass('MuiSnackbarContent-message'),
    driver: HTMLElementDriver,
  },
  actionArea: {
    locator: byCssClass('MuiSnackbarContent-action'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for Material UI v9 Snackbar component.
 *
 * Content passed to the `action` prop is the scene's, not this driver's: reach it
 * with `snackbar.parts.actionArea.within(parts)`, which anchors an ordinary
 * `ScenePart` inside `.MuiSnackbarContent-action`. A bespoke `getActionComponent`
 * accessor previously did this one locator + one driver class at a time; it was
 * removed in favor of the general mechanism (ADR-019).
 *
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

  override get driverName(): string {
    return 'MuiV9SnackbarDriver';
  }
}
