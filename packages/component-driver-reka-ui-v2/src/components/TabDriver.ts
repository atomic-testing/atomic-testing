import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for a single Reka UI Tabs trigger (`TabsTrigger` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): a real `<button type="button"
 * role="tab" aria-selected="true"/"false" data-state="active"/"inactive"
 * disabled data-disabled aria-controls>` — byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `TabDriver` for every attribute this driver
 * reads, so extending `HTMLButtonDriver` again inherits `isDisabled` off the
 * native `disabled` attribute.
 *
 * `select()` clicks unconditionally when not already selected, with no
 * disabled guard — ported unchanged from Radix. See `TabsDriver`'s class doc
 * for why the shared test suite deliberately never exercises this against a
 * disabled trigger.
 */
export class TabDriver extends HTMLButtonDriver {
  async isSelected(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  async select(): Promise<void> {
    if (!(await this.isSelected())) {
      await this.interactor.click(this.locator);
    }
  }

  override get driverName(): string {
    return 'RekaUiV2TabDriver';
  }
}
