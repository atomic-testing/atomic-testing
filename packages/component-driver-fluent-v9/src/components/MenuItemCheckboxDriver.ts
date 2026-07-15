import { MenuItemDriver } from './MenuItemDriver';

/**
 * Driver for a Fluent v9 `MenuItemCheckbox` (`role="menuitemcheckbox"`, classes
 * `fui-MenuItem fui-MenuItemCheckbox`) — DOM audit,
 * `@fluentui/react-components@9.74.3`.
 */
export class MenuItemCheckboxDriver extends MenuItemDriver {
  /** Whether the item is checked, read from `aria-checked`. */
  async isChecked(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-checked')) === 'true';
  }

  override get driverName(): string {
    return 'FluentV9MenuItemCheckboxDriver';
  }
}
