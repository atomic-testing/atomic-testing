import { CssLocator } from '../locators/CssLocator';
import { LocatorRelativePosition } from '../locators/LocatorRelativePosition';
import { CssLocatorChain, PartLocator } from '../locators/PartLocator';

export function isChain(locator: PartLocator): locator is CssLocatorChain {
  return Array.isArray(locator);
}

export function toChain(locator: PartLocator): CssLocatorChain {
  return isChain(locator) ? locator : [locator];
}

export function append(locatorBase: PartLocator, ...locatorsToAppend: PartLocator[]): PartLocator {
  const baseLocator: CssLocatorChain = toChain(locatorBase);
  const toAppend: CssLocatorChain = locatorsToAppend.reduce((acc: CssLocatorChain, locator) => {
    return acc.concat(locator);
  }, []);

  return baseLocator.concat(toAppend);
}

export function findRootLocatorIndex(locator: PartLocator): number {
  const list = toChain(locator);
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
  const list = toChain(locator);
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

export interface OverrideLocatorRelativePositionOption {
  shouldOverride: (locator: CssLocator, index: number) => boolean;
}

export const defaultOverrideLocatorRelativePositionOption: Readonly<OverrideLocatorRelativePositionOption> =
  Object.freeze({
    shouldOverride: (_: CssLocator, index: number) => index === 0,
  });

/**
 * Override the supplied locator's relative position, if the supplied locator is an array of locators,
 * only the first one is overridden
 * @param locator
 * @param relative
 * @param option
 * @returns
 */
export function overrideLocatorRelativePosition(
  locator: PartLocator,
  relative: LocatorRelativePosition,
  option: Partial<Readonly<OverrideLocatorRelativePositionOption>> = defaultOverrideLocatorRelativePositionOption,
): PartLocator {
  if (Array.isArray(locator)) {
    const actualOption: Readonly<OverrideLocatorRelativePositionOption> = {
      ...defaultOverrideLocatorRelativePositionOption,
      ...option,
    };
    return (locator as readonly CssLocator[]).map((loc, index) => {
      return actualOption.shouldOverride(loc, index)
        ? loc.clone({
            relative,
          })
        : loc;
    });
  }
  return (locator as CssLocator).clone({
    relative,
  });
}
