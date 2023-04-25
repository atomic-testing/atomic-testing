import { escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { CssLocator, PartLocatorType } from './PartLocatorType';

export type ByDataTestIdSource = {
  _id: 'byDataTestId';
  id: string | string[];
  relative: LocatorRelativePosition;
};

export function byDataTestId(
  id: string | string[],
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
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
