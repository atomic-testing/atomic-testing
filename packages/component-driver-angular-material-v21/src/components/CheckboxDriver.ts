import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byInputType,
  ComponentDriver,
  IComponentDriverOption,
  IDisableableDriver,
  IFormFieldDriver,
  Interactor,
  IRequirableDriver,
  IToggleDriver,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

export const checkboxParts = {
  /**
   * The native `<input type="checkbox">` Material renders inside the
   * `<mat-checkbox>` host — it carries the checked/indeterminate/required
   * state and receives the interactions.
   */
  input: {
    locator: byInputType('checkbox'),
    driver: HTMLCheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the Angular Material checkbox (`MatCheckbox`).
 *
 * Locate it by the `<mat-checkbox>` host element (e.g. a `data-testid` placed
 * there); the driver reaches the native `<input type="checkbox">` inside it,
 * which is where Material keeps the widget's state.
 *
 * @see https://material.angular.dev/components/checkbox
 */
export class CheckboxDriver
  extends ComponentDriver<typeof checkboxParts>
  implements IFormFieldDriver<string | null>, IToggleDriver, IDisableableDriver, IRequirableDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: checkboxParts,
    });
  }

  isSelected(): Promise<boolean> {
    return this.parts.input.isSelected();
  }

  async setSelected(selected: boolean): Promise<void> {
    // Clicking an indeterminate MatCheckbox resolves it to checked (the default
    // `check-indeterminate` click action), so reaching unchecked from
    // indeterminate needs a pass through checked first.
    if (!selected && (await this.isIndeterminate())) {
      await this.parts.input.setSelected(true);
    }
    await this.parts.input.setSelected(selected);
  }

  /**
   * Whether the checkbox is in the indeterminate ("mixed") state.
   *
   * Reads the native control's `:indeterminate` state rather than Material's
   * `aria-checked="mixed"` mirror of it. Both describe the same thing, but the
   * ARIA attribute is a template binding that only updates on a change
   * detection pass, so a read taken right after a click can still observe the
   * pre-click value. The IDL state is owned by the browser and cleared as part
   * of the click's own activation steps, so it is already correct by the time
   * the interaction resolves.
   */
  async isIndeterminate(): Promise<boolean> {
    return this.interactor.exists(this.indeterminateInputLocator);
  }

  private get indeterminateInputLocator(): PartLocator {
    return locatorUtil.append(this.parts.input.locator, byCssSelector(':indeterminate', 'Same'));
  }

  /**
   * The checkbox's `value` attribute (Material forwards its `value` input to
   * the native control), or `null` when none is set.
   */
  getValue(): Promise<string | null> {
    return this.parts.input.getValue();
  }

  /**
   * Whether the checkbox is disabled. A plain disabled checkbox carries the
   * native `disabled` attribute; with `disabledInteractive` the input stays
   * focusable and signals its state via `aria-disabled="true"` instead. Treat
   * either as disabled.
   */
  async isDisabled(): Promise<boolean> {
    if (await this.parts.input.isDisabled()) {
      return true;
    }
    return (await this.interactor.getAttribute(this.parts.input.locator, 'aria-disabled')) === 'true';
  }

  /**
   * Whether the checkbox is required (Material reflects its `required` input
   * onto the native control).
   */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.parts.input.locator);
  }

  /**
   * The text of the checkbox's label, or `undefined` when the checkbox has no
   * label content. Material associates the label with the native input via
   * `<label for>`↔`id`, so the driver resolves that link rather than assuming
   * a DOM shape.
   */
  getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.parts.input.locator);
  }

  get driverName(): string {
    return 'AngularMaterialV21CheckboxDriver';
  }
}
