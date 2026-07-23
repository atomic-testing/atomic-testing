import { Point } from '../geometry';

export interface MouseOption {
  /**
   * A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of
   * the element.
   * Note that in end to end tests such as Playwright, mouse interaction location is not always pixel perfect.
   */
  position?: Point;
}

export interface ClickOption extends MouseOption {
  /**
   * Number of clicks to dispatch as a single gesture, e.g. `2` for a
   * double-click. Only `2` is currently implemented; omit for a single click.
   * Two separate `click()` calls do not reliably register as a real
   * double-click (actionability re-checks between calls can exceed the
   * platform's double-click timing threshold), so a genuine double-click
   * gesture needs this option rather than calling `click()` twice.
   */
  clickCount?: number;
}

export interface MouseMoveOption extends MouseOption {}

export interface MouseDownOption extends MouseOption {}

export interface MouseUpOption extends MouseOption {}

export interface HoverOption extends MouseOption {}

export interface MouseOutOption {}

export interface MouseEnterOption {}

export interface MouseLeaveOption {}
