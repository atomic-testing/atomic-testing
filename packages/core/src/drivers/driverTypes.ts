import { ClickOption, HoverOption } from '../interactor/MouseOption';

/**
 * A driver whose component holds a readable value — the base capability shared
 * by every form field, regardless of whether that value can also be written.
 */
export interface IFormFieldDriver<T> {
  getValue(): Promise<T>;
}

/**
 * A driver whose component's value can be both read and written — a text field,
 * select, or similar input. Extends {@link IFormFieldDriver} with `setValue`.
 */
export interface IInputDriver<T> extends IFormFieldDriver<T> {
  setValue(value: T): Promise<boolean>;
}

/**
 * A driver whose component has a binary selected/unselected state that can be
 * toggled — a checkbox, radio, or switch. Distinct from {@link IInputDriver}:
 * the state is a boolean toggle rather than an arbitrary typed value.
 */
export interface IToggleDriver {
  isSelected(): Promise<boolean>;
  setSelected(selected: boolean): Promise<void>;
}

/**
 * A driver whose component can be disabled. Implemented uniformly so the obvious
 * assertion `expect(await driver.isDisabled()).toBe(true)` works across components,
 * rather than each consumer reaching into a component-specific attribute or class.
 */
export interface IDisableableDriver {
  isDisabled(): Promise<boolean>;
}

/**
 * A driver whose component can be put in a read-only state — its value is shown
 * but not editable. Distinct from {@link IDisableableDriver}: a read-only control
 * is still focusable and is submitted with its form.
 */
export interface IReadonlyableDriver {
  isReadonly(): Promise<boolean>;
}

/**
 * A driver whose component can be marked required (a form control).
 */
export interface IRequirableDriver {
  isRequired(): Promise<boolean>;
}

/**
 * A driver whose component can be in an invalid/error state (a form control).
 */
export interface IValidatableDriver {
  isError(): Promise<boolean>;
}

/**
 * A driver whose component can be clicked. Implemented uniformly so the obvious
 * `await driver.click()` works across components, regardless of what a click
 * means for that component internally.
 */
export interface IClickableDriver {
  click(option?: ClickOption): Promise<void>;
}

/**
 * Provide hover functionality to a driver.
 */
export interface IMouseInteractableDriver {
  hover(option?: HoverOption): Promise<void>;
}
