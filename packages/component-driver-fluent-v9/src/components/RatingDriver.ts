import {
  byChecked,
  byCssSelector,
  byInputType,
  byValue,
  ComponentDriver,
  IInputDriver,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `Rating` component — the interactive control; see
 * {@link RatingDisplayDriver} for the read-only `RatingDisplay` sibling.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the root IS a real
 * `<div role="radiogroup">`; each of its `max` (default 5) items renders as a
 * `<span class="fui-RatingItem">` wrapping ONE real, visually-hidden
 * (`opacity: 0`) `<input class="fui-RatingItem__fullValueInput" type="radio"
 * value="N">` at the default `step={1}`, or TWO at `step={0.5}` — an extra
 * sibling `<input class="fui-RatingItem__halfValueInput" type="radio"
 * value="N-0.5">` sharing the same item span. {@link getValue} reads
 * whichever radio in the group carries the native `checked` state (via
 * `:checked`) and parses its `value` attribute; the "no rating" state
 * (`value` `0`, the default with no `defaultValue`/`value` set) checks none
 * of them — unlike MUI's `Rating`, there is no separate empty-value radio, so
 * `null` falls out of "nothing checked" with no special-casing needed.
 *
 * {@link setValue} drives the target radio with `Interactor.activate`, not a
 * coordinate-based click: confirmed against the component's own Griffel style
 * source (`useRatingItemStyles.styles.raw`), each input is absolutely
 * positioned to cover only ITS OWN half of the item's width whenever a
 * sibling half-input exists (`left: 50%` for the full-value input, `right:
 * 50%` for the half-value one) — a real, narrow click target in a live
 * browser, the same category of concern MUI's `RatingDriver` documents for
 * its own half-star label.
 *
 * Fluent's `Rating` (this version) has no `disabled` (or `readOnly`) prop at
 * all — confirmed against `useRatingBase_unstable`'s source, which spreads
 * `...props` through `getIntrinsicElementProps('div', ...)`; that helper
 * drops any prop the root's element type (a `div`) doesn't natively support,
 * so a `disabled` prop passed straight to `<Rating>` has zero DOM effect (no
 * attribute anywhere, confirmed by rendering it). The only portable way to
 * disable a `Rating` is therefore the native HTML mechanism a consumer
 * applies themselves — wrapping it in a `<fieldset disabled>`, which the
 * browser cascades to every descendant native form control, INCLUDING these
 * radio inputs. {@link isDisabled} reads that cascaded state via the
 * `:disabled` CSS pseudo-class on one of the radios; this is NOT the same as
 * the radio's own `.disabled` IDL property (verified it stays `false` under a
 * disabled ancestor fieldset — per the HTML spec that property only mirrors
 * the element's own `disabled` attribute, never an ancestor fieldset's),
 * mirroring `CheckboxDriver`'s `:indeterminate` precedent of reading a live,
 * unreflected DOM state through the CSS pseudo-class rather than an attribute.
 *
 * There is no portable way to clear a `Rating` back to "no rating" once a
 * value is set — like `RadioDriver`'s rejected `setSelected(false)`, this is
 * inherent native radio-group semantics (no click can uncheck every radio in
 * a group), not a driver limitation: {@link setValue} returns `false` for a
 * `null` target without touching the DOM.
 */
export class RatingDriver extends ComponentDriver<{}> implements IInputDriver<number | null> {
  private get checkedInputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byInputType('radio'), byChecked(true));
  }

  /** The currently selected value, or `null` when no item is selected ("no rating"). */
  async getValue(): Promise<number | null> {
    const value = await this.interactor.getAttribute(this.checkedInputLocator, 'value');
    return value == null ? null : Number.parseFloat(value);
  }

  /**
   * Select the radio whose `value` attribute matches `value` (see class doc
   * for why via `activate` rather than a coordinate click). Returns `false`,
   * without touching the DOM, for a `value` with no matching radio (out of
   * range, or a half-step value on an integer-`step` `Rating`) or for `null`
   * (clearing a set `Rating` is not supported — see class doc).
   */
  async setValue(value: number | null): Promise<boolean> {
    if (value == null) {
      return false;
    }
    const targetLocator = locatorUtil.append(this.locator, byValue(value.toString()));
    const targetExists = await this.interactor.exists(targetLocator);
    if (targetExists) {
      await this.interactor.activate(targetLocator);
    }
    return targetExists;
  }

  /** Whether the `Rating` is disabled via an ancestor `<fieldset disabled>` (see class doc). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.exists(
      locatorUtil.append(this.locator, byInputType('radio'), byCssSelector(':disabled', 'Same'))
    );
  }

  get driverName(): string {
    return 'FluentV9RatingDriver';
  }
}
