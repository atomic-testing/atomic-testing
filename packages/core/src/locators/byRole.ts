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
 * To additionally disambiguate two same-role elements by their accessible name,
 * compose with {@link byAriaLabel} (verbatim `aria-label`) on the SAME element:
 *
 * ```ts
 * import { byAriaLabel, byRole, locatorUtil } from '@atomic-testing/core';
 * const openButton = locatorUtil.append(byRole('button'), byAriaLabel('Open', 'Same'));
 * ```
 *
 * Computed accessible names (`aria-labelledby` / `<label>` / text content) are
 * not CSS-expressible and are the job of the forthcoming name-aware `findByRole`
 * (deferred — see #923).
 *
 * @param value - The role value to match.
 * @param relative - Relative position of the locator. Defaults to
 * `'Descendant'`.
 * @example
 * ```ts
 * const dialog = byRole('dialog');
 * const root = byRole('presentation', 'Root');
 * ```
 */
export function byRole(value: string, relative: LocatorRelativePosition = 'Descendant'): CssLocator {
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
