import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Badge` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a plain
 * `<div class="fui-Badge">` whose only observable state is its own content,
 * already covered by the inherited `getText()` — `appearance`/`color`/
 * `shape`/`size` have no un-hashed DOM reflection (only Griffel's hashed
 * atomic classes), so this driver exists to name the component in scene
 * definitions, same rationale as `TextDriver`/`DividerDriver`.
 */
export class BadgeDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'FluentV9BadgeDriver';
  }
}
