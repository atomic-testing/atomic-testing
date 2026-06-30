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
 * [ADR-008](../../../../agent-docs/adr/008-css-dom-only-locator-boundary.md).
 */
export type PartLocator = CssLocator | CssLocatorChain;
