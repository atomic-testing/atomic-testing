import { escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition, LocatorTypeLookup, PartLocatorType } from './PartLocatorType';

export function byRole(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const sanitized = escapeValue(value);
  return {
    type: LocatorTypeLookup.Css,
    selector: `[role="${sanitized}"]`,
    relative,
  };
}
