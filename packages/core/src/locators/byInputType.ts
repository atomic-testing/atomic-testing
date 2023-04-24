// TODO: Use descriptive selector instead of css selector so the selector can be reintepreted

import { escapeValue } from '../utils/escapeUtil';
import { LocatorRelativePosition, LocatorTypeLookup, PartLocatorType } from './PartLocatorType';

// to implementation other than CSS selector
export function byInputType(
  type: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const selector = `input[type=${escapeValue(type)}]`;
  return {
    type: LocatorTypeLookup.Css,
    selector,
    relative,
  };
}
