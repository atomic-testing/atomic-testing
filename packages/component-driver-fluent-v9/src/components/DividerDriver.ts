import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Divider` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div role="separator" aria-orientation="horizontal|vertical">` wrapping its
 * content in a single `<div class="fui-Divider__wrapper">` child — the root's
 * own `getText()` (inherited from `ComponentDriver`) already reads that
 * wrapper's text since it is the only content. `getOrientation` reads the
 * ARIA orientation directly.
 */
export class DividerDriver extends ComponentDriver<{}> {
  /** The divider's orientation (Fluent defaults to `'horizontal'` when unset). */
  async getOrientation(): Promise<'horizontal' | 'vertical'> {
    const value = await this.interactor.getAttribute(this.locator, 'aria-orientation');
    return value === 'vertical' ? 'vertical' : 'horizontal';
  }

  get driverName(): string {
    return 'FluentV9DividerDriver';
  }
}
