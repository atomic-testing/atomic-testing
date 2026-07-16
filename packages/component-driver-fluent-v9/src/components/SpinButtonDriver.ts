import {
  byCssSelector,
  ComponentDriver,
  IDisableableDriver,
  IInputDriver,
  IReadonlyableDriver,
  IRequirableDriver,
  IValidatableDriver,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the Fluent v9 `SpinButton` (`@fluentui/react-spinbutton`).
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<SpinButton>` forwards straight to the REAL native
 * `<input role="spinbutton" type="text" class="fui-SpinButton__input">` — a
 * standard WAI-ARIA spinbutton whose `aria-valuenow`/`aria-valuemin`/
 * `aria-valuemax` mirror the committed value/bounds — so the component root
 * IS the input, wrapped by a `<span class="fui-SpinButton">` styling shell
 * that also holds two native `<button aria-label="Increment value"|"Decrement
 * value">` steppers as SIBLINGS of the input, not descendants of it, and
 * carrying no per-instance id/ARIA link back to the input (unlike
 * `CheckboxDriver`'s linked `<label for>`). Since this locator model has no
 * parent axis, the steppers are reached with the general-sibling CSS
 * combinator (`~`) off the input's own locator — the same escape hatch
 * `component-driver-astryx`'s `NumberInputDriver.getUnits` uses — rather than
 * walking up to the wrapper; verified to disambiguate correctly with two
 * `SpinButton`s rendered side by side (each sibling selector only matches
 * within its own input's subtree, confirmed by driving one instance's
 * stepper and observing the other instance's `aria-valuenow` is untouched).
 *
 * Typed edits do NOT commit to `aria-valuenow` on every keystroke — only on
 * blur or Enter (Fluent's own "commit" contract; confirmed against the
 * rendered DOM: `aria-valuenow` stays at the old value while the input's
 * `value` already shows the in-progress text). {@link setValue} types then
 * blurs to commit — blur rather than Enter, since Enter on a text input
 * risks an implicit form submission blur never triggers — and reads back
 * `aria-valuenow` to report whether the commit actually landed: a typed value
 * outside `[min, max]` commits verbatim with NO client-side clamp (verified:
 * typing `999` with `max={10}` commits `aria-valuenow` to `999` outright),
 * while a non-numeric commit (e.g. `"abc"`) silently reverts to the last
 * valid value, so a blind `true` return would misreport a rejected edit.
 *
 * `Home`/`End`/`PageUp`/`PageDown` are verified against the rendered
 * `aria-valuenow` rather than assumed from the WAI-ARIA spinbutton pattern:
 * `Home`/`End` land exactly on `aria-valuemin`/`aria-valuemax`, and
 * `PageUp`/`PageDown` step by the larger `stepPage` (distinct from
 * `ArrowUp`/`ArrowDown`'s `step` — confirmed with `step={1}`/`stepPage={10}`,
 * where `PageUp` moved `aria-valuenow` by 10, not 1).
 */
export class SpinButtonDriver
  extends ComponentDriver<{}>
  implements IInputDriver<number>, IDisableableDriver, IReadonlyableDriver, IRequirableDriver, IValidatableDriver
{
  /** The committed current value (`aria-valuenow`). */
  async getValue(): Promise<number> {
    return this.readNumericAttribute('aria-valuenow');
  }

  /** The minimum allowed value (`aria-valuemin`). */
  async getMin(): Promise<number> {
    return this.readNumericAttribute('aria-valuemin');
  }

  /** The maximum allowed value (`aria-valuemax`). */
  async getMax(): Promise<number> {
    return this.readNumericAttribute('aria-valuemax');
  }

  /**
   * Type `value` into the input and commit it by blurring (see the class doc
   * for why blur, not Enter, is the safer commit path). Returns whether the
   * committed value actually matches `value` — see the class doc for the two
   * ways a commit can silently diverge from the requested value.
   */
  async setValue(value: number): Promise<boolean> {
    await this.interactor.enterText(this.locator, value.toString());
    await this.interactor.blur(this.locator);
    return (await this.getValue()) === value;
  }

  /** Click the increment stepper button (steps by `step`, default `1`). */
  async increment(): Promise<void> {
    await this.interactor.click(this.incrementButtonLocator);
  }

  /** Click the decrement stepper button (steps by `step`, default `1`). */
  async decrement(): Promise<void> {
    await this.interactor.click(this.decrementButtonLocator);
  }

  /** Jump to the minimum value (`Home`). See the class doc for verification. */
  async moveToMin(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'Home');
  }

  /** Jump to the maximum value (`End`). See the class doc for verification. */
  async moveToMax(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'End');
  }

  /** Step up by the larger `stepPage` increment (`PageUp`). See the class doc for verification. */
  async incrementByPage(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'PageUp');
  }

  /** Step down by the larger `stepPage` increment (`PageDown`). See the class doc for verification. */
  async decrementByPage(): Promise<void> {
    await this.interactor.pressKey(this.locator, 'PageDown');
  }

  /** Whether the SpinButton is disabled (native `disabled` on the input). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.locator);
  }

  /** Whether the SpinButton is read-only (native `readonly` on the input). */
  isReadonly(): Promise<boolean> {
    return this.interactor.isReadonly(this.locator);
  }

  /** Whether the SpinButton is marked required (native `required` on the input). */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.locator);
  }

  /** Whether the SpinButton is in an invalid/error state (`aria-invalid="true"`). */
  isError(): Promise<boolean> {
    return this.interactor.isError(this.locator);
  }

  /** The increment stepper button, a later sibling of the input — see the class doc. */
  private get incrementButtonLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('~ .fui-SpinButton__incrementButton'));
  }

  /** The decrement stepper button, a later sibling of the input — see the class doc. */
  private get decrementButtonLocator(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('~ .fui-SpinButton__decrementButton'));
  }

  private async readNumericAttribute(attribute: string): Promise<number> {
    const raw = await this.interactor.getAttribute(this.locator, attribute);
    return raw == null ? Number.NaN : Number.parseFloat(raw);
  }

  get driverName(): string {
    return 'FluentV9SpinButtonDriver';
  }
}
