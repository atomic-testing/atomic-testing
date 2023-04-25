import { escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { CssLocator, PartLocatorType } from './PartLocatorType';

export type ByRoleSource = {
  _id: 'byRole';
  value: string;
  relative: LocatorRelativePosition;
};

export function byRole(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
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
