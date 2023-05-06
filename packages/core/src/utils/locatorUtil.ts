import { Optional } from '../dataTypes';
import { Interactor } from '../interactor';
import { byAttribute } from '../locators';
import { CssLocator } from '../locators/CssLocator';
import { LinkedCssLocator } from '../locators/LinkedCssLocator';
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

export async function toCssSelector(locator: PartLocator, interactor: Interactor): Promise<string> {
  const effectiveLocator = getEffectiveLocator(locator);
  const statements: string[] = [];
  for (let i = 0; i < effectiveLocator.length; i++) {
    let statement = '';
    const loc = effectiveLocator[i];
    if (loc instanceof LinkedCssLocator) {
      const currentContext = effectiveLocator.slice(0, i);
      statement = await getLinkedCssLocatorStatement(loc, currentContext, interactor);
    } else {
      statement = getLocatorStatement(loc);
    }
    const separator = loc.relative === LocatorRelativePosition.Same ? '' : ' ';
    statements.push(separator + statement);
  }

  return Promise.resolve(statements.join('').trim());
}

export async function getLinkedCssLocatorStatement(
  locator: LinkedCssLocator,
  context: PartLocator,
  interactor: Interactor,
): Promise<string> {
  const matchTargetValue = await getLinkedCssLocatorMatchingTargetValue(locator, context, interactor);

  if (matchTargetValue == null) {
    // TODO: Produce more descriptive error to help with troubleshooting
    throw new Error('Match target not found for LinkedCssLocator');
  }

  let resolvedLocator: CssLocator;
  if (locator.valueExtract.type === 'attribute') {
    resolvedLocator = byAttribute(locator.valueExtract.attributeName, matchTargetValue);
  } else {
    throw new Error(`Cannot handle valueExtract method type ${locator.valueExtract.type}`);
  }
  return getLocatorStatement(resolvedLocator);
}

export async function getLinkedCssLocatorMatchingTargetValue(
  locator: LinkedCssLocator,
  context: PartLocator,
  interactor: Interactor,
): Promise<Optional<string>> {
  if (locator.matchingTargetValueExtract.type === 'attribute') {
    const entireLocator = append(context, locator.matchingTargetLocator);
    return await interactor.getAttribute(entireLocator, locator.matchingTargetValueExtract.attributeName);
  }

  throw new Error(`Cannot handle valueExtract method type ${locator.matchingTargetValueExtract.type}`);
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
