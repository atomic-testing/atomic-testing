import { locatorUtil } from '..';
import { Optional } from '../dataTypes';
import { MissingPartError } from '../errors/MissingPartError';
import { BoundingRect, Point } from '../geometry';
import {
  ClickOption,
  FocusOption,
  HoverOption,
  Interactor,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
  PressKeyOption,
} from '../interactor';
import type { LocatorRelativePosition, PartLocator } from '../locators';
import { IComponentDriver, IComponentDriverOption, PartName, ScenePart, ScenePartDriver } from '../partTypes';
import { WaitUntilOption } from '../utils/timingUtil';
import { getPartFromDefinition } from './driverUtil';
import { defaultWaitForOption, WaitForOption } from './WaitForOption';

/**
 * Base class for all component drivers.  It provides the basic functionality to interact with the component
 */
export abstract class ComponentDriver<T extends ScenePart = {}> implements IComponentDriver<T> {
  private _locator: PartLocator;
  private readonly _parts: ScenePartDriver<T>;

  /**
   * Option passed to the constructor includes both universal options which can be shared across
   * all component driver tree, and component specific options which are only applicable to the component.
   *
   * Commutable option is the option that can be shared across all component driver tree.
   */
  public readonly commutableOption: IComponentDriverOption<T>;

  /**
   * @param locator Locator for the root of this component.
   * @param interactor Environment adapter used for all interactions.
   * @param option Driver option carrying the shared driver-tree context.
   *
   * Composite-driver authoring rule: a driver that declares non-empty `parts`
   * must type this parameter as `Partial<IComponentDriverOption>` (i.e. the empty
   * `<{}>` default) and hardcode its own `parts` in the body —
   * `super(locator, interactor, { ...option, parts })`. The "natural"
   * `Partial<IComponentDriverOption<typeof parts>>` signature does NOT satisfy
   * `ScenePartDefinition['driver']` (constructor parameters are checked
   * contravariantly), so a driver written that way could not be placed in a
   * parent `ScenePart`. See the type-level fixture in
   * `@atomic-testing/component-driver-html`.
   */
  constructor(
    locator: PartLocator,
    public readonly interactor: Interactor,
    option?: Partial<IComponentDriverOption<T>>
  ) {
    this._locator = locator;
    this._parts = getPartFromDefinition<T>(option?.parts ?? ({} as T), this._locator, interactor, option ?? {});
    this.commutableOption = {
      ...option,
      parts: {} as T,
    };
  }

  /**
   * Portal hook: where to re-root this driver's locator when its component renders
   * outside the parent's DOM (a modal, popup, drawer). Return the {@link PartLocator}
   * that locates the component from the document root, or `undefined` (the default)
   * for normal in-tree components whose locator chains from the parent.
   *
   * This is **static** because it is per-class metadata read off the constructor
   * before any instance exists — which makes the "no instance state" constraint
   * structural rather than a documented caution. Override with `static override`.
   */
  static overriddenParentLocator(): Optional<PartLocator> {
    return undefined;
  }

  /**
   * Portal hook: the locator relative position to apply when the component's real
   * DOM is a sibling/elsewhere rather than a descendant (e.g. a MUI dialog rendered
   * at the document root, located by a "Same"-level selector). Return `undefined`
   * (the default) to keep the natural position declared by the ScenePart.
   *
   * Static for the same reason as {@link ComponentDriver.overriddenParentLocator}:
   * it is class-level metadata read before construction. Override with `static override`.
   */
  static overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return undefined;
  }

  /**
   * Return driver instance of all the named parts
   */
  get parts(): ScenePartDriver<T> {
    return this._parts;
  }

  /**
   * Return the locator of the component
   */
  get locator(): PartLocator {
    return this._locator;
  }

  /**
   * Check the specified parts' existences, and throw MissingPartError if any of the part is found not existence.
   * Existence is defined by the part's existence in the DOM regardless of its visibility on the screen
   * @param partName Single or array of the names of the parts to be enforced
   */
  protected async enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): Promise<void> {
    const missingPartNames = await this.getMissingPartNames(partName);
    if (missingPartNames.length > 0) {
      throw new MissingPartError<T>(missingPartNames, this);
    }
  }

  /**
   * Get the names of parts not in the DOM
   * @param partName Single or array of the names of the parts to be examined
   * @returns
   */
  protected async getMissingPartNames(
    partName: PartName<T> | ReadonlyArray<PartName<T>>
  ): Promise<readonly PartName<T>[]> {
    let partNames: ReadonlyArray<keyof T>;
    if (partName == null) {
      partNames = Object.keys(this._parts) as ReadonlyArray<keyof T>;
    } else {
      partNames = Array.isArray(partName) ? partName : [partName];
    }

    const missingParts: PartName<T>[] = [];
    const promises = partNames.map(x => {
      const fn = async () => {
        const partExists = await this.interactor.exists(this._parts[x]!.locator);
        if (!partExists) {
          missingParts.push(x);
        }
      };
      return fn();
    });

    await Promise.all(promises);
    return missingParts;
  }

  /**
   * Get the combined text content of the component
   * @returns If the component exists and has content, it should return the text or otherwise undefined
   */
  getText(): Promise<Optional<string>> {
    return this.interactor.getText(this.locator);
  }

  getAttribute(attributeName: string): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, attributeName);
  }

  /**
   * Whether the component exists/attached to the DOM
   * @returns true if the component is attached to the DOM, false otherwise
   */
  exists(): Promise<boolean> {
    return this.interactor.exists(this.locator);
  }

  async click(option?: Partial<ClickOption>): Promise<void> {
    return this.interactor.click(this.locator, option);
  }

  async hover(option?: Partial<HoverOption>): Promise<void> {
    return this.interactor.hover(this.locator, option);
  }

  // Low-level pointer/keyboard primitives below are `protected` for the 1.0
  // freeze. They are inherited by every driver and by the engine root (where
  // most are meaningless — see #1048), so exposing them publicly would freeze a
  // large uniform surface that is breaking to narrow later but safe to widen
  // (ADR-015). Concrete drivers compose them internally to build semantic
  // actions; the raw gestures stay out of the public API. See #1045.

  protected async mouseMove(option?: Partial<MouseMoveOption>): Promise<void> {
    return this.interactor.mouseMove(this.locator, option);
  }

  protected async mouseDown(option?: Partial<MouseDownOption>): Promise<void> {
    return this.interactor.mouseDown(this.locator, option);
  }

  protected async mouseUp(option?: Partial<MouseUpOption>): Promise<void> {
    return this.interactor.mouseUp(this.locator, option);
  }

  protected async mouseOver(option?: Partial<HoverOption>): Promise<void> {
    return this.interactor.mouseOver(this.locator, option);
  }

  protected async mouseOut(option?: Partial<MouseOutOption>): Promise<void> {
    return this.interactor.mouseOut(this.locator, option);
  }

  protected async mouseEnter(option?: Partial<MouseEnterOption>): Promise<void> {
    return this.interactor.mouseEnter(this.locator, option);
  }

  protected async mouseLeave(option?: Partial<MouseLeaveOption>): Promise<void> {
    return this.interactor.mouseLeave(this.locator, option);
  }

  async focus(option?: Partial<FocusOption>): Promise<void> {
    return this.interactor.focus(this.locator, option);
  }

  /**
   * Dispatch a keyboard key press on the component. See {@link Interactor.pressKey}.
   * @param key A `KeyboardEvent.key` value, e.g. `'Escape'`, `'Backspace'`, `'Enter'`
   * @param option Reserved for future modifier-key support
   */
  async pressKey(key: string, option?: Partial<PressKeyOption>): Promise<void> {
    return this.interactor.pressKey(this.locator, key, option);
  }

  /**
   * Type text into the component as real per-character keystrokes, inserting at
   * the current caret without clearing. See {@link Interactor.typeText}.
   * @param text The literal text to type, one keystroke per character
   */
  async typeText(text: string): Promise<void> {
    return this.interactor.typeText(this.locator, text);
  }

  /**
   * Dispatch a right-click / `contextmenu` event on the component. See {@link Interactor.contextMenu}.
   */
  protected async contextMenu(): Promise<void> {
    return this.interactor.contextMenu(this.locator);
  }

  /**
   * Activate the component without relying on pointer geometry. See {@link Interactor.activate}.
   */
  protected async activate(): Promise<void> {
    return this.interactor.activate(this.locator);
  }

  /**
   * Scroll the component into the viewport. See {@link Interactor.scrollIntoView}.
   *
   * jsdom has no layout engine, so the scroll is a no-op there and behavioral
   * assertions (visibility, offset) are E2E-only.
   */
  async scrollIntoView(): Promise<void> {
    return this.interactor.scrollIntoView(this.locator);
  }

  /**
   * Scroll the component by the given pixel delta. See {@link Interactor.scrollBy}.
   *
   * jsdom has no layout engine, so the scroll is a no-op there and behavioral
   * assertions (resulting offset) are E2E-only.
   *
   * @param delta Pixel offset to scroll by
   */
  protected async scrollBy(delta: Point): Promise<void> {
    return this.interactor.scrollBy(this.locator, delta);
  }

  /**
   * Drag this component and drop it onto another component. See {@link Interactor.dragTo}.
   *
   * Prefer a keyboard-driven `setValue` over a true drag in real drivers — these
   * drag primitives exist only for cases keyboard cannot express (e.g. panning a
   * Lightbox, reordering a column). jsdom has no layout engine, so the positional
   * outcome of the drag is E2E-only there.
   *
   * @param target Another driver whose root element is the drop target
   */
  protected async dragTo(target: ComponentDriver<any>): Promise<void> {
    return this.interactor.dragTo(this.locator, target.locator);
  }

  /**
   * Drag this component by the given pixel delta from its center. See {@link Interactor.drag}.
   *
   * Prefer a keyboard-driven `setValue` over a true drag in real drivers — these
   * drag primitives exist only for cases keyboard cannot express (e.g. panning a
   * Lightbox, reordering a column). jsdom has no layout engine, so the positional
   * outcome of the drag is E2E-only there.
   *
   * @param delta Pixel offset to drag by
   */
  protected async drag(delta: Point): Promise<void> {
    return this.interactor.drag(this.locator, delta);
  }

  /**
   * Get this component's bounding rectangle. See {@link Interactor.getBoundingRect}.
   *
   * jsdom has no layout engine, so every coordinate and dimension is `0` there;
   * real geometry is E2E-only.
   */
  protected getBoundingRect(): Promise<BoundingRect> {
    return this.interactor.getBoundingRect(this.locator);
  }

  /**
   * Whether the component is visible.  Visibility is defined
   * that the component does not have the CSS property `display: none`,
   * `visibility: hidden`, or `opacity: 0`.  However this does not
   * check whether the component is within the viewport.
   *
   * @returns true if the component is visible, false otherwise
   */
  isVisible(): Promise<boolean> {
    return this.interactor.isVisible(this.locator);
  }

  /**
   * Wait until the component is attached and becomes visible to the DOM.
   * @param timeoutMs The number of milliseconds to wait before timing out
   */
  async waitUntilVisible(timeoutMs: number = 10000): Promise<void> {
    return this.waitUntilComponentState({
      condition: 'visible',
      timeoutMs,
    });
  }

  /**
   * Wait until the component is in the expected state such as
   * the component's visibility or existence. If the component has
   * not reached the expected state within the timeout, it will throw
   * an error.
   *
   * By default it waits until the component is attached to the DOM
   * within 30 seconds.
   *
   * @param option The option to configure the wait behavior
   */
  async waitUntilComponentState(option: Partial<Readonly<WaitForOption>> = defaultWaitForOption): Promise<void> {
    return this.interactor.waitUntilComponentState(this.locator, option);
  }

  waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    return this.interactor.waitUntil(option);
  }

  /**
   * Get the inner HTML of the component
   * @returns The inner HTML of the component
   */
  protected innerHTML(): Promise<string> {
    return this.interactor.innerHTML(this.locator);
  }

  /**
   * Get the runtime CSS selector of the component. This is useful for debugging and testing purposes.
   *
   * @returns The runtime CSS selector of the component
   */
  runtimeCssSelector(): Promise<string> {
    return locatorUtil.toCssSelector(this.locator, this.interactor);
  }

  abstract get driverName(): string;
}
