import { HTMLAnchorDriver } from '@atomic-testing/component-driver-html';
import { IDisableableDriver } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Link` component, targeting its **anchor** rendering
 * (an `href` is supplied) — the common case and the one this package's example
 * covers.
 *
 * DOM audit (@fluentui/react-components@9.74.3): with an `href`, renders a
 * native `<a role="link" class="fui-Link">` — `href`/`target`/click/hover all
 * ride `HTMLAnchorDriver`'s existing surface. Two Fluent-specific behaviors to
 * know:
 * - **No `href` at all**: Fluent renders `<button type="button">` instead of
 *   `<a>` (a "trigger" Link). This driver does not target that shape — `getHref`
 *   would just read a never-present attribute on the wrong element type.
 * - **`disabled`**: Fluent removes the `href` attribute entirely rather than
 *   merely gating navigation, so `getHref()` on a disabled Link returns
 *   `undefined`, not the originally-authored URL — an accurate read of the
 *   real DOM, but a real behavior difference from a plain disabled anchor.
 *   `<a>` also has no native `disabled` property (`Interactor.isDisabled` only
 *   recognizes elements that do), so Fluent signals disabled via
 *   `aria-disabled="true"` instead — this driver overrides `isDisabled` to
 *   read that attribute rather than inheriting the native-property check,
 *   which would always report `false`.
 */
export class LinkDriver extends HTMLAnchorDriver implements IDisableableDriver {
  async isDisabled(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  override get driverName(): string {
    return 'FluentV9LinkDriver';
  }
}
