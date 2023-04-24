import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

export function byCssSelector(
  selector: string,
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  return {
    type: LocatorType.Css,
    selector,
    relative: relativeTo,
  };
}
