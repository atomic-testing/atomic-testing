import { ListItemDriver } from './ListItemDriver';

/**
 * @internal
 */
export class MenuItemDriver extends ListItemDriver {
  async value(): Promise<string | null> {
    const value = await this.interactor.getAttribute(this.locator, 'data-value');
    return value ?? null;
  }

  override get driverName(): string {
    return 'MuiV5MenuItemDriver';
  }
}
