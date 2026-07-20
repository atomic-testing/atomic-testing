import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Alert` component.
 *
 * **Deprecated by Fluent itself**: `AlertProps`'s own TSDoc reads
 * "`@deprecated please use the Toast or MessageBar component`" — prefer
 * {@link MessageBarDriver}/`ToastDriver` for new scenes; this driver exists
 * for consumers migrating an existing `Alert` usage.
 *
 * **Ships from a different entry point than the rest of this package**:
 * `Alert` is NOT part of `@fluentui/react-components`'s stable surface at
 * all — verified: `require('@fluentui/react-components').Alert` is
 * `undefined` — it is exported only from the unstable subpath,
 * `import { Alert } from '@fluentui/react-components/unstable'`.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders
 * `<div role="status">` normally, or `role="alert"` when an `action` is
 * supplied (verified against real DOM), wrapping an icon, the message text,
 * and an optional `action` button as DIRECT SIBLINGS with no element
 * wrapping the message alone — so the inherited `getText()` includes the
 * action button's own text when one is present; there is no portable way to
 * read the message in isolation (same class of limitation as
 * `CompoundButtonDriver.getSecondaryContent()` — see the package README's
 * Known gaps). `intent`/`appearance` have no un-hashed DOM reflection beyond
 * the icon glyph itself.
 */
export class AlertDriver extends ComponentDriver<{}> {
  get driverName(): string {
    return 'FluentV9AlertDriver';
  }
}
