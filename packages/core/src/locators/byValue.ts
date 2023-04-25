import { escapeValue } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { PartLocatorType } from './PartLocatorType';

export type ByValueSource = {
  _id: 'byValue';
  value: string;
  relative: LocatorRelativePosition;
};

export function byValue(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const sanitized = escapeValue(value);
  return new CssLocator(`[value="${sanitized}"]`, {
    relative,
    source: {
      _id: 'byValue',
      value,
      relative,
    },
  });
}
