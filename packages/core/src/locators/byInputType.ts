// TODO: Use descriptive selector instead of css selector so the selector can be reintepreted
import { escapeValue } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByInputTypeSource = {
  _id: 'byInputType';
  type: string;
  relative: LocatorRelativePosition;
};

// to implementation other than CSS selector
/**
 * Locate an `<input>` element by its `type` attribute.
 *
 * @param type - The value of the `type` attribute such as `text`, `checkbox`
 * or `radio`.
 * @param relative - Relative position of the locator. Defaults to
 * `'Descendent'`.
 * @example
 * ```ts
 * const passwordField = byInputType('password');
 * ```
 */
export function byInputType(type: string, relative: LocatorRelativePosition = 'Descendent'): CssLocator {
  const selector = `input[type=${escapeValue(type)}]`;
  return new CssLocator(selector, {
    relative,
    source: {
      _id: 'byInputType',
      type,
      relative,
    },
  });
}
