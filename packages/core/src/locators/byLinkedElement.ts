import { LinkedCssLocator, LinkedCssLocatorValueExtract } from './LinkedCssLocator';
import { LocatorRelativePosition } from './LocatorRelativePosition';
import { PartLocator } from './PartLocator';

export function byLinkedElement(relative: LocatorRelativePosition = LocatorRelativePosition.Descendent) {
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
