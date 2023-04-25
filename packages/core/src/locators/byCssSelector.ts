import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

export type ByCssSelectorSource = {
  _id: 'byCssSelector';
  selector: string;
  relative: LocatorRelativePosition;
};

export function byCssSelector(
  selector: string,
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const result = new CssLocator(selector);
  result.relative = relativeTo;
  result.source = {
    _id: 'byCssSelector',
    selector,
    relative: relativeTo,
  };

  return result;
}
