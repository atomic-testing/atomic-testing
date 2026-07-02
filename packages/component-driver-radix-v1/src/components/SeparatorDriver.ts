import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Radix Separator primitive (`Separator.Root` from `radix-ui`).
 *
 * Separator renders a single `<div>` whose semantics depend on the `decorative`
 * prop: a semantic separator carries `role="separator"` (with `aria-orientation`
 * mirrored only when vertical — horizontal is the ARIA default), while a
 * decorative one carries `role="none"`. Both variants always carry Radix's
 * `data-orientation` state attribute, which is therefore the portable
 * orientation read. The scene anchors on the forwarded `data-testid`
 * (`role="separator"` is equally valid for semantic separators).
 */
export class SeparatorDriver extends ComponentDriver<{}> {
  /** The orientation (`data-orientation`): `'horizontal'` or `'vertical'`. */
  async getOrientation(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-orientation');
  }

  /**
   * Whether the separator is decorative (hidden from the accessibility tree).
   * Radix expresses this as `role="none"` instead of `role="separator"`.
   */
  async isDecorative(): Promise<boolean> {
    const role = await this.interactor.getAttribute(this.locator, 'role');
    return role === 'none';
  }

  override get driverName(): string {
    return 'RadixV1SeparatorDriver';
  }
}
