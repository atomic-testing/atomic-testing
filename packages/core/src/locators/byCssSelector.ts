import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { PartLocatorType } from './PartLocatorType';

export type ByCssSelectorSource = {
  _id: 'byCssSelector';
  selector: string;
  relative: LocatorRelativePosition;
};

export function byCssSelector(
  selector: string,
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byCssSelector',
      selector,
      relative: relativeTo,
    },
  });
}
