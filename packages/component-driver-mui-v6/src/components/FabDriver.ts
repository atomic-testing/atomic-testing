import { ButtonDriver } from './ButtonDriver';

/**
 * Driver for Material UI v5 Floating Action Button component.
 * @see https://mui.com/material-ui/react-floating-action-button/
 */
export class FabDriver extends ButtonDriver {
  override get driverName(): string {
    return 'MuiV6FabDriver';
  }
}
