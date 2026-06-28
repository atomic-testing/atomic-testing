import {
  byCssSelector,
  escapeUtil,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  locatorUtil,
  Nullable,
  PartLocator,
} from '@atomic-testing/core';

import { RadioDriver } from './RadioDriver';

/**
 * Radio options are located by their `FormControlLabel` root, which wraps the
 * radio `<input>` and renders the label text — the unit a {@link RadioDriver}
 * drives.
 */
export const defaultRadioGroupDriverOption: ListComponentDriverSpecificOption<RadioDriver> = {
  itemClass: RadioDriver,
  itemLocator: byCssSelector('.MuiFormControlLabel-root'),
};

type RadioGroupDriverOption<ItemT extends RadioDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Material UI v9 RadioGroup component.
 *
 * `<RadioGroup>` renders a `role="radiogroup"` whose options are `FormControlLabel`s
 * wrapping a radio `<input>`. This driver is a {@link ListComponentDriver} over those
 * options, so per-option {@link RadioDriver} instances are available via
 * `getItems`/`getItemByIndex`/`getItemByLabel`, on top of the group-level value and
 * label helpers. The selected value is read from the checked `<input>` and selection
 * is made by value or label.
 * @see https://mui.com/material-ui/react-radio-button/
 */
export class RadioGroupDriver<ItemT extends RadioDriver = RadioDriver>
  extends ListComponentDriver<ItemT>
  implements IInputDriver<string | null>
{
  constructor(locator: PartLocator, interactor: Interactor, option: Partial<RadioGroupDriverOption<ItemT>> = {}) {
    // The option shape is fixed (FormControlLabel options driven by RadioDriver),
    // so defaults are merged in rather than relying on a default parameter, which a
    // scene part's always-present option object would otherwise shadow.
    super(locator, interactor, {
      ...defaultRadioGroupDriverOption,
      ...option,
    } as RadioGroupDriverOption<ItemT>);
  }

  /**
   * The `value` of the selected option, or `null` when none is selected.
   */
  async getValue(): Promise<string | null> {
    const checked = locatorUtil.append(this.locator, byCssSelector('input:checked'));
    const value = await this.interactor.getAttribute(checked, 'value');
    return value ?? null;
  }

  /**
   * Select the option whose radio `<input>` has the given `value`.
   * @returns `false` when no option has that value, or when `value` is `null`.
   */
  async setValue(value: string | null): Promise<boolean> {
    if (value == null) {
      return false;
    }
    const input = locatorUtil.append(this.locator, byCssSelector(`input[value="${escapeUtil.escapeValue(value)}"]`));
    if (!(await this.interactor.exists(input))) {
      return false;
    }
    await this.interactor.click(input);
    return true;
  }

  /**
   * The visible label of every option, in DOM order.
   */
  async getOptions(): Promise<string[]> {
    const items = await this.getItems();
    const labels: string[] = [];
    for (const item of items) {
      labels.push((await item.getLabel()) ?? '');
    }
    return labels;
  }

  /**
   * The label of the selected option, or `null` when none is selected.
   */
  async getSelectedLabel(): Promise<Nullable<string>> {
    const items = await this.getItems();
    for (const item of items) {
      if (await item.isSelected()) {
        return (await item.getLabel()) ?? null;
      }
    }
    return null;
  }

  /**
   * Select the first option whose visible label equals `label`.
   * @returns `false` when no option matches.
   */
  async selectByLabel(label: string): Promise<boolean> {
    const option = await this.getItemByLabel(label);
    if (option == null) {
      return false;
    }
    await option.select();
    return true;
  }

  /**
   * Whether the option with the given label is disabled.
   * @returns `false` when no option matches.
   */
  async isOptionDisabled(label: string): Promise<boolean> {
    const option = await this.getItemByLabel(label);
    return option == null ? false : option.isDisabled();
  }

  override get driverName(): string {
    return 'MuiV9RadioGroupDriver';
  }
}
