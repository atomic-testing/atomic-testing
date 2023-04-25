import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { PartLocatorType } from './PartLocatorType';

export type ByTagNameSource = {
  _id: 'byTagName';
  tagName: string;
  relative: LocatorRelativePosition;
};

export function byTagName(
  tagName: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  return new CssLocator(tagName, {
    relative,
    source: {
      _id: 'byTagName',
      tagName,
      relative,
    },
  });
}
