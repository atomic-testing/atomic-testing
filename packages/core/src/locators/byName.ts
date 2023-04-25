import { escapeValue } from '../utils/escapeUtil';
import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

export type ByNameSource = {
  _id: 'byName';
  value: string;
  relative: LocatorRelativePosition;
};

export function byName(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const sanitized = escapeValue(value);
  const result = new CssLocator(`[name="${sanitized}"]`);
  result.relative = relative;
  result.source = {
    _id: 'byName',
    value,
    relative,
  };
  return result;
}
