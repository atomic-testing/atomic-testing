import { Optional } from '../dataTypes';
import { LocatorResolutionError } from '../errors/LocatorResolutionError';
import { Interactor } from '../interactor/Interactor';
import { byAttribute } from '../locators/byAttribute';
import { CssLocator } from '../locators/CssLocator';
import { LinkedCssLocator } from '../locators/LinkedCssLocator';
import type { LocatorRelativePosition } from '../locators/LocatorRelativePosition';
import { CssLocatorChain, PartLocator } from '../locators/PartLocator';

export function isChain(locator: PartLocator): locator is CssLocatorChain {
  return Array.isArray(locator);
}

export function toChain(locator: PartLocator): CssLocatorChain {
  return isChain(locator) ? locator : [locator];
}

export function append(locatorBase: PartLocator, ...locatorsToAppend: PartLocator[]): PartLocator {
  const baseLocator: CssLocatorChain = toChain(locatorBase);
  const toAppend: CssLocator[] = locatorsToAppend.reduce((acc: CssLocator[], locator: PartLocator) => {
    if (locator instanceof CssLocator) {
      return acc.concat(locator);
    }
    return acc.concat(...(locator as CssLocatorChain));
  }, [] as CssLocator[]);

  return baseLocator.concat(toAppend);
}

function findRootLocatorIndex(locator: PartLocator): number {
  const list = toChain(locator);
  const length = list.length;
  for (let i = length - 1; i >= 0; i--) {
    const loc = list[i];
    if (loc.relative === 'Root') {
      return i;
    }
  }

  return -1;
}

async function toPrimitiveLocators(locator: PartLocator, interactor: Interactor): Promise<CssLocator[]> {
  const list = toChain(locator);
  let result: CssLocator[] = [];
  for (let i = 0; i < list.length; i++) {
    const loc = list[i];
    if (loc instanceof LinkedCssLocator) {
      const currentContext = list.slice(0, i);
      const resolved = await getLinkedCssLocator(loc, currentContext, interactor);
      result = result.concat(resolved);
    } else {
      result.push(loc);
    }
  }

  return result;
}

async function getEffectiveLocator(locator: PartLocator, interactor: Interactor): Promise<CssLocator[]> {
  const list = await toPrimitiveLocators(locator, interactor);
  const rootLocatorIndex = findRootLocatorIndex(list);
  // If the locator is linked, we should skip because it has matching locator
  // would need the context
  const shouldSkip = rootLocatorIndex === -1 || list[rootLocatorIndex].complexity === 'linked';
  return shouldSkip ? list : list.slice(rootLocatorIndex);
}

/**
 * Reduce a {@link PartLocator} to the single CSS selector the interactor runs
 * against the DOM. This is the one locator-resolution seam in the system, and it
 * is **CSS-only by design** for 1.0 — every locator must express itself as CSS
 * here (see [ADR-008](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/008-css-dom-only-locator-boundary.md)).
 */
export async function toCssSelector(locator: PartLocator, interactor: Interactor): Promise<string> {
  const effectiveLocator = await getEffectiveLocator(locator, interactor);
  const statements: string[] = [];
  for (let i = 0; i < effectiveLocator.length; i++) {
    let statement = '';
    const loc = effectiveLocator[i];
    statement = getLocatorStatement(loc);
    const separator = loc.relative === 'Same' ? '' : ' ';
    statements.push(separator + statement);
  }

  return Promise.resolve(statements.join('').trim());
}

async function getLinkedCssLocator(
  locator: LinkedCssLocator,
  context: PartLocator,
  interactor: Interactor
): Promise<PartLocator> {
  const matchTargetValue = await getLinkedCssLocatorMatchingTargetValue(locator, context, interactor);

  if (matchTargetValue == null) {
    throw new LocatorResolutionError(locator, 'match target of LinkedCssLocator not found');
  }

  let resolvedLocator: CssLocator;
  if (locator.valueExtract.type === 'attribute') {
    resolvedLocator = byAttribute(locator.valueExtract.attributeName, matchTargetValue, locator.relative);
  } else {
    throw new LocatorResolutionError(locator, `unsupported valueExtract type "${locator.valueExtract.type}"`);
  }
  return resolvedLocator;
}

export async function getLinkedCssLocatorMatchingTargetValue(
  locator: LinkedCssLocator,
  context: PartLocator,
  interactor: Interactor
): Promise<Optional<string>> {
  if (locator.matchingTargetValueExtract.type === 'attribute') {
    const entireLocator = append(context, locator.matchingTargetLocator);
    return await interactor.getAttribute(entireLocator, locator.matchingTargetValueExtract.attributeName);
  }

  throw new LocatorResolutionError(
    locator,
    `unsupported matchingTargetValueExtract type "${locator.matchingTargetValueExtract.type}"`
  );
}

function getLocatorStatement(locator: CssLocator): string {
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
  option: Partial<Readonly<OverrideLocatorRelativePositionOption>> = defaultOverrideLocatorRelativePositionOption
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

/**
 * Display a rough description of the locators for error logging
 * this is an estimate, not a precise description with the absence of interactor
 * locators such as LinkedCssLocator would not be interpreted correctly
 * @param locator
 * @returns
 */
export function getLocatorInfoForErrorLog(locator: PartLocator): string {
  const locators = Array.isArray(locator) ? locator : [locator];

  const selectors: string[] = [];
  for (const loc of locators) {
    selectors.push(loc.selector);
  }

  return selectors.join(', ');
}
