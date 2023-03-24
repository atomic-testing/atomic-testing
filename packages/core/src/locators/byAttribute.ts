import { escapeName, escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

export function byAttribute(
  name: string,
  value: string,
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const selector = `[${escapeName(name)}="${escapeValue(value)}"]`;

  return {
    type: LocatorType.Css,
    selector,
    relative: relativeTo,
  };
}
