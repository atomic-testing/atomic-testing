import { escapeValue } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';
import type { PartLocator } from './PartLocator';

export type ByAriaLabelSource = {
  _id: 'byAriaLabel';
  value: string;
  relative: LocatorRelativePosition;
};

/**
 * Locate elements by the verbatim value of their `aria-label` attribute.
 *
 * This matches the literal `aria-label` attribute only — it does NOT resolve the
 * computed accessible name (from `aria-labelledby`, an associated `<label>`, or
 * text content), which is not CSS-expressible and is the job of the forthcoming
 * name-aware `findByRole` (deferred — see #923).
 *
 * Most commonly composed with {@link byRole} on the SAME element to tell two
 * same-role siblings apart without relying on unstable (e.g. StyleX-hashed) class
 * names. Use {@link locatorUtil.and} to compound the matchers onto one element:
 *
 * ```ts
 * import { byAriaLabel, byRole, locatorUtil } from '@atomic-testing/core';
 * const openButton = locatorUtil.and(byRole('button'), byAriaLabel('Open'));
 * const closeButton = locatorUtil.and(byRole('button'), byAriaLabel('Close'));
 * ```
 *
 * @param value - Verbatim `aria-label` to match.
 * @param relative - Relative position of the locator. Defaults to `'Descendant'`.
 * @example
 * ```ts
 * const close = byAriaLabel('Close');
 * ```
 */
export function byAriaLabel(value: string, relative: LocatorRelativePosition = 'Descendant'): PartLocator {
  const sanitized = escapeValue(value);
  return [
    new CssLocator(`[aria-label="${sanitized}"]`, {
      relative,
      source: {
        _id: 'byAriaLabel',
        value,
        relative,
      },
    }),
  ];
}
