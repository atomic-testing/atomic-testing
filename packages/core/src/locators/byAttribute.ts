import { escapeName, escapeValue } from '../utils/escapeUtil';
import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

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
  const result = new CssLocator(selector);
  result.source = {
    _id: 'byAttribute',
    name,
    value,
    relativeTo,
  };

  return result;
}
