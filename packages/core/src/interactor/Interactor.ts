import { Optional } from '../dataTypes';
import { WaitForOption } from '../drivers/WaitForOption';
import { BoundingRect, Point } from '../geometry';
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
   * Cross-engine caveat: with `shift` and a PRINTABLE key the engines disagree on
   * the resulting `KeyboardEvent.key` — Playwright case-folds (`Shift`+`a` →
   * `'A'`) while the jsdom path leaves `key` as `'a'` (with `shiftKey: true`). The
   * modifier flags themselves are delivered consistently; only the printed
   * character differs. Prefer non-printable keys for cross-engine assertions on
   * `key` — see #924.
   *
   * @param locator
   * @param key A `KeyboardEvent.key` value, e.g. `'Escape'`, `'Backspace'`, `'Enter'`
   * @param option Modifier flags (`ctrl`/`shift`/`alt`/`meta`) folded into the
   * dispatched key event, so a chord such as `Ctrl+Enter` is delivered with its
   * held modifiers — see {@link PressKeyOption}.
   */
  pressKey(locator: PartLocator, key: string, option?: Partial<PressKeyOption>): Promise<void>;

  /**
   * Dispatch a right-click / `contextmenu` event on the desired element.
   *
   * A `contextmenu` event is the only way to open a context menu: such menus have
   * no `aria-expanded` toggle or controlled-open prop to flip, so the menu is
   * reachable only by the event a right-click produces. This is analogous to
   * {@link pressKey} for keyboard-only behaviors — a dedicated primitive for an
   * outcome no ordinary {@link click} can express. The element is focused first
   * if focusable, mirroring `pressKey`, so the event originates from the active
   * element as in a real right-click.
   *
   * @param locator
   */
  contextMenu(locator: PartLocator): Promise<void>;

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
   * Set the selected files on a `<input type="file">` element.
   *
   * A dedicated primitive exists because a file input's `FileList` cannot be
   * populated through {@link enterText} (or any value-typing path): browsers
   * block programmatic assignment to `type=file` value for security, so the
   * `FileList` must be set via the upload-specific channel — `userEvent.upload`
   * in the DOM/jsdom and `locator.setInputFiles` in Playwright — which is the
   * only way a change event with the chosen files fires.
   *
   * @param locator Locator of the `<input type="file">` element
   * @param files One or more filesystem paths to upload. Pass a single path for
   * a non-`multiple` input; pass an array to select several files on a
   * `multiple` input.
   */
  setInputFiles(locator: PartLocator, files: string | string[]): Promise<void>;

  /**
   * Scroll the desired element into the viewport.
   *
   * jsdom has no layout engine, so the scrolling effect is a no-op there: the
   * element's geometry never changes and nothing becomes "visible". Behavioral
   * assertions about visibility or offset are therefore E2E-only; the jsdom path
   * only guarantees the call resolves without throwing once the element is found.
   *
   * @param locator Locator of the element to scroll into view
   */
  scrollIntoView(locator: PartLocator): Promise<void>;

  /**
   * Scroll the desired element by the given delta (in pixels).
   *
   * jsdom has no layout engine, so the scrolling effect is a no-op there: the
   * element's scroll offset never changes. Behavioral assertions about the
   * resulting scroll position are therefore E2E-only; the jsdom path only
   * guarantees the call resolves without throwing once the element is found.
   *
   * @param locator Locator of the scrollable element
   * @param delta Pixel offset to scroll by, where `x` is horizontal and `y` is vertical
   */
  scrollBy(locator: PartLocator, delta: Point): Promise<void>;

  /**
   * Drag the source element and drop it onto the target element.
   *
   * jsdom has no layout engine, so the drag has no positional outcome there: the
   * pointer sequence is synthesized at zeroed coordinates and only the event
   * wiring (mousedown/mousemove/mouseup, and any drop handler they trigger) is
   * exercised. Behavioral assertions about the final position are therefore
   * E2E-only; the jsdom path only guarantees the events fire once both elements
   * are found.
   *
   * Mouse/pointer-based only: native HTML5 drag-and-drop
   * (`dragstart`/`dragover`/`drop` + `dataTransfer`) is not synthesized, so
   * components built on the HTML5 DnD API are out of scope here — see #922.
   *
   * @param source Locator of the element to drag
   * @param target Locator of the element to drop onto
   */
  dragTo(source: PartLocator, target: PartLocator): Promise<void>;

  /**
   * Drag the desired element by the given pixel delta from its center.
   *
   * jsdom has no layout engine, so the drag has no positional outcome there: the
   * pointer sequence is synthesized from the caller-supplied delta and only the
   * event wiring is exercised. Behavioral assertions about the resulting position
   * are therefore E2E-only; the jsdom path only guarantees the events fire once
   * the element is found.
   *
   * Mouse/pointer-based only: native HTML5 drag-and-drop is not synthesized —
   * see #922.
   *
   * @param locator Locator of the element to drag
   * @param delta Pixel offset to drag by, where `x` is horizontal and `y` is vertical
   */
  drag(locator: PartLocator, delta: Point): Promise<void>;

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

  /**
   * Get the element's bounding rectangle in CSS pixels.
   *
   * jsdom has no layout engine, so every coordinate and dimension is `0` there:
   * the returned rect is structurally valid but behaviorally meaningless.
   * Assertions about real geometry are therefore E2E-only; under jsdom this
   * returns a zero-rect.
   *
   * @param locator Locator of the element to measure
   */
  getBoundingRect(locator: PartLocator): Promise<BoundingRect>;

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
