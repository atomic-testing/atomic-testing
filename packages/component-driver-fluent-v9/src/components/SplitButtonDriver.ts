import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { MenuDriver } from './MenuDriver';

export const splitButtonParts = {
  primaryButton: {
    locator: byCssClass('fui-SplitButton__primaryActionButton'),
    driver: HTMLButtonDriver,
  },
  menuButton: {
    locator: byCssClass('fui-SplitButton__menuButton'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the Fluent v9 `SplitButton` (deferred from Wave 1 since it always
 * opens a `Menu`).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a wrapper
 * `<div class="fui-SplitButton">` (the component's own root — where a
 * consumer-forwarded `data-testid` lands) around TWO native buttons: a primary
 * action (`fui-SplitButton__primaryActionButton`, an ordinary click target
 * with no menu semantics) and a menu-invoking half
 * (`fui-SplitButton__menuButton`, which also carries the plain `fui-MenuButton`
 * class and is the actual `MenuTrigger` child — `aria-haspopup="menu"`, `id`).
 * The base `click()` inherited from `ComponentDriver` targets the wrapper,
 * which is not itself interactive, so this driver exposes explicit
 * {@link clickPrimary}/{@link getMenu} instead.
 */
export class SplitButtonDriver extends ComponentDriver<typeof splitButtonParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: splitButtonParts,
    });
  }

  /** Click the primary action button (the non-menu half). */
  async clickPrimary(): Promise<void> {
    await this.parts.primaryButton.click();
  }

  /** Whether the primary action button is disabled. */
  async isPrimaryDisabled(): Promise<boolean> {
    return this.parts.primaryButton.isDisabled();
  }

  /** The `Menu` the menu-invoking half opens. See {@link MenuDriver}. */
  getMenu<ContentT extends ScenePart = {}>(content?: ContentT): MenuDriver<ContentT> {
    return new MenuDriver<ContentT>(this.parts.menuButton.locator, this.interactor, {
      ...this.commutableOption,
      content: content ?? ({} as ContentT),
    });
  }

  get driverName(): string {
    return 'FluentV9SplitButtonDriver';
  }
}
