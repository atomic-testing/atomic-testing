// TODO: Use descriptive selector instead of css selector so the selector can be reintepreted

import { escapeValue } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByInputTypeSource = {
  _id: 'byInputType';
  type: string;
  relative: LocatorRelativePosition;
};

// to implementation other than CSS selector
export function byInputType(
  type: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): CssLocator {
  const selector = `input[type=${escapeValue(type)}]`;
  return new CssLocator(selector, {
    relative,
    source: {
      _id: 'byInputType',
      type,
      relative,
    },
  });
}
