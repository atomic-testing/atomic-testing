// TODO: Use descriptive selector instead of css selector so the selector can be reintepreted
import { escapeValue } from '../utils/escapeUtil';
import { assertNonEmpty } from '../utils/validation';

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
 * `'Descendant'`.
 * @example
 * ```ts
 * const passwordField = byInputType('password');
 * ```
 */
export function byInputType(type: string, relative: LocatorRelativePosition = 'Descendant'): CssLocator {
  assertNonEmpty(type, 'type');
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
