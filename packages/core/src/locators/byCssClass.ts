import { escapeCssClassName } from '../utils/escapeUtil';
import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByCssClassSource = {
  _id: 'byCssClass';
  className: string | string[];
  relative: LocatorRelativePosition;
};

export function byCssClass(
  className: string | string[],
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): CssLocator {
  const classNames = Array.isArray(className) ? className : [className];
  const selector = classNames.map((cls) => `.${escapeCssClassName(cls)}`).join('');
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byCssClass',
      className,
      relative: relativeTo,
    },
  });
}
