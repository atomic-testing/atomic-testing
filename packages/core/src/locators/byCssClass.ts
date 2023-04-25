import { escapeCssClassName } from '../utils/escapeUtil';
import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

export type ByCssClassSource = {
  _id: 'byCssClass';
  className: string | string[];
  relative: LocatorRelativePosition;
};

export function byCssClass(
  className: string | string[],
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const classNames = Array.isArray(className) ? className : [className];
  const selector = classNames.map((cls) => `.${escapeCssClassName(cls)}`).join('');
  const result = new CssLocator(selector);
  result.relative = relativeTo;
  result.source = {
    _id: 'byCssClass',
    className,
    relative: relativeTo,
  };

  return result;
}
