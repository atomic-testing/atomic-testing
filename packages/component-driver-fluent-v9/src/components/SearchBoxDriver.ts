import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, locatorUtil, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `SearchBox` component (`@fluentui/react-search`,
 * re-exported by `@fluentui/react-components`).
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<SearchBox>` forwards straight to a REAL native
 * `<input class="fui-SearchBox__input" type="search">` — the component root
 * IS the input, exactly like `Input`'s own precedent (see the package README)
 * — so this driver extends `HTMLTextInputDriver` wholesale for the shared
 * `getValue`/`setValue`/`isDisabled`/`isReadonly`/`isRequired`/`isError`
 * surface, adding only the SearchBox-specific dismiss ("clear") button.
 *
 * The dismiss button is a real `<span role="button" aria-label="clear">`, but
 * it renders as a SIBLING of the input (one level deeper, inside a
 * `contentAfter` wrapper) within the same `fui-SearchBox` styling shell — not
 * a descendant of the input itself — so, like `CheckboxDriver`'s linked
 * label, it cannot be reached by simply appending a descendant locator onto
 * `this.locator`. Unlike the checkbox label, there is no accessibility link
 * (`for`/`id`, `aria-labelledby`/`aria-describedby`) tying the button back to
 * a specific input — every instance shares the identical literal
 * `aria-label="clear"` (DOM audit) — so this driver instead re-roots at the
 * enclosing `.fui-SearchBox` wrapper, matched against THIS input's own
 * selector via `:has()` (the same technique `component-driver-mui-v9`'s
 * `CheckboxDriver` uses for its implicit `<label>` wrapper), which keeps two
 * side-by-side `SearchBox`es correctly disambiguated.
 *
 * DOM audit also found the dismiss button renders UNCONDITIONALLY by default,
 * regardless of the input's value (empty or filled) or `disabled` state —
 * `useSearchBoxBase_unstable`'s `dismiss` slot has `renderByDefault: true` —
 * so {@link hasClearButton} is `false` only in the one case a consumer
 * explicitly suppresses the slot (`dismiss={null}`), not merely "no text
 * typed yet". Its VISUAL reveal is CSS-only and keyed on FOCUS rather than
 * value (`useSearchBoxStyles_unstable` collapses the wrapping `contentAfter`
 * span to a zero-size, `overflow: hidden` box while unfocused) — a real
 * browser's actionability check therefore sees an empty bounding box and
 * refuses to click it unless the field is focused first, so {@link clear}
 * focuses the input before clicking the button.
 */
export class SearchBoxDriver extends HTMLTextInputDriver {
  /**
   * Locator for the dismiss ("clear") button — re-rooted at the enclosing
   * `.fui-SearchBox` wrapper (see class doc), matched via `:has()` against
   * this input's own selector so sibling `SearchBox`es are never conflated.
   */
  private get dismissLocator(): PartLocator {
    const chain = locatorUtil.toChain(this.locator);
    const selfSelector = chain[chain.length - 1].selector;
    return locatorUtil.append(
      chain.slice(0, -1),
      byCssSelector(`.fui-SearchBox:has(${selfSelector}) .fui-SearchBox__dismiss`)
    );
  }

  /**
   * Whether the dismiss button is mounted at all. It renders unconditionally
   * by default regardless of value (see class doc) — `false` only when a
   * consumer explicitly suppresses it via `dismiss={null}`.
   */
  async hasClearButton(): Promise<boolean> {
    return this.interactor.exists(this.dismissLocator);
  }

  /**
   * Click the dismiss button to empty the input. Focuses the input first
   * (see class doc) so the button is actionable in a real browser, where its
   * reveal is gated on focus rather than on having a value.
   */
  async clear(): Promise<void> {
    await this.interactor.focus(this.locator);
    await this.interactor.click(this.dismissLocator);
  }

  override get driverName(): string {
    return 'FluentV9SearchBoxDriver';
  }
}
