import { HTMLButtonDriver, HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byLinkedElement,
  byRole,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  listHelper,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  input: {
    locator: byRole('combobox'),
    driver: HTMLTextInputDriver,
  },
  dropdown: {
    locator: byLinkedElement('Root')
      .onLinkedElement(byRole('combobox'))
      .extractAttribute('aria-controls')
      .toMatchMyAttribute('id'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const optionLocator = byRole('option');

// In the "no options" and "loading" states MUI renders no listbox, so the popup
// cannot be reached through the `dropdown` part (which keys off the combobox's
// `aria-controls`). These nodes live in the popper (portaled outside the driver
// subtree), so they are matched by their global class. Only one Autocomplete
// popup is open at a time, so a global match is unambiguous in practice.
const noOptionsLocator = byCssClass('MuiAutocomplete-noOptions');
const loadingLocator = byCssClass('MuiAutocomplete-loading');

/**
 * The match type of the autocomplete, default to 'exact'
 * 'exact': The value must match exactly to one of the options
 * 'first-available': The value will be set to the first available option
 */
export type AutoCompleteMatchType = 'exact' | 'first-available';

export interface AutoCompleteDriverSpecificOption {
  matchType: AutoCompleteMatchType;
}

export interface AutoCompleteDriverOption extends IComponentDriverOption, AutoCompleteDriverSpecificOption {}

export const defaultAutoCompleteDriverOption: AutoCompleteDriverSpecificOption = {
  matchType: 'exact',
};

export class AutoCompleteDriver extends ComponentDriver<typeof parts> implements IInputDriver<string | null> {
  private _option: Partial<AutoCompleteDriverOption> = {};
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<AutoCompleteDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });

    this._option = option ?? {};
  }

  /**
   * Get the display of the autocomplete
   */
  async getValue(): Promise<string | null> {
    const value = await this.parts.input.getValue();
    return value ?? null;
  }

  /**
   * Set the value of the autocomplete, how selection happens
   * depends on the option assigned to AutoCompleteDriver
   * By default, when the option has matchType set to exact, only option with matching text would be selected
   * When the option has matchType set to first-available, the first option would be selected regardless of the text
   *
   * Option of auto complete can be set at the time of part definition, for example
   * ```
   * {
   *   myAutoComplete: {
   *     locator: byCssSelector('my-auto-complete'),
   *     driver: AutoCompleteDriver,
   *     option: {
   *       matchType: 'first-available',
   *     },
   *   },
   * }
   * ```
   *
   * @param value
   * @returns
   */
  async setValue(value: string | null): Promise<boolean> {
    await this.parts.input.setValue(value ?? '');

    if (value === null) {
      return true;
    }

    const option = locatorUtil.append(this.parts.dropdown.locator, optionLocator);
    let index = 0;
    const matchType: AutoCompleteMatchType = this._option?.matchType ?? defaultAutoCompleteDriverOption.matchType;
    for await (const optionDriver of listHelper.getListItemIterator(this, option, HTMLButtonDriver)) {
      const optionValue = await optionDriver.getText();
      const isMatched =
        (matchType === 'exact' && optionValue?.trim() === value) || (matchType === 'first-available' && index === 0);
      if (isMatched) {
        await optionDriver.click();
        return true;
      }

      index++;
    }

    return false;
  }

  async isDisabled(): Promise<boolean> {
    return this.parts.input.isDisabled();
  }

  async isReadonly(): Promise<boolean> {
    return this.parts.input.isReadonly();
  }

  /**
   * Whether the popup is currently showing its loading indicator (the
   * `loadingText`). Only meaningful while the popup is open — open it first
   * (e.g. by typing into the input), since MUI renders nothing otherwise.
   */
  async isLoading(): Promise<boolean> {
    return this.interactor.exists(loadingLocator);
  }

  /**
   * Whether the popup is currently showing its "no options" message. Same
   * open-the-popup-first caveat as {@link AutoCompleteDriver.isLoading}.
   */
  async hasNoOptions(): Promise<boolean> {
    return this.interactor.exists(noOptionsLocator);
  }

  get driverName(): string {
    return 'MuiV6AutoCompleteDriver';
  }
}
