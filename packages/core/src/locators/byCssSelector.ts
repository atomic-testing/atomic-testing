import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByCssSelectorSource = {
  _id: 'byCssSelector';
  selector: string;
  relative: LocatorRelativePosition;
};

export function byCssSelector(
  selector: string,
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent
): CssLocator {
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byCssSelector',
      selector,
      relative: relativeTo,
    },
  });
}
