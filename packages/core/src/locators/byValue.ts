import { escapeValue } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByValueSource = {
  _id: 'byValue';
  value: string;
  relative: LocatorRelativePosition;
};

/**
 * Locate elements by the value of their `value` attribute.
 *
 * @param value - The value to match.
 * @param relative - Relative position of the locator. Defaults to
 * {@link LocatorRelativePosition.Descendent}.
 * @example
 * ```ts
 * const option = byValue('option1');
 * ```
 */
export function byValue(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent
): CssLocator {
  const sanitized = escapeValue(value);
  return new CssLocator(`[value="${sanitized}"]`, {
    relative,
    source: {
      _id: 'byValue',
      value,
      relative,
    },
  });
}
