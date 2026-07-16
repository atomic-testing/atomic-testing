import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { ScenePart } from '@atomic-testing/core';

import { MenuDriver } from './MenuDriver';

/**
 * Driver for the Fluent v9 `MenuButton` (deferred from Wave 1 since it always
 * opens a `Menu`).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a plain native
 * `<button class="fui-Button fui-MenuButton">` — the same native root as a
 * plain `Button` (`MenuTrigger` clones `aria-haspopup`/`id`/`aria-expanded`
 * onto it), plus a decorative chevron icon. This driver therefore delegates
 * click/disabled reads to `HTMLButtonDriver` and adds {@link getMenu} to reach
 * the `Menu` it opens, built from this driver's own locator (the button IS the
 * `MenuTrigger`'s child, exactly what `MenuDriver` expects as its trigger).
 */
export class MenuButtonDriver extends HTMLButtonDriver {
  /** The `Menu` this button opens, resolved via its trigger `id` → `aria-labelledby` link. See {@link MenuDriver}. */
  getMenu<ContentT extends ScenePart = {}>(content?: ContentT): MenuDriver<ContentT> {
    return new MenuDriver<ContentT>(this.locator, this.interactor, {
      ...this.commutableOption,
      content: content ?? ({} as ContentT),
    });
  }

  override get driverName(): string {
    return 'FluentV9MenuButtonDriver';
  }
}
