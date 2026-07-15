import { MenuItemDriver } from './MenuItemDriver';

/**
 * Driver for a Fluent v9 `MenuItemRadio` (`role="menuitemradio"`, classes
 * `fui-MenuItem fui-MenuItemRadio`) — DOM audit,
 * `@fluentui/react-components@9.74.3`.
 */
export class MenuItemRadioDriver extends MenuItemDriver {
  /** Whether the item is the selected option in its radio group, read from `aria-checked`. */
  async isChecked(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-checked')) === 'true';
  }

  override get driverName(): string {
    return 'FluentV9MenuItemRadioDriver';
  }
}
