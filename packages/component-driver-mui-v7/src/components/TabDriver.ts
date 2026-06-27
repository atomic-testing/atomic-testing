import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for a single Material UI v7 Tab.
 *
 * A `<Tab>` renders as a `<button role="tab">`; MUI marks the active one with
 * `aria-selected="true"` and renders a real `disabled` button when disabled, so
 * selection and disabled state are read straight off the accessible attributes
 * (`isDisabled` is inherited from {@link HTMLButtonDriver}; `getText`/`click` from
 * the base `ComponentDriver`).
 *
 * Unlike a toggle button this is intentionally not an `IToggleDriver`: a tab can
 * be selected but not toggled off (selecting another tab deselects it), so only
 * `isSelected`/`select` are exposed.
 * @see https://mui.com/material-ui/react-tabs/
 */
export class TabDriver extends HTMLButtonDriver {
  /**
   * Whether this tab is the selected one, i.e. MUI set `aria-selected="true"`.
   */
  async isSelected(): Promise<boolean> {
    const val = await this.interactor.getAttribute(this.locator, 'aria-selected');
    return val === 'true';
  }

  /**
   * Activate this tab by clicking it, unless it is already selected. A selected
   * tab cannot be toggled off, so this is a no-op when already active.
   */
  async select(): Promise<void> {
    if (!(await this.isSelected())) {
      await this.interactor.click(this.locator);
    }
  }

  override get driverName(): string {
    return 'MuiV7TabDriver';
  }
}
