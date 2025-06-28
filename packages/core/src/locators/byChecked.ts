import { CssLocator } from './CssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export type ByCheckedSource = {
  _id: 'byChecked';
  checked: boolean;
  relative: LocatorRelativePosition;
};

/**
 * Locate a checkbox or radio input based on its checked state.
 *
 * @param checked - Whether the element should be checked. Defaults to `true`.
 * @param relative - Relative position for the locator. Defaults to
 * {@link LocatorRelativePosition.Same} so it can be chained with the checkbox
 * locator itself.
 * @example
 * ```ts
 * const unchecked = byChecked(false);
 * ```
 */
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
