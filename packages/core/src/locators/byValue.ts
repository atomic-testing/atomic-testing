import { escapeValue } from '../utils/escapeUtil';
import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

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
  const result = new CssLocator(`[value="${sanitized}"]`);
  result.relative = relative;
  result.source = {
    _id: 'byValue',
    value,
    relative,
  };
  return result;
}
