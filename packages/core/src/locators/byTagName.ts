import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

export function byTagName(
  tagName: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  return {
    type: LocatorType.Css,
    selector: tagName,
    relative,
  };
}
