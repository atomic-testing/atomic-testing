// TODO: Use descriptive selector instead of css selector so the selector can be reintepreted

import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

// to implementation other than CSS selector
export function byInputType(
  type: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const selector = `input[type=${type}]`;
  return {
    type: LocatorType.Css,
    selector,
    relative,
  };
}
