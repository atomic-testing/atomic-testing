import { CssLocator } from './CssLocator';

export type CssLocatorChain = CssLocator[];

/**
 * A single {@link CssLocator} or a chain of them. A `PartLocator` always reduces
 * to **one CSS selector** via `locatorUtil.toCssSelector`, which the interactor
 * runs against the DOM.
 *
 * **1.0 boundary — CSS only.** The locator model is deliberately closed to CSS
 * for 1.0: every builder (`byRole`, `byAriaLabel`, `byAttribute`, `byCssSelector`,
 * …) emits a CSS fragment, same-element matchers compose via {@link CssLocator.and},
 * and `byCssSelector` is the raw-CSS escape hatch. XPath, text, and computed-ARIA
 * -name engines are out of scope — see
 * [ADR-008](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/008-css-dom-only-locator-boundary.md).
 *
 * **Deferred to 2.0 (#1058).** Collapsing this union into a single value type that
 * always holds a chain — eliminating the `isChain`/`toChain` normalization at
 * every call site — is a worthwhile simplification, but reshaping a public type is
 * a breaking change and stays out of the 1.0 freeze. The additive `'Child'`
 * relative position from the same issue already shipped; the union reshape is the
 * remaining 2.0 candidate #1058 tracks.
 */
export type PartLocator = CssLocator | CssLocatorChain;
