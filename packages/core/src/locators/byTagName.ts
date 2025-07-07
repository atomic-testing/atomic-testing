import { assertNonEmpty } from '../utils/validation';

import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByTagNameSource = {
  _id: 'byTagName';
  tagName: string;
  relative: LocatorRelativePosition;
};

/**
 * Locate elements by their HTML tag name.
 *
 * This locator is generally discouraged in favour of more stable
 * attributes such as `data-testid`.
 *
 * @param tagName - The tag name to match.
 * @param relative - Relative position of the locator. Defaults to
 * `'Descendant'`.
 * @example
 * ```ts
 * const headings = byTagName('h1');
 * ```
 */
export function byTagName(tagName: string, relative: LocatorRelativePosition = 'Descendant'): CssLocator {
  assertNonEmpty(tagName, 'tagName');
  return new CssLocator(tagName, {
    relative,
    source: {
      _id: 'byTagName',
      tagName,
      relative,
    },
  });
}
