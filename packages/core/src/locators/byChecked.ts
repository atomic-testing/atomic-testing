import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByCheckedSource = {
  _id: 'byChecked';
  checked: boolean;
  relative: LocatorRelativePosition;
};

export function byChecked(
  checked = true,
  relative: LocatorRelativePosition = LocatorRelativePosition.Same
): CssLocator {
  let selector = ':checked';
  if (!checked) {
    selector = `:not(${selector})`;
  }
  return new CssLocator(selector, {
    relative,
    source: {
      _id: 'byChecked',
      checked,
      relative,
    },
  });
}
