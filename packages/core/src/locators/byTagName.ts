import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

export type ByTagNameSource = {
  _id: 'byTagName';
  tagName: string;
  relative: LocatorRelativePosition;
};

export function byTagName(
  tagName: string,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): PartLocatorType {
  const result = new CssLocator(tagName);
  result.relative = relative;
  result.source = {
    _id: 'byTagName',
    tagName,
    relative,
  };
  return result;
}
