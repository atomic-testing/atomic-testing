import { IToggleDriver } from '@atomic-testing/core';

import { ButtonDriver } from './ButtonDriver';

export class ToggleButtonDriver extends ButtonDriver implements IToggleDriver {
  async isSelected(): Promise<boolean> {
    const val = await this.interactor.getAttribute(this.locator, 'aria-pressed');
    return val === 'true';
  }

  async setSelected(targetState: boolean): Promise<void> {
    const currentState = await this.isSelected();
    if (currentState !== targetState) {
      await this.interactor.click(this.locator);
    }
  }

  override get driverName() {
    return 'ToggleButtonDriver';
  }
}
