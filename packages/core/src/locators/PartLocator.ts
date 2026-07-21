import { CssLocator } from './CssLocator';

/**
 * How to find an element: always a chain of {@link CssLocator}s, reduced to
 * **one CSS selector** via `locatorUtil.toCssSelector`, which the interactor
 * runs against the DOM. A locator built by a single `by*` builder (e.g.
 * `byDataTestId('submit')`) is simply a one-element chain — there is no
 * separate "bare locator" shape to normalize away. An empty chain (`[]`) is
 * also valid: it is the engine-root locator, and `toCssSelector` reduces it to
 * the portable document-root selector rather than throwing (see #1048).
 *
 * **1.0 boundary — CSS only.** The locator model is deliberately closed to CSS:
 * every builder (`byRole`, `byAriaLabel`, `byAttribute`, `byCssSelector`, …)
 * emits a CSS fragment, same-element matchers compose via {@link
 * locatorUtil.and}, and `byCssSelector` is the raw-CSS escape hatch. XPath,
 * text, and computed-ARIA-name engines are out of scope — see
 * [ADR-008](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/008-css-dom-only-locator-boundary.md).
 *
 * **2.0 reshape (#1058).** `PartLocator` used to be `CssLocator | CssLocator[]`,
 * forcing an `isChain`/`toChain` normalization step at every consumer. It is
 * now always `CssLocator[]`, so every builder returns a chain and every
 * consumer can index/slice/concat it directly — see
 * [ADR-017](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/017-part-locator-chain-reshape.md).
 */
export type PartLocator = CssLocator[];
