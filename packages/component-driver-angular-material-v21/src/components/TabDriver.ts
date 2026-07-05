import { ComponentDriver, IDisableableDriver } from '@atomic-testing/core';

/**
 * Driver for a single Angular Material tab label (`MatTab`).
 *
 * The tab group renders each tab as a `role="tab"` element carrying the
 * selection (`aria-selected`) and disabled (`aria-disabled`) state — both are
 * always present with `"true"`/`"false"` values. The element is not a native
 * button, so the disabled state is read from `aria-disabled` rather than a
 * `disabled` attribute. `getText`/`click` come from the base
 * {@link ComponentDriver}.
 *
 * Unlike a toggle this is intentionally not an `IToggleDriver`: a tab can be
 * selected but not toggled off (selecting another tab deselects it), so only
 * `isSelected`/`select` are exposed.
 *
 * @see https://material.angular.dev/components/tabs
 */
export class TabDriver extends ComponentDriver<{}> implements IDisableableDriver {
  /**
   * Whether this tab is the selected one, i.e. Material set
   * `aria-selected="true"`.
   */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
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

  /**
   * Whether this tab is disabled, i.e. Material set `aria-disabled="true"`.
   */
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  get driverName(): string {
    return 'AngularMaterialV21TabDriver';
  }
}
