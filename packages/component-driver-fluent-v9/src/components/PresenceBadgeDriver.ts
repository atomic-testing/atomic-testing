import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `PresenceBadge` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div role="img" aria-label="{status}">` — for a plain `status` (verified:
 * `'available'`, `'busy'`) the `aria-label` is exactly the status string, so
 * {@link getStatusLabel} is a direct, reliable read. The `outOfOffice`
 * modifier's exact composite label text was not verified against real DOM
 * (out of scope for this wave — see the package README's Known gaps), so
 * this driver exposes the raw label rather than parsing it back into a typed
 * `PresenceBadgeStatus`.
 */
export class PresenceBadgeDriver extends ComponentDriver<{}> {
  /** The badge's accessible status label, read from `aria-label`. */
  async getStatusLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  get driverName(): string {
    return 'FluentV9PresenceBadgeDriver';
  }
}
