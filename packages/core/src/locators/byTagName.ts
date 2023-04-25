import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByTagNameSource = {
  _id: 'byTagName';
  tagName: string;
  relative: LocatorRelativePosition;
};

export function byTagName(
  tagName: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): CssLocator {
  return new CssLocator(tagName, {
    relative,
    source: {
      _id: 'byTagName',
      tagName,
      relative,
    },
  });
}
