import { Optional } from '../dataTypes';
import { WaitForOption } from '../drivers/WaitForOption';
import { PartLocator } from '../locators';
import { WaitUntilOption } from '../utils/timingUtil';
import type { CssProperty } from './CssProperty';
import { EnterTextOption } from './EnterTextOption';
import { BlurOption, FocusOption } from './FocusOption';
import {
  ClickOption,
  HoverOption,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
} from './MouseOption';
import type { PressKeyOption } from './PressKeyOption';

/**
 * Environment specific implementation that performs low level actions on the UI.
 *
 * Component drivers delegate every interaction to an instance of this interface
 * so tests can run in different environments by simply providing a different
 * interactor implementation.
 */
export interface Interactor {
  //#region Potentially DOM mutative interactions
  /**
   * Click on the desired element
   * @param locator
   * @param option
   */
  click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void>;

  /**
   * Mouse move on the desired element
   * @param locator
   * @param option
   */
  mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void>;

  mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void>;

  mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void>;

  mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void>;

  mouseOut(locator: PartLocator, option?: Partial<MouseOutOption>): Promise<void>;

  mouseEnter(locator: PartLocator, option?: Partial<MouseEnterOption>): Promise<void>;

  mouseLeave(locator: PartLocator, option?: Partial<MouseLeaveOption>): Promise<void>;

  focus(locator: PartLocator, option?: Partial<FocusOption>): Promise<void>;

  /**
   * Remove focus from the desired element
   * @param locator
   * @param option
   */
  blur(locator: PartLocator, option?: Partial<BlurOption>): Promise<void>;

  /**
   * Dispatch a keyboard key press on the desired element.
   *
   * Unlike {@link enterText}, which fills a value, this dispatches an actual key
   * event so components that key off `KeyboardEvent.key` are exercised — e.g.
   * Dialog dismissal on `Escape` or Chip deletion on `Backspace`/`Delete`. The
   * element is focused first so the event originates from the active element,
   * matching a real key press. No pointer event is involved, so behaviours
   * unreachable by {@link click} (geometry or not) become testable.
   *
   * @param locator
   * @param key A `KeyboardEvent.key` value, e.g. `'Escape'`, `'Backspace'`, `'Enter'`
   * @param option Reserved for future modifier-key support
   */
  pressKey(locator: PartLocator, key: string, option?: Partial<PressKeyOption>): Promise<void>;

  /**
   * Activate the desired element without relying on pointer geometry — a
   * coordinate-free, dispatch-based click.
   *
   * This reaches elements an ordinary {@link click} cannot: a visually-hidden or
   * zero-size input covered by another element (e.g. MUI Rating's hidden
   * `<input type="radio">`, where a positional click hit-tests to the covering
   * star label instead). Prefer {@link click} for ordinary, visible targets.
   *
   * @param locator
   */
  activate(locator: PartLocator): Promise<void>;

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

  /**
   * Wait until the component is in the expected state such as
   * the component's visibility or existence. If the component has
   * not reached the expected state within the timeout, it will throw
   * an error.
   *
   * By default it waits until the component is attached to the DOM
   * within 30 seconds.
   *
   * @param locator The locator of the component to wait for
   * @param option The option to configure the wait behavior
   */
  waitUntilComponentState(locator: PartLocator, option?: Partial<Readonly<WaitForOption>>): Promise<void>;

  /**
   * Keep running a probe function until it returns a value that matches the terminate condition or timeout
   * @returns The last value returned by the probe function
   */
  waitUntil<T>(option: WaitUntilOption<T>): Promise<T>;
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

  //#region debug
  /**
   * Get the HTML of an element
   * @param locator
   */
  innerHTML(locator: PartLocator): Promise<string>;

  clone(): Interactor;
}
