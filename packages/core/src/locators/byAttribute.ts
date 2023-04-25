import { escapeName, escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { CssLocator, PartLocatorType } from './PartLocatorType';

export type ByAttributeSource = {
  _id: 'byAttribute';
  name: string;
  value: string;
  relativeTo: LocatorRelativePosition;
};

export function byAttribute(
  name: string,
  value: string,
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const selector = `[${escapeName(name)}="${escapeValue(value)}"]`;
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byAttribute',
      name,
      value,
      relativeTo,
    },
  });
}
