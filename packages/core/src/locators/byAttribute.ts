import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

export function byAttribute(
  name: string,
  value: string,
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const selector = `[${name}="${encodeURIComponent(value)}"]`;

  return {
    type: LocatorType.Css,
    selector,
    relative: relativeTo,
  };
}
