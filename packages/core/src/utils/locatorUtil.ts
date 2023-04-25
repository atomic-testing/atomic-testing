import { CssLocator } from '../locators/CssLocator';
import { LocatorRelativePosition } from '../locators/LocatorRelativePosition';
import { PartLocator } from '../locators/PartLocator';

export function append(locatorBase: PartLocator, ...locatorsToAppend: PartLocator[]): PartLocator {
  const baseLocator: CssLocator[] = Array.isArray(locatorBase) ? locatorBase : [locatorBase];
  const toAppend: CssLocator[] = locatorsToAppend.reduce((acc: CssLocator[], locator) => {
    return acc.concat(locator);
  }, []);

  return baseLocator.concat(toAppend);
}

export function findRootLocatorIndex(locator: PartLocator): number {
  const list = Array.isArray(locator) ? locator : [locator];
  const length = list.length;
  for (let i = length - 1; i >= 0; i--) {
    const loc = list[i];
    if (loc.relative === LocatorRelativePosition.Root) {
      return i;
    }
  }

  return -1;
}

export function getEffectiveLocator(locator: PartLocator): CssLocator[] {
  const list = Array.isArray(locator) ? locator : [locator];
  const rootLocatorIndex = findRootLocatorIndex(list);
  return rootLocatorIndex === -1 ? list : list.slice(rootLocatorIndex);
}

export function toCssSelector(locator: PartLocator): string {
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

export function getLocatorStatement(locator: CssLocator): string {
  return locator.selector;
}

export function overrideLocatorRelativePosition(locator: PartLocator, relative: LocatorRelativePosition): PartLocator {
  if (Array.isArray(locator)) {
    return (locator as readonly CssLocator[]).map((loc) =>
      loc.clone({
        relative,
      }),
    );
  }
  return (locator as CssLocator).clone({
    relative,
  });
}
