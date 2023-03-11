import { CssLocator, LocatorRelativePosition, PartLocatorType } from '../locators/PartLocatorType';
import { LocatorChain } from '../types';

export function append(locator: Readonly<LocatorChain>, selector: PartLocatorType): LocatorChain {
  return locator.concat(selector);
}

export function findRootLocatorIndex(locator: LocatorChain): number {
  const length = locator.length;
  for (let i = length - 1; i >= 0; i--) {
    const loc = locator[i];
    if (typeof loc === 'object') {
      const l = loc as CssLocator;
      if (l.relative === LocatorRelativePosition.Root) {
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
    let separator = ' ';
    const statement = getLocatorStatement(loc);
    if (typeof loc !== 'string') {
      const l = loc as CssLocator;
      if (l.relative === LocatorRelativePosition.Same) {
        separator = '';
      }
    }

    return separator + statement;
  });

  return statements.join('').trim();
}

export function getLocatorStatement(locator: PartLocatorType): string {
  let statement = '';
  if (typeof locator === 'string') {
    statement = locator;
  } else {
    const l = locator as CssLocator;
    statement = l.selector;
  }

  return statement;
}
