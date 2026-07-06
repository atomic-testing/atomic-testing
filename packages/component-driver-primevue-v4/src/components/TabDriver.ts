import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for a single PrimeVue `Tab` trigger.
 *
 * DOM audit (primevue@4.5.5): renders
 * `<button role="tab" aria-selected aria-controls="<panel id>">` with a real
 * `disabled` attribute when disabled — `isDisabled`/`click` are inherited from
 * `HTMLButtonDriver`; the selected read is the ARIA tabs contract. Same
 * two-level shape as the Radix `TabsDriver`/`TabDriver` pair.
 */
export class TabDriver extends HTMLButtonDriver {
  /** Whether this tab is the selected one (`aria-selected="true"`). */
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  /** Activate this tab by clicking it, unless it is already selected. */
  async select(): Promise<void> {
    if (!(await this.isSelected())) {
      await this.interactor.click(this.locator);
    }
  }

  override get driverName(): string {
    return 'PrimeVueV4TabDriver';
  }
}
