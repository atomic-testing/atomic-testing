import { ClickOption, HoverOption } from '../interactor/MouseOption';

export interface IFormFieldDriver<T> {
  getValue(): Promise<T>;
}

export interface IInputDriver<T> extends IFormFieldDriver<T> {
  setValue(value: T): Promise<boolean>;
}

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

export interface IClickableDriver {
  click(option?: ClickOption): Promise<void>;
}

/**
 * Provide hover functionality to a driver.
 */
export interface IMouseInteractableDriver {
  hover(option?: HoverOption): Promise<void>;
}
