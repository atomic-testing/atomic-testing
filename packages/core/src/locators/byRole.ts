import { escapeValue } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByRoleSource = {
  _id: 'byRole';
  value: string;
  relative: LocatorRelativePosition;
};

export function byRole(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent
): CssLocator {
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
