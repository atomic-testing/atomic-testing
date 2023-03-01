import { CssLocator, LocatorRelativePosition, LocatorType } from '../locators/PartLocatorType';
import { LocatorChain } from '../types';

export function append(locator: Readonly<LocatorChain>, selector: LocatorType): LocatorChain {
  return locator.concat(selector);
}

export function findRootLocatorIndex(locator: LocatorChain): number {
  const length = locator.length;
  for (let i = length - 1; i >= 0; i--) {
    const loc = locator[i];
    if (typeof loc === 'object') {
      const l = loc as CssLocator;
      if (l.relative === LocatorRelativePosition.documentRoot) {
        return i;
      }
    }
  }

  return -1;
}

export function getEffectiveLocator(locator: LocatorChain): LocatorChain {
  const rootLocatorIndex = findRootLocatorIndex(locator);
  return rootLocatorIndex === -1 ? locator : locator.slice(rootLocatorIndex);
}

export function toCssSelector(locator: LocatorChain): string {
  const effectiveLocator = getEffectiveLocator(locator);
  const statements = effectiveLocator.map((loc) => {
    if (typeof loc === 'string') {
      return loc;
    }

    const l = loc as CssLocator;
    return l.selector;
  });

  return statements.join(' ');
}
