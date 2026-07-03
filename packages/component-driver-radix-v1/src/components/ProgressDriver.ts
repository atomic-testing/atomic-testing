import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Radix Progress primitive (`Progress.Root` from `radix-ui`).
 *
 * Renders `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax`
 * (valuenow omitted entirely when indeterminate — `value={null}`) plus Radix's
 * own `data-state` (`indeterminate`/`loading`/`complete`), which is the more
 * direct determinate/indeterminate read than inferring it from the presence of
 * a value, so this driver uses it directly rather than reimplementing the MUI
 * `ProgressDriver`'s value-presence inference. A progress indicator is
 * read-only and non-interactive, so — like the MUI equivalent — this
 * deliberately does not implement `IInputDriver`.
 * @see https://www.radix-ui.com/primitives/docs/components/progress
 */
export class ProgressDriver extends ComponentDriver<{}> {
  /** The current value, or `null` when indeterminate (no `aria-valuenow`). */
  async getValue(): Promise<number | null> {
    const raw = await this.interactor.getAttribute(this.locator, 'aria-valuenow');
    if (raw == null) {
      return null;
    }
    const num = Number(raw);
    return Number.isNaN(num) ? null : num;
  }

  /** The maximum value (`aria-valuemax`, defaults to `100`). */
  async getMax(): Promise<number> {
    const raw = await this.interactor.getAttribute(this.locator, 'aria-valuemax');
    return raw == null ? 100 : Number(raw);
  }

  /** Whether the progress is indeterminate (`data-state="indeterminate"`). */
  async isIndeterminate(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'data-state')) === 'indeterminate';
  }

  get driverName(): string {
    return 'RadixV1ProgressDriver';
  }
}
