import { LinkedCssLocator, LinkedCssLocatorValueExtract } from './LinkedCssLocator';
import type { LocatorRelativePosition } from './LocatorRelativePosition';
import { PartLocator } from './PartLocator';

/**
 * Experimental locator that matches an element by relating it to another
 * element on the page. It is useful when two elements share related
 * attributes.
 *
 * @param relative - Relative position for the resulting locator. Defaults to
 * `'Descendant'`.
 * @example
 * ```ts
 * const label = byLinkedElement().onLinkedElement(byDataTestId('input'))
 *   .extractAttribute('for')
 *   .toMatchMyAttribute('id');
 * ```
 */
export function byLinkedElement(relative: LocatorRelativePosition = 'Descendant') {
  return {
    onLinkedElement: (locator: PartLocator) => {
      return {
        extractAttribute: (attributeName: string) => {
          const matchExtract: LinkedCssLocatorValueExtract = {
            type: 'attribute',
            attributeName,
          };
          return {
            toMatchMyAttribute: (myAttributeName: string): LinkedCssLocator => {
              const valueExtract: LinkedCssLocatorValueExtract = {
                type: 'attribute',
                attributeName: myAttributeName,
              };
              return new LinkedCssLocator('byLinkedElement', {
                valueExtract,
                matchingTargetLocator: locator,
                matchingTargetValueExtract: matchExtract,
                relative,
              });
            },
          };
        },
      };
    },
  };
}
