import { escapeValue } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByDataTestIdSource = {
  _id: 'byDataTestId';
  id: string | string[];
  relative: LocatorRelativePosition;
};

export function byDataTestId(
  id: string | string[],
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): CssLocator {
  const ids = Array.isArray(id) ? id : [id];
  const selector = ids.map((idVal) => `[data-testid="${escapeValue(idVal)}"]`).join(' ');
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byDataTestId',
      id,
      relative: relativeTo,
    },
  });
}
