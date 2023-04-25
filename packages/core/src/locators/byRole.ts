import { escapeValue } from '../utils/escapeUtil';
import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

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
  const result = new CssLocator(`[role="${sanitized}"]`);
  result.relative = relative;
  result.source = {
    _id: 'byRole',
    value,
    relative,
  };
  return result;
}
