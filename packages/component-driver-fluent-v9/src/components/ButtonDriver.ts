import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Fluent v9 `Button` component (`@fluentui/react-components`).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a plain native
 * `<button class="fui-Button">` — the component root IS the button, with
 * `disabled` as a native attribute. Everything a driver needs is exactly
 * `HTMLButtonDriver`'s surface (`click`/`hover`/`isDisabled`), so this driver
 * delegates wholesale rather than reimplementing it.
 */
export class ButtonDriver extends HTMLButtonDriver {
  override get driverName(): string {
    return 'FluentV9ButtonDriver';
  }
}
