import { byCssClass, childListHelper, ComponentDriver, Optional } from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';

const itemSelector = '.fui-RatingItem';
const valueTextLocator = byCssClass('fui-RatingDisplay__valueText');
const countTextLocator = byCssClass('fui-RatingDisplay__countText');

/**
 * Driver for the Fluent v9 `RatingDisplay` component — the presentational,
 * read-only sibling of {@link RatingDriver}'s interactive `Rating`. Deliberately
 * does NOT implement `IInputDriver`: `RatingDisplay` renders no radios (or any
 * other control) to set a value through — see below.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the root is a real
 * `<div role="img">` (never a `radiogroup`), containing the same
 * `fui-RatingItem` icon spans `Rating` uses but each stamped `aria-hidden`, plus
 * two OPTIONAL sibling spans that carry the actual accessible content:
 * `<span class="fui-RatingDisplay__valueText" aria-hidden>` (rendered only when
 * the `value` prop is set) and `<span class="fui-RatingDisplay__countText"
 * aria-hidden>` (rendered only when `count` is set) — verified against
 * `useRatingDisplayBase_unstable`'s source (`slot.optional(..., {renderByDefault:
 * value !== undefined})`/`count !== undefined`). The root's own `aria-label` is
 * unset by default; Fluent instead composes an `aria-labelledby` pointing at
 * those two (`aria-hidden`) span ids, so the accessible name is assembled from
 * elsewhere in the tree rather than being readable off the root directly — this
 * driver reads the un-hashed `fui-RatingDisplay__*` structural classes instead
 * of resolving that id link (no interactor primitive computes an accessible
 * name from `aria-labelledby` id lists), matching {@link FieldDriver}'s own
 * `fui-Field__*`-anchored reads. Both spans are absent when their source prop
 * is, so {@link getValue}/{@link getCount} resolve to `undefined` for real
 * (`Interactor.getText` already resolves to `undefined` for a locator matching
 * nothing) rather than a driver-side existence probe.
 *
 * {@link getMax} counts the rendered `fui-RatingItem` icon spans rather than
 * reading a `max` attribute (there is none in the DOM — `max` only sizes the
 * `Array.from` that generates the icons). This is exact for the default (full)
 * display mode, but NOT for `compact` mode: `RatingDisplay`'s own source
 * always renders exactly one `aria-hidden` `RatingItem` in that mode
 * regardless of `max` (a single filled star next to the value, per its docs),
 * so a compact `RatingDisplay`'s true configured `max` is not observable from
 * the rendered DOM at all — {@link getMax} would misreport `1` for it. Not
 * exercised by this driver's test suite (no compact example rendered); flagged
 * here as a known gap rather than silently wrong.
 */
export class RatingDisplayDriver extends ComponentDriver<{}> {
  /** The displayed value, or `undefined` when the `value` prop wasn't set. */
  async getValue(): Promise<Optional<number>> {
    const text = await readOptionalDescendantText(this.interactor, this.locator, valueTextLocator);
    return text == null ? undefined : Number.parseFloat(text);
  }

  /**
   * The displayed rating count (`count` prop), or `undefined` when it wasn't
   * set — distinct from {@link getValue}'s `undefined`, since a `RatingDisplay`
   * commonly shows a value with no count alongside it. Fluent renders `count`
   * through `toLocaleString()` (its own docs: "formatted with a thousands
   * separator if applicable"), so the read strips `,` before parsing —
   * exact for the `en-US`-style grouping the test/CI locale renders.
   */
  async getCount(): Promise<Optional<number>> {
    const text = await readOptionalDescendantText(this.interactor, this.locator, countTextLocator);
    return text == null ? undefined : Number.parseFloat(text.replace(/,/g, ''));
  }

  /**
   * The `max` this `RatingDisplay` was configured with (default `5`), read by
   * counting rendered icon spans — see class doc for the `compact`-mode gap.
   */
  async getMax(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, itemSelector);
  }

  get driverName(): string {
    return 'FluentV9RatingDisplayDriver';
  }
}
