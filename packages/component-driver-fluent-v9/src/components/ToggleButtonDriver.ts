import { IToggleDriver } from '@atomic-testing/core';

import { ButtonDriver } from './ButtonDriver';

/**
 * Driver for the Fluent v9 `ToggleButton` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): a native
 * `<button class="fui-Button fui-ToggleButton" aria-pressed="true|false">` —
 * same root as `Button`, plus the pressed state mirrored to `aria-pressed`
 * (there is no native "pressed" concept for a `<button>`, so ARIA is the only
 * portable read/write signal).
 */
export class ToggleButtonDriver extends ButtonDriver implements IToggleDriver {
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-pressed')) === 'true';
  }

  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.locator);
    }
  }

  override get driverName(): string {
    return 'FluentV9ToggleButtonDriver';
  }
}
