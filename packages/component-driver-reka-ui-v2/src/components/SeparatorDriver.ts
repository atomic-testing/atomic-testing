import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Reka UI Separator primitive (`Separator` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered): byte-for-byte the same contract as
 * `component-driver-radix-v1`'s `SeparatorDriver` — a single `<div>` whose
 * semantics depend on the `decorative` prop: a semantic separator carries
 * `role="separator"` (with `aria-orientation` mirrored only when vertical —
 * horizontal is the ARIA default), a decorative one carries `role="none"`.
 * Both variants always carry `data-orientation`, the portable orientation
 * read; no `data-reka-*` vendor prefix appears anywhere on this primitive (the
 * vendor-prefix rename applies to portalled/structural markers this primitive
 * doesn't have, not its state attributes).
 */
export class SeparatorDriver extends ComponentDriver<{}> {
  /** The orientation (`data-orientation`): `'horizontal'` or `'vertical'`. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-orientation');
  }

  /**
   * Whether the separator is decorative (hidden from the accessibility tree).
   * Reka expresses this as `role="none"` instead of `role="separator"`.
   */
  async isDecorative(): Promise<boolean> {
    const role = await this.interactor.getAttribute(this.locator, 'role');
    return role === 'none';
  }

  override get driverName(): string {
    return 'RekaUiV2SeparatorDriver';
  }
}
