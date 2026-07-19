import { ComponentDriver, IDisableableDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a Fluent v9 `BreadcrumbButton` — the clickable content of a
 * {@link BreadcrumbItemDriver} (constructed by it via `getButton()`, not
 * placed directly in a scene).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a native `<a
 * class="fui-BreadcrumbButton">` when an `href` (or `as`) prop is supplied,
 * otherwise a native `<button>` — so this driver extends the common
 * `ComponentDriver` rather than either HTML driver, since either element
 * shape is legitimate. `current` drives two attributes, both present ONLY
 * when `current` is truthy (neither is stamped as a literal `"false"` when
 * it isn't): `aria-current="page"` (default, overridable) and
 * `aria-disabled="true"` (default, overridable).
 *
 * {@link isDisabled} combines a native `disabled` check (the `<button>`
 * shape) with an `aria-disabled` read (the `<a>` shape, which has no native
 * `disabled` property — same wall `LinkDriver` hits) since `BreadcrumbButton`
 * delegates to the same `useButtonBase_unstable`/`useARIAButtonProps`
 * machinery as every other Button-family driver in this package, which
 * reflects `disabled` one way or the other depending on the rendered element.
 */
export class BreadcrumbButtonDriver extends ComponentDriver<{}> implements IDisableableDriver {
  /** The button's visible label text, trimmed. */
  async getLabel(): Promise<Optional<string>> {
    const text = await this.interactor.getText(this.locator);
    return text?.trim();
  }

  /** Whether this crumb represents the current page (`aria-current="page"`, present only when `current` is set). */
  async isCurrent(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-current')) === 'page';
  }

  /** Whether the button is disabled — see class doc for why both checks are needed. */
  async isDisabled(): Promise<boolean> {
    const [nativeDisabled, ariaDisabled] = await Promise.all([
      this.interactor.isDisabled(this.locator),
      this.interactor.getAttribute(this.locator, 'aria-disabled'),
    ]);
    return nativeDisabled || ariaDisabled === 'true';
  }

  /** The button's `href`, or `undefined` when it rendered as a `<button>` (no `href` supplied). */
  async getHref(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'href');
  }

  get driverName(): string {
    return 'FluentV9BreadcrumbButtonDriver';
  }
}
