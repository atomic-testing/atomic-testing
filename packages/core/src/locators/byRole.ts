import { escapeValue } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByRoleSource = {
  _id: 'byRole';
  value: string;
  relative: LocatorRelativePosition;
};

/**
 * Locate elements by their ARIA `role` attribute.
 *
 * @param value - The role value to match.
 * @param relative - Relative position of the locator. Defaults to
 * `'Descendent'`.
 * @example
 * ```ts
 * const dialog = byRole('dialog');
 * ```
 */
export function byRole(value: string, relative: LocatorRelativePosition = 'Descendent'): CssLocator {
  const sanitized = escapeValue(value);
  return new CssLocator(`[role="${sanitized}"]`, {
    relative,
    source: {
      _id: 'byRole',
      value,
      relative,
    },
  });
}
