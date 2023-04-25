import type { LocatorChain } from '../locators/LocatorChain';
import { LocatorRelativePosition } from '../locators/LocatorRelativePosition';
import { CssLocator, PartLocatorType } from '../locators/PartLocatorType';

export function append(
  locatorBase: Readonly<LocatorChain> | Readonly<PartLocatorType>,
  ...locatorsToAppend: (PartLocatorType | Readonly<LocatorChain>)[]
): LocatorChain {
  const baseLocator: LocatorChain = Array.isArray(locatorBase) ? locatorBase : [locatorBase];
  const toAppend: PartLocatorType[] = locatorsToAppend.reduce((acc: PartLocatorType[], locator) => {
    return acc.concat(locator);
  }, []);

  return baseLocator.concat(toAppend);
}

export function findRootLocatorIndex(locator: LocatorChain): number {
  const length = locator.length;
  for (let i = length - 1; i >= 0; i--) {
    const loc = locator[i];
    if (loc.relative === LocatorRelativePosition.Root) {
      return i;
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
  return locator.selector;
}

export function overrideLocatorRelativePosition(
  locator: PartLocatorType,
  relative: LocatorRelativePosition,
): PartLocatorType {
  return locator.clone({
    relative,
  });
}
