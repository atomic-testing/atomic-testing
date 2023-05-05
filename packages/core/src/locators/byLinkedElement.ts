import { CssLocator } from './CssLocator';
import { LinkedCssLocator, LinkedCssLocatorValueExtract } from './LinkedCssLocator';

export function byLinkedElement(
  matchingTargetLocator: CssLocator,
  matchExtract: LinkedCssLocatorValueExtract,
  selfExtract: LinkedCssLocatorValueExtract,
): LinkedCssLocator {
  return new LinkedCssLocator('byLinkedElement', {
    valueExtract: selfExtract,
    matchingTargetLocator: matchingTargetLocator,
    matchingTargetValueExtract: matchExtract,
  });
}
