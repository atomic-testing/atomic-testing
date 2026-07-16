import { ComponentDriver, IDisableableDriver, IToggleDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 swatch (`ColorSwatch`) inside a `SwatchPicker`.
 *
 * DOM audit (@fluentui/react-components@9.74.3): a `ColorSwatch` renders as a
 * REAL native `<button type="button" class="fui-ColorSwatch">`. Its role/state
 * pair mirrors the PARENT `SwatchPicker`'s `layout` prop rather than being
 * fixed: the default `layout="row"` gives the picker `role="radiogroup"` and
 * each swatch `role="radio"` + `aria-checked`, while `layout="grid"` instead
 * gives `role="grid"`/`role="gridcell"` + `aria-selected` (verified against
 * rendered DOM in both modes) — so {@link isSelected} reads whichever of the
 * two attributes is present rather than assuming one layout.
 *
 * Selection is wired to a plain `click` handler only —
 * `@fluentui/react-swatch-picker`'s `useColorSwatch_unstable` merges
 * `requestSelectionChange` onto `onClick`, with no separate keydown listener
 * tying Arrow-key movement to selection. The picker's `useArrowNavigationGroup`
 * (tabster) is a pure roving-tabindex FOCUS manager: verified against rendered
 * DOM that a synthesized `ArrowRight` `keydown`/`keyup` — the same event pair
 * {@link Interactor.pressKey} dispatches — moves neither
 * `document.activeElement` nor any `aria-checked`/`aria-selected` state under
 * jsdom. {@link setSelected} therefore drives selection through
 * {@link Interactor.click}, the same portable path `RadioDriver` uses for a
 * native radio.
 *
 * There is no portable `getValue()`: `ColorSwatch`'s `value` prop is
 * destructured out of its props BEFORE the rest spread onto the native
 * `<button>` (confirmed by reading `useColorSwatch_unstable`'s source) — unlike
 * `Radio`'s real native `value` attribute, Fluent renders no DOM trace of it at
 * all. {@link getColor} reads the one swatch-identifying signal Fluent DOES
 * render instead: the `--fui-SwatchPicker--color` CSS custom property it sets
 * inline (the same `swatchCSSVars.color` constant `@fluentui/react-swatch-picker`
 * itself exports) — so this driver (and `SwatchPickerDriver`) address a swatch
 * by its rendered color rather than by the unrendered `value`.
 */
export class SwatchPickerItemDriver extends ComponentDriver<{}> implements IToggleDriver, IDisableableDriver {
  /**
   * Whether this swatch is selected. Reads `aria-checked` (default `row`
   * layout) and falls back to `aria-selected` (`grid` layout) — see the class
   * doc for why the picker can render either.
   */
  async isSelected(): Promise<boolean> {
    const checked = await this.interactor.getAttribute(this.locator, 'aria-checked');
    if (checked != null) {
      return checked === 'true';
    }
    return (await this.interactor.getAttribute(this.locator, 'aria-selected')) === 'true';
  }

  /**
   * Select this swatch by clicking it. `setSelected(false)` is rejected — same
   * single-select, no-self-deselect contract as `RadioDriver`: a swatch can
   * only be displaced by selecting a different one, never deselected in place.
   *
   * No-ops on a disabled swatch rather than delegating to
   * {@link Interactor.click}: under jsdom, `userEvent.click` already silently
   * skips a disabled native `<button>`, but `PlaywrightInteractor.click`'s
   * actionability check instead retries "is enabled" until the click's own
   * timeout — indistinguishable from a hang for a control that can never
   * become enabled. Checking {@link isDisabled} first keeps the no-op
   * behavior identical across every `Interactor`.
   */
  async setSelected(selected: boolean): Promise<void> {
    if (!selected) {
      throw new Error('A swatch cannot be deselected directly; select a different swatch instead.');
    }
    if (await this.isSelected()) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  /** Whether the swatch is disabled (native `disabled` attribute on the `<button>`). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /**
   * The swatch's rendered color, read from the `--fui-SwatchPicker--color`
   * inline CSS custom property Fluent sets on the root `<button>` — see the
   * class doc for why this substitutes for the unrendered `value` prop.
   * Parsed off the raw `style` attribute text (not `getComputedStyle`) so the
   * read is identical across jsdom and every Playwright engine: each
   * normalizes a computed color to its own format (`rgb(...)` vs. the literal
   * hex authored), where the inline attribute text is preserved verbatim by
   * both. `undefined` when the property is absent (e.g. this locator actually
   * points at an `EmptySwatch`/`ImageSwatch`, which carry no such variable).
   */
  async getColor(): Promise<Optional<string>> {
    const style = await this.interactor.getAttribute(this.locator, 'style');
    if (style == null) {
      return undefined;
    }
    const match = /--fui-SwatchPicker--color:\s*([^;]+)/.exec(style);
    return match?.[1]?.trim();
  }

  get driverName(): string {
    return 'FluentV9SwatchPickerItemDriver';
  }
}
