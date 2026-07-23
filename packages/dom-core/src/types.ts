import { ITestEngineOption } from '@atomic-testing/core';

/**
 * @deprecated Use {@link ITestEngineOption} from `@atomic-testing/core`.
 */
export type IDomTestEngineOption = ITestEngineOption;

/**
 * The subset of the `@testing-library/user-event` API that `DOMInteractor`
 * dispatches interactions through. Structural on purpose: the library's default
 * export and a configured instance from `userEvent.setup()` — such as Storybook's
 * instrumented `userEvent` from `storybook/test` — are both assignable without
 * coupling to either package's concrete types.
 */
export interface UserEventDispatcher {
  clear(element: Element): Promise<void>;
  click(element: Element): Promise<void>;
  dblClick(element: Element): Promise<void>;
  hover(element: Element): Promise<void>;
  // Returns unknown (not void): the default user-event export's keyboard()
  // resolves to its internal keyboard state, and Promise's type parameter is
  // invariant to the void-return assignability exception.
  keyboard(text: string): Promise<unknown>;
  selectOptions(element: Element, values: string[]): Promise<void>;
  type(element: Element, text: string): Promise<void>;
  upload(element: HTMLElement, files: File | File[]): Promise<void>;
}

/**
 * Construction options for `DOMInteractor`.
 */
export interface DOMInteractorOption {
  /**
   * The user-event API interactions are dispatched through.
   * @defaultValue the `@testing-library/user-event` default export
   */
  readonly userEvent?: UserEventDispatcher;
}
