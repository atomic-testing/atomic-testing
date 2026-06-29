import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { IDisableableDriver } from '@atomic-testing/core';

/**
 * Driver for Material UI v6 Button component.
 * @see https://mui.com/material-ui/react-button/
 */
export class ButtonDriver extends HTMLButtonDriver implements IDisableableDriver {
  async getValue(): Promise<string | null> {
    const val = await this.interactor.getAttribute(this.locator, 'value');
    return val ?? null;
  }

  /**
   * Whether the button is disabled. A MUI Button rendered as a `<button>` carries the
   * native `disabled` attribute, but as an anchor/link-button (`href`) it cannot — it
   * uses `aria-disabled` + the `Mui-disabled` class instead. Check all three so a
   * visibly-disabled link button is not reported as enabled.
   */
  override async isDisabled(): Promise<boolean> {
    const [nativeDisabled, ariaDisabled, muiDisabled] = await Promise.all([
      this.interactor.getAttribute(this.locator, 'disabled'),
      this.interactor.getAttribute(this.locator, 'aria-disabled'),
      this.interactor.hasCssClass(this.locator, 'Mui-disabled'),
    ]);
    return nativeDisabled != null || ariaDisabled === 'true' || muiDisabled;
  }

  /**
   * Whether the button is in the loading state. MUI v6 moved `loading` into the core
   * Button, which adds the `MuiButton-loading` class and a `.MuiButton-loadingIndicator`.
   */
  async isLoading(): Promise<boolean> {
    return this.interactor.hasCssClass(this.locator, 'MuiButton-loading');
  }

  override get driverName(): string {
    return 'MuiV6ButtonDriver';
  }
}
