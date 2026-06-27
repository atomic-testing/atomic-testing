import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for a single Material UI v7 BottomNavigationAction.
 *
 * Each action renders as a `<button>` (no explicit ARIA role); MUI marks the
 * active one with the `Mui-selected` state class, so selection is read from the
 * class while `getText`/`click`/`isDisabled` come from {@link HTMLButtonDriver}
 * and the base `ComponentDriver`.
 * @see https://mui.com/material-ui/react-bottom-navigation/
 */
export class BottomNavigationActionDriver extends HTMLButtonDriver {
  /**
   * Whether this action is selected (MUI applies the `Mui-selected` state class).
   */
  async isSelected(): Promise<boolean> {
    return this.interactor.hasCssClass(this.locator, 'Mui-selected');
  }

  override get driverName(): string {
    return 'MuiV5BottomNavigationActionDriver';
  }
}
