import { LocatorRelativePosition, LocatorTypeLookup, PartLocatorType } from './PartLocatorType';

export function byTagName(
  tagName: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  return {
    type: LocatorTypeLookup.Css,
    selector: tagName,
    relative,
  };
}
