import { Optional } from '../dataTypes';
import { LocatorResolutionError } from '../errors/LocatorResolutionError';
import { Interactor } from '../interactor/Interactor';
import { byAttribute } from '../locators/byAttribute';
import { CssLocator } from '../locators/CssLocator';
import { LinkedCssLocator } from '../locators/LinkedCssLocator';
import type { LocatorRelativePosition } from '../locators/LocatorRelativePosition';
import { CssLocatorChain, PartLocator } from '../locators/PartLocator';

/**
 * The portable document-root selector an empty locator chain reduces to. `<html>`
 * in the DOM, matched by both `document.querySelector(':root')` (jsdom) and
 * `page.locator(':root')` (Chromium). Used so the engine-root locator (`[]`, in
 * the DOM/Playwright adapters) resolves to a real element instead of `''`, which
 * throws a CSS parse error in every engine. See #1048.
 */
export const documentRootSelector = ':root';

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
    const loc = effectiveLocator[i];
    const statement = getLocatorStatement(loc);
    // The first statement has no left operand, so it takes no leading combinator
    // (a leading ' ' was always trimmed away; forcing '' here additionally keeps
    // a `Child`-positioned head from emitting an invalid leading `>`).
    const separator = i === 0 ? '' : getRelativeSeparator(loc.relative);
    statements.push(separator + statement);
  }

  const selector = statements.join('').trim();
  // An empty locator chain (the engine root, which the DOM/Playwright adapters
  // mount at `[]`) reduces to `''`. Running `''` as a selector throws a
  // SyntaxError, crashing every engine-level read/mutation, so fall back to the
  // portable document-root selector. See #1048.
  return Promise.resolve(selector === '' ? documentRootSelector : selector);
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

/**
 * The CSS combinator that joins a statement to the one before it, per the
 * statement's {@link LocatorRelativePosition}:
 * - `'Same'` — no combinator, so the selectors compound onto one element.
 * - `'Child'` — the child combinator (` > `), matching only a direct child.
 * - everything else (`'Descendant'`/`'Root'`) — the descendant combinator (a
 *   single space).
 */
function getRelativeSeparator(relative: LocatorRelativePosition): string {
  switch (relative) {
    case 'Same':
      return '';
    case 'Child':
      return ' > ';
    default:
      return ' ';
  }
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

// Re-exported from a leaf module so the interactor errors can build their
// `locatorDescription` from it without importing `locatorUtil` (which throws
// LocatorResolutionError) — breaking a `locatorUtil ↔ error` import cycle while
// keeping `locatorUtil.getLocatorInfoForErrorLog` on the public surface.
export { getLocatorInfoForErrorLog } from './getLocatorInfoForErrorLog';
