import 'css.escape';

import { LocatorRelativePosition, LocatorType, PartLocatorType } from './PartLocatorType';

export function byName(
  value: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const sanitized = CSS.escape(value);
  return {
    type: LocatorType.Css,
    selector: `[name="${sanitized}"]`,
    relative,
  };
}
