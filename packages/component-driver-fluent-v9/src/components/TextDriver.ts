import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Text` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a plain
 * `<span class="fui-Text">` with no state beyond its content, which the
 * inherited `getText()` already covers — this class exists so scene parts can
 * name the driver explicitly rather than reaching for a generic HTML element
 * driver.
 */
export class TextDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'FluentV9TextDriver';
  }
}
