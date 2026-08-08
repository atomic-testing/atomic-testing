import { PartLocator } from '../locators';
import { getLocatorInfoForErrorLog } from '../utils/getLocatorInfoForErrorLog';
import { ErrorBase } from './ErrorBase';

export const ListEnumerationMismatchErrorId = 'ListEnumerationMismatchError';

/**
 * Thrown when a list's two reckonings of "how many items" disagree: positional
 * enumeration walked `:nth-of-type(i + 1)` and stopped, while the locator itself
 * matches a different number of elements.
 *
 * This means the list is **not** the homogeneous sibling set that
 * `listHelper`'s positional addressing requires — typically a non-item sibling
 * sharing the items' tag (a header or separator `<li>`, an `<optgroup>` between
 * `<option>`s) shifts the `:nth-of-type` reckoning, so enumeration halts early and
 * silently returns a short list. Every count here is therefore a lower bound, and
 * the items missing from it are indistinguishable from items that do not exist.
 *
 * The fix is at the driver, not the call site: address the list with
 * `childListHelper`'s {@link iterateMatchingChildren} /
 * {@link countMatchingChildren}, whose `:nth-child` + child-selector filter skips
 * non-matching siblings without losing its place, and recurses into wrappers when
 * given a `groupSelector`.
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
        `positional :nth-of-type addressing reached only ${enumeratedCount} before stopping. ` +
        `This list is not a homogeneous set of siblings — something sharing the items' tag sits ` +
        `between them (a header or separator, an <optgroup>), so enumeration halted early and ` +
        `would otherwise have returned a silently short list. Address this list with ` +
        `childListHelper's iterateMatchingChildren/countMatchingChildren instead. ` +
        `Locator: ${locatorDescription}`,
      driver
    );
    this.locatorDescription = locatorDescription;
    this.matchedCount = matchedCount;
    this.enumeratedCount = enumeratedCount;
    this.name = ListEnumerationMismatchErrorId;
  }
}
