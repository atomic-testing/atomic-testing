import { Optional } from '../dataTypes';
import { PartLocator } from '../locators';
import type { CssProperty } from './CssProperty';
import { EnterTextOption } from './EnterTextOption';
import { ClickOption, HoverOption, MouseDownOption, MouseMoveOption, MouseUpOption } from './MouseOption';

export interface Interactor {
  //#region Potentially DOM mutative interactions
  /**
   * Click on the desired element
   * @param locator
   * @param option
   */
  click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void>;

  /**
   * Mouse move on the desired
   * @param locator
   * @param option
   */
  mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void>;

  mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void>;

  mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void>;

  /**
   * Type text into the desired element
   * @param locator
   * @param value
   */
  enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption>): Promise<void>;

  /**
   * Select option by value from a select element
   * @param locator
   * @param values
   */
  selectOptionValue(locator: PartLocator, values: string[]): Promise<void>;

  /**
   * Perform a mouse hover on the desired element
   * @param locator
   */
  hover(locator: PartLocator, option?: HoverOption): Promise<void>;

  /**
   * Wait for a given amount of time in milliseconds
   * @param ms
   */
  wait(ms: number): Promise<void>;
  //#endregion

  //#region Read only interactions
  getInputValue(locator: PartLocator): Promise<Optional<string>>;
  /**
   * Get the select element's selected options' values
   * @param locator
   */
  getSelectValues(locator: PartLocator): Promise<Optional<readonly string[]>>;
  /**
   * Get the select element's selected options' labels
   * @param locator
   */
  getSelectLabels(locator: PartLocator): Promise<Optional<readonly string[]>>;

  getAttribute(locator: PartLocator, name: string, isMultiple: true): Promise<readonly string[]>;
  getAttribute(locator: PartLocator, name: string, isMultiple: false): Promise<Optional<string>>;
  getAttribute(locator: PartLocator, name: string): Promise<Optional<string>>;

  /**
   * Get the value of a style property
   * @param locator
   * @param propertyName
   */
  getStyleValue(locator: PartLocator, propertyName: CssProperty): Promise<Optional<string>>;

  getText(locator: PartLocator): Promise<Optional<string>>;
  exists(locator: PartLocator): Promise<boolean>;
  isChecked(locator: PartLocator): Promise<boolean>;
  isDisabled(locator: PartLocator): Promise<boolean>;
  isReadonly(locator: PartLocator): Promise<boolean>;
  isVisible(locator: PartLocator): Promise<boolean>;

  hasCssClass(locator: PartLocator, className: string): Promise<boolean>;
  hasAttribute(locator: PartLocator, name: string): Promise<boolean>;
  //#endregion

  clone(): Interactor;
}
