import { Point } from '../geometry';

export interface MouseOption {
  /**
   * A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of
   * the element.
   * Note that in end to end tests such as Playwright, mouse interaction location is not always pixel perfect.
   */
  position?: Point;
}

export interface ClickOption extends MouseOption {}

export interface MouseMoveOption extends MouseOption {}

export interface MouseDownOption extends MouseOption {}

export interface MouseUpOption extends MouseOption {}

export interface HoverOption extends MouseOption {}
