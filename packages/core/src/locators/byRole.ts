import { escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

export function byRole(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const sanitized = escapeValue(value);
  return {
    type: LocatorType.Css,
    selector: `[role="${sanitized}"]`,
    relative,
  };
}
