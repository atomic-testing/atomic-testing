import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
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
export class ChipDriver extends ComponentDriver<typeof parts> implements IDisableableDriver {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
    });
  }

  /**
   * Whether the chip is disabled. A Chip has no native form control; MUI marks the
   * disabled state with the `Mui-disabled` class on the chip root.
   */
  async isDisabled(): Promise<boolean> {
    return this.interactor.hasCssClass(this.locator, 'Mui-disabled');
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

  /**
   * Delete the chip via the keyboard: focus the chip root, then press `Backspace`.
   *
   * MUI fires `onDelete` for `Backspace`/`Delete` only when the keydown target is the
   * chip root itself — a code path distinct from {@link clickRemove}, which clicks the
   * cancel icon. Requires the chip to be deletable (rendered with `onDelete`, which
   * makes the root focusable). Focus is taken first so the key event originates from
   * the chip root.
   */
  async deleteViaKeyboard(): Promise<void> {
    await this.focus();
    await this.pressKey('Backspace');
  }

  override get driverName(): string {
    return 'MuiV7ChipDriver';
  }
}
