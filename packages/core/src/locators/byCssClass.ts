import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

export function byCssClass(
  className: string | string[],
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const classNames = Array.isArray(className) ? className : [className];
  const selector = classNames.map((cls) => `.${cls}`).join('');

  return {
    type: LocatorType.Css,
    selector,
    relative: relativeTo,
  };
}
