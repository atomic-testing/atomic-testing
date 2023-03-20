import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for Material UI v5 Button component.
 * @see https://mui.com/material-ui/react-button/
 */
export class ButtonDriver extends HTMLButtonDriver {
  override get driverName(): string {
    return 'MuiV5ButtonDriver';
  }
}
