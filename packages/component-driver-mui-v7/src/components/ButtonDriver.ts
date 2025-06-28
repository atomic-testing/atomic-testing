import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for Material UI v7 Button component.
 * @see https://mui.com/material-ui/react-button/
 */
export class ButtonDriver extends HTMLButtonDriver {
  async getValue(): Promise<string | null> {
    const val = await this.interactor.getAttribute(this.locator, 'value');
    return val ?? null;
  }

  override get driverName(): string {
    return 'MuiV7ButtonDriver';
  }
}
