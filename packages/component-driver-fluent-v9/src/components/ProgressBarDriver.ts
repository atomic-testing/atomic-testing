import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `ProgressBar` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div role="progressbar" aria-valuemin aria-valuemax aria-valuenow>` when a
 * `value` is supplied; `aria-valuenow` is entirely ABSENT (not `"0"` or
 * empty) in the indeterminate case (no `value` prop) — {@link isIndeterminate}
 * reads that absence directly rather than inferring it from `getValue()`
 * returning `undefined`, so the two reads stay independently meaningful.
 */
export class ProgressBarDriver extends ComponentDriver<{}> {
  /** The current value (`aria-valuenow`), or `undefined` in the indeterminate state. */
  async getValue(): Promise<Optional<number>> {
    const raw = await this.interactor.getAttribute(this.locator, 'aria-valuenow');
    return raw == null ? undefined : Number(raw);
  }

  /** The minimum value (`aria-valuemin`, Fluent always renders `0`). */
  async getMin(): Promise<Optional<number>> {
    const raw = await this.interactor.getAttribute(this.locator, 'aria-valuemin');
    return raw == null ? undefined : Number(raw);
  }

  /** The maximum value (`aria-valuemax`, the `max` prop — defaults to `1`). */
  async getMax(): Promise<Optional<number>> {
    const raw = await this.interactor.getAttribute(this.locator, 'aria-valuemax');
    return raw == null ? undefined : Number(raw);
  }

  /** Whether the bar is in its indeterminate (no `value` supplied) animated state. */
  async isIndeterminate(): Promise<boolean> {
    return !(await this.interactor.hasAttribute(this.locator, 'aria-valuenow'));
  }

  get driverName(): string {
    return 'FluentV9ProgressBarDriver';
  }
}
