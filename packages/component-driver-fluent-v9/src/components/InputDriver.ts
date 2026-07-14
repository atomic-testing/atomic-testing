import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Fluent v9 `Input` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<Input>` forwards straight to the real native
 * `<input class="fui-Input__input">` (wrapped by a `<span class="fui-Input">`
 * styling shell that carries no identifying attributes of its own) — the
 * component root IS the input, with `disabled`/`readonly`/`required` as native
 * attributes and the invalid state mirrored to `aria-invalid`. Everything a
 * driver needs is exactly `HTMLTextInputDriver`'s surface, so this driver
 * delegates wholesale rather than reimplementing it.
 */
export class InputDriver extends HTMLTextInputDriver {
  override get driverName(): string {
    return 'FluentV9InputDriver';
  }
}
