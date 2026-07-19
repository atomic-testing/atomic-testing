import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Fluent v9 `ToolbarButton` component.
 *
 * DOM audit (@fluentui/react-components@9.8.3): renders a plain native
 * `<button class="fui-Button">` — delegates its whole state to
 * `@fluentui/react-button`'s button primitive and stamps NO
 * `fui-ToolbarButton` class of its own (verified: `useToolbarButtonStyles`
 * only merges hashed vertical-orientation styles, no exported class
 * constant), so the only un-hashed anchor present is `fui-Button`, same
 * root shape as plain `Button` — this driver delegates wholesale, like
 * `ButtonDriver`.
 */
export class ToolbarButtonDriver extends HTMLButtonDriver {
  override get driverName(): string {
    return 'FluentV9ToolbarButtonDriver';
  }
}
