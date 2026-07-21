import { Optional } from '../dataTypes';
import { LocatorResolutionError } from '../errors/LocatorResolutionError';
import { Interactor } from '../interactor/Interactor';
import { byAttribute } from '../locators/byAttribute';
import { CssLocator } from '../locators/CssLocator';
import { LinkedCssLocator } from '../locators/LinkedCssLocator';
import type { LocatorRelativePosition } from '../locators/LocatorRelativePosition';
import { PartLocator } from '../locators/PartLocator';

/**
 * The portable document-root selector an empty locator chain reduces to. `<html>`
 * in the DOM, matched by both `document.querySelector(':root')` (jsdom) and
 * `page.locator(':root')` (Chromium). Used so the engine-root locator (`[]`, in
 * the DOM/Playwright adapters) resolves to a real element instead of `''`, which
 * throws a CSS parse error in every engine. See #1048.
 */
export const documentRootSelector = ':root';

export function append(locatorBase: PartLocator, ...locatorsToAppend: PartLocator[]): PartLocator {
  return locatorBase.concat(...locatorsToAppend);
}

function assertSamePrimitive(locator: PartLocator): CssLocator {
  if (locator.length !== 1) {
    throw new Error(`locatorUtil.and() composes single locators only; received a ${locator.length}-locator chain.`);
  }
  const [only] = locator;
  if (only.complexity !== 'primitive') {
    throw new Error(
      'locatorUtil.and() composes same-element primitive matchers only; ' +
        'linked locators resolve at runtime and cannot be folded into a static compound.'
    );
  }
  return only;
}

/**
 * Compose additional matchers onto the SAME element, producing one compound
 * CSS selector — e.g. `[role="button"]` and `[aria-label="Open"]` together
 * become `[role="button"][aria-label="Open"]`.
 *
 * This is the ergonomic, footgun-free form of same-element composition: it
 * supersedes `append(byRole('button'), byAriaLabel('Open', 'Same'))` — there is
 * no `'Same'` argument to remember (the relationship no longer has to be stored
 * on the appended child) and no wrapper call. The result keeps `base`'s position
 * relative to its parent; the appended matchers contribute only their
 * attribute/selector fragment.
 *
 * Same-element, pure-CSS only:
 * - Put a tag-name matcher ({@link byTagName}) FIRST — a CSS type selector is
 *   only valid at the start of a compound (`input[type="text"]`, never
 *   `[type="text"]input`).
 * - Computed accessible names (`aria-labelledby` / `<label>` / text) are not
 *   CSS-expressible and stay out of scope (see #923); compose a verbatim
 *   `aria-label` via {@link byAriaLabel} instead.
 * - Linked locators ({@link byLinkedElement}) resolve at runtime and cannot be
 *   folded into a static compound; passing one as `base` or as a matcher throws.
 * - `base` and every matcher must each be a single-locator chain (a `by*`
 *   builder's direct output) — the output of `append`/`and` cannot itself be
 *   composed further, since there would be no single element left to compound.
 *
 * @param base - The locator to compound additional matchers onto.
 * @param locators - Additional same-element matchers to compound onto `base`.
 * @example
 * ```ts
 * const openButton = locatorUtil.and(byRole('button'), byAriaLabel('Open'));
 * const activeTab = locatorUtil.and(byRole('tab'), byAttribute('aria-selected', 'true'));
 * ```
 */
export function and(base: PartLocator, ...locators: PartLocator[]): PartLocator {
  const parts = [base, ...locators].map(assertSamePrimitive);
  const selector = parts.map(part => part.selector).join('');
  return [new CssLocator(selector, { relative: parts[0].relative })];
}

function findRootLocatorIndex(locator: PartLocator): number {
  const length = locator.length;
  for (let i = length - 1; i >= 0; i--) {
    const loc = locator[i];
    if (loc.relative === 'Root') {
      return i;
    }
  }

  return -1;
}

async function toPrimitiveLocators(locator: PartLocator, interactor: Interactor): Promise<CssLocator[]> {
  const list = locator;
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
    throw new LocatorResolutionError([locator], 'match target of LinkedCssLocator not found');
  }

  if (locator.valueExtract.type === 'attribute') {
    return byAttribute(locator.valueExtract.attributeName, matchTargetValue, locator.relative);
  }
  throw new LocatorResolutionError([locator], `unsupported valueExtract type "${locator.valueExtract.type}"`);
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
    [locator],
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
 * Override the supplied locator chain's relative position; by default only the
 * first locator in the chain is overridden.
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
  const actualOption: Readonly<OverrideLocatorRelativePositionOption> = {
    ...defaultOverrideLocatorRelativePositionOption,
    ...option,
  };
  return locator.map((loc, index) => (actualOption.shouldOverride(loc, index) ? loc.clone({ relative }) : loc));
}

// Re-exported from a leaf module so the interactor errors can build their
// `locatorDescription` from it without importing `locatorUtil` (which throws
// LocatorResolutionError) — breaking a `locatorUtil ↔ error` import cycle while
// keeping `locatorUtil.getLocatorInfoForErrorLog` on the public surface.
export { getLocatorInfoForErrorLog } from './getLocatorInfoForErrorLog';
