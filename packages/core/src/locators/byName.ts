import { escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition, LocatorTypeLookup, PartLocatorType } from './PartLocatorType';

export function byName(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const sanitized = escapeValue(value);
  return {
    type: LocatorTypeLookup.Css,
    selector: `[name="${sanitized}"]`,
    relative,
  };
}
