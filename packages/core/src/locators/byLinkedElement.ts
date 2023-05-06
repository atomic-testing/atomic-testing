import { CssLocator } from './CssLocator';
import { LinkedCssLocator, LinkedCssLocatorValueExtract } from './LinkedCssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';

export function byLinkedElement(
  matchingTargetLocator: CssLocator,
  matchExtract: LinkedCssLocatorValueExtract,
  selfExtract: LinkedCssLocatorValueExtract,
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent,
): LinkedCssLocator {
  return new LinkedCssLocator('byLinkedElement', {
    valueExtract: selfExtract,
    matchingTargetLocator: matchingTargetLocator,
    matchingTargetValueExtract: matchExtract,
    relative,
  });
}
