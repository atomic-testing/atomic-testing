import { byCssSelector } from '../locators/byCssSelector';
import type { PartLocator } from '../locators/PartLocator';
import { append } from './locatorUtil';

/**
 * How the *i*-th match of a locator is turned back into a locator addressing
 * exactly that element — the shared policy behind `Interactor.getMatchLocator`,
 * applied verbatim by `DOMInteractor` and `PlaywrightInteractor` so the two
 * cannot hand back different addresses for the same match (#1054's index side).
 *
 * WHY an address at all: a `PartLocator` is a chain of CSS selectors (ADR-008),
 * and CSS cannot express "the *i*-th element matching this selector". The
 * ENGINES can — `querySelectorAll()[i]`, `Locator.nth(i)` — but the result is an
 * element, while a driver needs a locator it can keep resolving and append child
 * parts to. So the resolved element is reduced back to CSS.
 */

/** The `kind` of address {@link getMatchAddress} produced — see {@link toMatchLocator}. */
export type MatchAddressKind = 'suffix' | 'path';

/** A CSS address for one match, interpreted per its {@link MatchAddressKind}. */
export interface MatchAddress {
  readonly kind: MatchAddressKind;
  readonly selector: string;
}

/**
 * Address `matches[index]` relative to the locator that produced `matches`.
 *
 * Two forms, in preference order:
 *
 * 1. **`'suffix'`** — a `:nth-child(k)` fragment to COMPOUND onto the match
 *    locator, giving `<base>:nth-child(k)`. This keeps the address LIVE: the
 *    base selector is still re-evaluated on every use, so only the item's
 *    position among its own siblings is pinned. `:nth-child` (not
 *    `:nth-of-type`) counts across element types, which is exactly the fix —
 *    `:nth-of-type` counts by TAG among siblings, so one same-tag non-item
 *    interleaved ahead of the items shifted every index. Chosen only when no
 *    OTHER match sits at the same sibling position, which is what makes the
 *    compound resolve to one element.
 * 2. **`'path'`** — an absolute, `:root`-anchored chain of `:nth-child` steps
 *    that REPLACES the locator. Used only when form 1 would be ambiguous: a
 *    match set spread across several parents can hold two matches at the same
 *    sibling position, and `<base>:nth-child(k)` would then match both. The
 *    absolute path is unique by construction, but it is a positional SNAPSHOT of
 *    the whole ancestor chain — an element inserted anywhere above the match
 *    re-points it — so it is deliberately the fallback, not the default. (That
 *    is not theoretical: addressing every item this way made a Fluent DataGrid
 *    row driver, captured before a re-render, point at the wrong node after it.)
 *
 * `undefined` when there is no match at `index` (out of range or negative), or
 * when the match is not attached to its document, which no document-anchored
 * address can express.
 *
 * Passed BY VALUE into Playwright's `evaluateAll`, which serializes it into the
 * browser, so it must stay self-contained: only its parameters and DOM globals,
 * no import, no module-scope helper, and no syntax that transpiles to an
 * injected runtime helper. That is why the sibling-position walk appears twice
 * below instead of being factored out. See `visibilityUtil` for the same
 * constraint.
 *
 * @param matches - Every element the locator matched, in document order.
 * @param index - 0-based index into `matches`.
 */
export function getMatchAddress(matches: Element[], index: number): MatchAddress | undefined {
  const element: Element | undefined = matches[index];
  if (element == null) {
    return undefined;
  }

  const parent = element.parentElement;
  if (parent !== null) {
    let position = 1;
    let sibling: Element | null = parent.firstElementChild;
    while (sibling !== null && sibling !== element) {
      position = position + 1;
      sibling = sibling.nextElementSibling;
    }
    let isUniquePosition = true;
    for (let i = 0; i < matches.length; i++) {
      const other = matches[i];
      if (other === element) {
        continue;
      }
      const otherParent = other.parentElement;
      if (otherParent === null) {
        isUniquePosition = false;
        break;
      }
      let otherPosition = 1;
      let otherSibling: Element | null = otherParent.firstElementChild;
      while (otherSibling !== null && otherSibling !== other) {
        otherPosition = otherPosition + 1;
        otherSibling = otherSibling.nextElementSibling;
      }
      if (otherPosition === position) {
        isUniquePosition = false;
        break;
      }
    }
    if (isUniquePosition) {
      return { kind: 'suffix', selector: ':nth-child(' + position + ')' };
    }
  }

  let path = '';
  let current: Element = element;
  while (current.parentElement !== null) {
    const ancestor: Element = current.parentElement;
    let position = 1;
    let sibling: Element | null = ancestor.firstElementChild;
    while (sibling !== null && sibling !== current) {
      position = position + 1;
      sibling = sibling.nextElementSibling;
    }
    path = ' > *:nth-child(' + position + ')' + path;
    current = ancestor;
  }
  if (current !== element.ownerDocument.documentElement) {
    return undefined;
  }
  return { kind: 'path', selector: ':root' + path };
}

/**
 * Turn a {@link MatchAddress} into the locator an interactor hands back — the
 * one place that knows a `'suffix'` compounds onto the base (`'Same'`) while a
 * `'path'` replaces it and is document-anchored (`'Root'`), so the two
 * interactors cannot disagree about it.
 *
 * @param locator - The locator whose match set was indexed.
 * @param address - The address {@link getMatchAddress} produced for one match.
 */
export function toMatchLocator(locator: PartLocator, address: MatchAddress): PartLocator {
  if (address.kind === 'suffix') {
    return append(locator, byCssSelector(address.selector, 'Same'));
  }
  return byCssSelector(address.selector, 'Root');
}
