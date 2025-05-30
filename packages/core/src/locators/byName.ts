import { escapeValue } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByNameSource = {
  _id: 'byName';
  value: string;
  relative: LocatorRelativePosition;
};

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
