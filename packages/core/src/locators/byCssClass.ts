import { escapeCssClassName } from '../utils/escapeUtil';

import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByCssClassSource = {
  _id: 'byCssClass';
  className: string | string[];
  relative: LocatorRelativePosition;
};

/**
 * Locate elements using their CSS class name.
 *
 * Providing multiple class names will result in a selector that matches
 * elements containing all the classes.
 *
 * @param className - One or more class names to match.
 * @param relativeTo - Relative position of the locator. Defaults to
 * {@link LocatorRelativePosition.Descendent}.
 * @example
 * ```ts
 * const icon = byCssClass('MuiIcon-root');
 * const menuItem = byCssClass(['MuiListItem-root', 'active']);
 * ```
 */
export function byCssClass(
  className: string | string[],
  relativeTo: LocatorRelativePosition = LocatorRelativePosition.Descendent
): CssLocator {
  const classNames = Array.isArray(className) ? className : [className];
  const selector = classNames.map(cls => `.${escapeCssClassName(cls)}`).join('');
  return new CssLocator(selector, {
    relative: relativeTo,
    source: {
      _id: 'byCssClass',
      className,
      relative: relativeTo,
    },
  });
}
