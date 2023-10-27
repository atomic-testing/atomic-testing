import { Point } from '../geometry';

export interface ClickOption {
  /**
   * A point to use relative to the top-left corner of element padding box. If not specified, uses some visible point of
   * the element.
   * Note that in end to end tests such as Playwright, mouse interaction location is not always pixel perfect.
   */
  position?: Point;
}
