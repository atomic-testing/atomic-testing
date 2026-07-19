import { byCssClass, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

import { BreadcrumbButtonDriver } from './BreadcrumbButtonDriver';

const buttonLocator = byCssClass('fui-BreadcrumbButton');

/**
 * Driver for a single Fluent v9 `BreadcrumbItem` (a child of `Breadcrumb` —
 * see {@link BreadcrumbDriver}).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a plain
 * `<li class="fui-BreadcrumbItem">` wrapping a `BreadcrumbButton` descendant
 * — the `<li>` itself carries no interactive state (no role, no
 * `aria-current`), so this driver folds `BreadcrumbButton`'s behavior in via
 * {@link getButton} rather than duplicating it, and overrides `click` to
 * target the button (the `<li>` wrapper has no click handler of its own).
 */
export class BreadcrumbItemDriver extends ComponentDriver<{}> {
  private get buttonLocator(): PartLocator {
    return locatorUtil.append(this.locator, buttonLocator);
  }

  /** The item's `BreadcrumbButton`. */
  getButton(): BreadcrumbButtonDriver {
    return new BreadcrumbButtonDriver(this.buttonLocator, this.interactor, this.commutableOption);
  }

  /** The item's visible label. See {@link BreadcrumbButtonDriver.getLabel}. */
  async getLabel(): Promise<Optional<string>> {
    return this.getButton().getLabel();
  }

  /** Whether this crumb represents the current page. See {@link BreadcrumbButtonDriver.isCurrent}. */
  async isCurrent(): Promise<boolean> {
    return this.getButton().isCurrent();
  }

  override async click(): Promise<void> {
    await this.getButton().click();
  }

  get driverName(): string {
    return 'FluentV9BreadcrumbItemDriver';
  }
}
