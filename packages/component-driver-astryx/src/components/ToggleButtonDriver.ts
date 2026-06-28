import { IToggleDriver } from '@atomic-testing/core';

import { ButtonDriver } from './ButtonDriver';

/**
 * Driver for the Astryx ToggleButton (`@astryxdesign/core/ToggleButton`).
 *
 * ToggleButton renders a native `<button>` that reports its on/off state through
 * `aria-pressed` and always sets an explicit `aria-label` (so `getLabel` is
 * reliable even though the visible text is duplicated for width reservation).
 * Selection is toggled by clicking — mirrors the MUI `ToggleButtonDriver`.
 */
export class ToggleButtonDriver extends ButtonDriver implements IToggleDriver {
  /** Whether the toggle is pressed (`aria-pressed="true"`). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-pressed')) === 'true';
  }

  /** Click to reach `selected` when not already there. */
  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  override get driverName(): string {
    return 'AstryxToggleButtonDriver';
  }
}
