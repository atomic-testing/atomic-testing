import { escapeCssIdentifier, escapeCssString } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';
import type { PartLocator } from './PartLocator';

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
): PartLocator {
  // Three interpolations, two escaping contexts: an id and an attribute name are CSS
  // identifiers, whereas the value sits inside a quoted string. See `escapeUtil`.
  const selector =
    name === 'id' ? `#${escapeCssIdentifier(value)}` : `[${escapeCssIdentifier(name)}="${escapeCssString(value)}"]`;
  return [
    new CssLocator(selector, {
      relative: relativeTo,
      source: {
        _id: 'byAttribute',
        name,
        value,
        relativeTo,
      },
    }),
  ];
}
