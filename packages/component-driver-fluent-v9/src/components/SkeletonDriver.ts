import { byCssClass, ComponentDriver, locatorUtil } from '@atomic-testing/core';

const itemLocator = byCssClass('fui-SkeletonItem');

/**
 * Driver for the Fluent v9 `Skeleton` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div role="progressbar" aria-busy="true">` wrapping its `SkeletonItem`
 * placeholders. Individual items carry zero distinguishable state (no text,
 * no reflected `shape`/`animation` prop — same "purely structural, no
 * interactive unit" call Wave 4 makes for `BreadcrumbDivider`), so this
 * driver exposes only {@link getItemCount} rather than a per-item driver
 * class or a full `ListComponentDriver`.
 */
export class SkeletonDriver extends ComponentDriver<{}> {
  /** The number of `SkeletonItem` placeholders rendered. */
  async getItemCount(): Promise<number> {
    return this.interactor.getElementCount(locatorUtil.append(this.locator, itemLocator));
  }

  get driverName(): string {
    return 'FluentV9SkeletonDriver';
  }
}
