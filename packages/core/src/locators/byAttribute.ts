import { escapeName, escapeValue } from '../utils/escapeUtil';
import { assertNonEmpty } from '../utils/validation';

import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByAttributeSource = {
  _id: 'byAttribute';
  name: string;
  value: string;
  relativeTo: LocatorRelativePosition;
};

/**
 * Locate an element by a specific attribute and value.
 *
 * @param name - The attribute name.
 * @param value - The attribute value to match.
 * @param relativeTo - Relative position of the locator. Defaults to
 * `'Descendant'`.
 * @example
 * ```ts
 * const dialog = byAttribute('role', 'dialog');
 * ```
 */
export function byAttribute(
  name: string,
  value: string,
  relativeTo: LocatorRelativePosition = 'Descendant'
): CssLocator {
  assertNonEmpty(name, 'attribute name');
  assertNonEmpty(value, 'attribute value');
  const selector = name === 'id' ? `#${escapeValue(value)}` : `[${escapeName(name)}="${escapeValue(value)}"]`;
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byAttribute',
      name,
      value,
      relativeTo,
    },
  });
}
