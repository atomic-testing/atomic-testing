import {
  byInputType,
  ComponentDriver,
  IDisableableDriver,
  IFormFieldDriver,
  IRequirableDriver,
  IToggleDriver,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

/**
 * Driver for the PrimeVue `Checkbox` component.
 *
 * DOM audit (primevue@4.5.5): the root is a styled
 * `<div data-pc-name="checkbox" data-p-checked>` wrapping a REAL (visually
 * hidden, hit-target-sized) native `<input type="checkbox">` plus the styled
 * box div. Unlike Radix's button-based checkbox, the native input is present,
 * so state reads/writes go through it: `Interactor.isChecked` reads the live
 * `checked` property (the form-submission ground truth), and clicks land on
 * the input — the element real users hit, wired to PrimeVue's `change`
 * handling. `disabled`/`required` are native attributes on the same input.
 *
 * Value modes: v1 covers `binary` mode (boolean model; the input renders no
 * `value` attribute, so {@link getValue} returns `null`) and the array-value
 * mode's per-checkbox read ({@link getValue} returns the `value` attribute).
 * Aggregating an array-mode group's selected values is the consumer's scene
 * concern (one driver per checkbox), same as with native checkbox groups.
 */
export class CheckboxDriver
  extends ComponentDriver<{}>
  implements IFormFieldDriver<string | null>, IToggleDriver, IDisableableDriver, IRequirableDriver
{
  private get inputLocator(): PartLocator {
    return locatorUtil.append(this.locator, byInputType('checkbox'));
  }

  /** Whether the checkbox is checked (native input `checked` property). */
  isSelected(): Promise<boolean> {
    return this.interactor.isChecked(this.inputLocator);
  }

  async setSelected(selected: boolean): Promise<void> {
    if ((await this.isSelected()) !== selected) {
      await this.interactor.click(this.inputLocator);
    }
  }

  /** The native input's `value` attribute (array-value mode), or `null` in `binary` mode. */
  async getValue(): Promise<string | null> {
    return (await this.interactor.getAttribute(this.inputLocator, 'value')) ?? null;
  }

  /** Whether the checkbox is disabled (native `disabled` attribute on the input). */
  isDisabled(): Promise<boolean> {
    return this.interactor.isDisabled(this.inputLocator);
  }

  /** Whether the checkbox is marked required (native `required` attribute on the input). */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.inputLocator);
  }

  get driverName(): string {
    return 'PrimeVueV4CheckboxDriver';
  }
}
