import { escapeValue } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByDataTestIdSource = {
  _id: 'byDataTestId';
  id: string | string[];
  relative: LocatorRelativePosition;
};

/**
 * Locate an element by its `data-testid` attribute.
 *
 * When an array of ids is provided, they will be chained as descendant
 * selectors in the resulting locator.
 *
 * @param id - Single id or an array of ids to match against the
 * `data-testid` attribute.
 * @param relativeTo - How the locator is related to the current locator in a
 * locator chain. Defaults to `'Descendant'`.
 * @example
 * ```ts
 * const submitButton = byDataTestId('submit');
 * const itemLabel = byDataTestId(['list', 'item-label']);
 * ```
 */
export function byDataTestId(id: string | string[], relativeTo: LocatorRelativePosition = 'Descendant'): CssLocator {
  const ids = Array.isArray(id) ? id : [id];
  const selector = ids.map(idVal => `[data-testid="${escapeValue(idVal)}"]`).join(' ');
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byDataTestId',
      id,
      relative: relativeTo,
    },
  });
}
