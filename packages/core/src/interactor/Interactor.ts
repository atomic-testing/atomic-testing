import { Optional } from '../dataTypes';
import { LocatorChain } from '../locators';
import { ClickOption } from './ClickOption';
import { EnterTextOption } from './EnterTextOption';

export interface Interactor {
  //#region Potentially DOM mutative interactions
  /**
   * Click on the desired element
   * @param locator
   * @param option
   */
  click(locator: LocatorChain, option?: Partial<ClickOption>): Promise<void>;

  /**
   * Type text into the desired element
   * @param locator
   * @param value
   */
  enterText(locator: LocatorChain, text: string, option?: Partial<EnterTextOption>): Promise<void>;

  /**
   * Select option by value from a select element
   * @param locator
   * @param values
   */
  selectOptionValue(locator: LocatorChain, values: string[]): Promise<void>;

  /**
   * Perform a mouse hover on the desired element
   * @param locator
   */
  hover(locator: LocatorChain): Promise<void>;
  //#endregion

  //#region Read only interactions
  getInputValue(locator: LocatorChain): Promise<Optional<string>>;
  getSelectValues(locator: LocatorChain): Promise<Optional<readonly string[]>>;

  getAttribute(locator: LocatorChain, name: string, isMultiple: true): Promise<readonly string[]>;
  getAttribute(locator: LocatorChain, name: string, isMultiple: false): Promise<Optional<string>>;
  getAttribute(locator: LocatorChain, name: string): Promise<Optional<string>>;

  getText(locator: LocatorChain): Promise<Optional<string>>;
  exists(locator: LocatorChain): Promise<boolean>;
  isChecked(locator: LocatorChain): Promise<boolean>;
  isDisabled(locator: LocatorChain): Promise<boolean>;
  isReadonly(locator: LocatorChain): Promise<boolean>;

  hasCssClass(locator: LocatorChain, className: string): Promise<boolean>;
  hasAttribute(locator: LocatorChain, name: string): Promise<boolean>;
  //#endregion

  clone(): Interactor;
}
