import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for a single Radix Tabs trigger (`Tabs.Trigger`).
 *
 * Renders `<button role="tab" aria-selected data-state="active"/"inactive">`,
 * with a real `disabled` attribute when disabled — `isDisabled`/`click` are
 * inherited from `HTMLButtonDriver`. Verified against rendered `radix-ui@1.6.1`
 * DOM per the Wave 0 capability-gap audit (`agent-docs/modules/component-driver-radix.md`):
 * plain `click` + attribute reads, no new `Interactor` primitive needed.
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
    return 'RadixV1TabDriver';
  }
}
