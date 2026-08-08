import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/getLocatorInfoForErrorLog';
import { ErrorBase } from './ErrorBase';

export const ListEnumerationMismatchErrorId = 'ListEnumerationMismatchError';

/**
 * Thrown when a list's two reckonings of "how many items" disagree: positional
 * enumeration walked `:nth-of-type(i + 1)` and stopped, while the locator itself
 * matches a different number of elements. The walk is therefore a lower bound, and
 * the items missing from it are indistinguishable from items that do not exist.
 *
 * `:nth-of-type` counts by **tag**, among **one parent's** children. Any list whose
 * items do not sit as that uniform run of siblings breaks the correspondence, and
 * more than one shape does:
 *
 * - A non-item sibling sharing the items' tag — a header or separator `<li>`, an
 *   `<optgroup>` between `<option>`s — shifts the reckoning, and the walk stops at
 *   the first position the item selector no longer matches.
 * - Items nested under per-item wrappers, where each item is `:nth-of-type(1)` of
 *   its own parent, so the positional sequence never advances past the first.
 * - The list changing between the walk and the count — an async re-render or an
 *   in-flight animation — which no list SHAPE explains and no driver change fixes.
 *
 * For the two structural causes the fix is at the driver, not the call site: address
 * the list with `childListHelper`'s {@link iterateMatchingChildren} /
 * {@link countMatchingChildren}, whose `:nth-child` + child-selector filter skips
 * non-matching siblings without losing its place, and recurses into wrappers when
 * given a `groupSelector`. For the third, settle the list first — see
 * `interactorUtil.interactorWaitUtil`.
 *
 * Per ADR-010 only serializable state is retained — the locator's description, not
 * the live locator.
 */
export class ListEnumerationMismatchError extends ErrorBase {
  readonly locatorDescription: string;
  /** How many elements the item locator matches. */
  readonly matchedCount: number;
  /** How many items positional enumeration reached before it stopped. */
  readonly enumeratedCount: number;

  constructor(itemLocator: PartLocator, driver: { driverName: string }, matchedCount: number, enumeratedCount: number) {
    const locatorDescription = getLocatorInfoForErrorLog(itemLocator);
    super(
      `List enumeration is incomplete: the item locator matches ${matchedCount} element(s) but ` +
        `positional :nth-of-type addressing reached only ${enumeratedCount} before stopping, so ` +
        `enumeration would otherwise have returned a silently short list. :nth-of-type counts by ` +
        `tag among one parent's children, so this happens when the items are not a uniform run of ` +
        `siblings: a non-item sharing their tag sits between them (a header or separator, an ` +
        `<optgroup>); or each item is wrapped in its own parent, making every item ` +
        `:nth-of-type(1); or the list changed between the walk and the count. For the first two, ` +
        `address this list with childListHelper's iterateMatchingChildren/countMatchingChildren ` +
        `instead; for the third, wait for the list to settle before enumerating. ` +
        `Locator: ${locatorDescription}`,
      driver
    );
    this.locatorDescription = locatorDescription;
    this.matchedCount = matchedCount;
    this.enumeratedCount = enumeratedCount;
    this.name = ListEnumerationMismatchErrorId;
  }
}
