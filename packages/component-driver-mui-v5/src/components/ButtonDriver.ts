import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

export class ButtonDriver extends HTMLButtonDriver {
  override get driverName(): string {
    return 'MuiV5ButtonDriver';
  }
}
