import { CssLocator, LocatorRelativePosition, PartLocatorType } from './PartLocatorType';

export type ByCheckedSource = {
  _id: 'byChecked';
  checked: boolean;
  relative: LocatorRelativePosition;
};

export function byChecked(
  checked = true,
  relative: LocatorRelativePosition = LocatorRelativePosition.Same,
): PartLocatorType {
  let selector = ':checked';
  if (!checked) {
    selector = `:not(${selector})`;
  }
  const result = new CssLocator(selector);
  result.source = {
    _id: 'byChecked',
    checked,
    relative,
  };

  return result;
}
