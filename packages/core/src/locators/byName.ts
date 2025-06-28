import { escapeValue } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByNameSource = {
  _id: 'byName';
  value: string;
  relative: LocatorRelativePosition;
};

/**
 * Locate elements using the value of their `name` attribute.
 *
 * @param value - Value of the `name` attribute to match.
 * @param relative - Relative position of the locator. Defaults to
 * {@link LocatorRelativePosition.Descendent}.
 * @example
 * ```ts
 * const searchBox = byName('search');
 * ```
 */
export function byName(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent
): CssLocator {
  const sanitized = escapeValue(value);
  return new CssLocator(`[name="${sanitized}"]`, {
    relative,
    source: {
      _id: 'byName',
      value,
      relative,
    },
  });
}
