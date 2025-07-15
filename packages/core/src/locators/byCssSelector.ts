import { assertNonEmpty } from '../utils/validation';

import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByCssSelectorSource = {
  _id: 'byCssSelector';
  selector: string;
  relative: LocatorRelativePosition;
};

/**
 * Locate elements using a raw CSS selector string.
 *
 * This is a low level API and should be used when the other helper
 * locators cannot express the desired selector.
 *
 * @param selector - A CSS selector string.
 * @param relativeTo - Relative position of the locator. Defaults to
 * `'Descendant'`.
 * @example
 * ```ts
 * const activeItem = byCssSelector('.menu .item.active');
 * ```
 */
export function byCssSelector(selector: string, relativeTo: LocatorRelativePosition = 'Descendant'): CssLocator {
  assertNonEmpty(selector, 'selector');
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byCssSelector',
      selector,
      relative: relativeTo,
    },
  });
}
