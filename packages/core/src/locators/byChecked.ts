// TODO: Use descriptive selector instead of css selector so the selector can be reintepreted

import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

// to implementaiton other than CSS selector
export function byChecked(checked = true): PartLocatorType {
  let selector = ':checked';
  if (!checked) {
    selector = `:not(${selector})`;
  }
  return {
    type: LocatorType.Css,
    selector,
    relative: LocatorRelativePosition.Same,
  };
}
