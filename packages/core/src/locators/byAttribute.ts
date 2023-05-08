import { escapeId, escapeName, escapeValue } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

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
): CssLocator {
  const selector = name === 'id' ? `#${escapeId(value)}` : `[${escapeName(name)}="${escapeValue(value)}"]`;
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
