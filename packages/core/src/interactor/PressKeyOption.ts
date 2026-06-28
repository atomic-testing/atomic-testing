/**
 * Options for {@link Interactor.pressKey}.
 *
 * Each flag mirrors the corresponding `KeyboardEvent` boolean (`ctrlKey`,
 * `shiftKey`, `altKey`, `metaKey`). They let a single `pressKey` express a
 * modifier chord, so the dispatched key event carries the held modifiers a
 * component reads off the event — e.g. activating a `Ctrl+Enter` "submit"
 * shortcut, or proving the negative case where `Shift+Enter` must NOT fire a
 * plain-`Enter` handler (it should insert a newline instead). Omitting a flag
 * leaves that modifier unpressed.
 */
export interface PressKeyOption {
  /** Hold `Control` during the key press (`KeyboardEvent.ctrlKey`). */
  ctrl?: boolean;
  /** Hold `Shift` during the key press (`KeyboardEvent.shiftKey`). */
  shift?: boolean;
  /** Hold `Alt`/`Option` during the key press (`KeyboardEvent.altKey`). */
  alt?: boolean;
  /** Hold `Meta`/`Command`/`Windows` during the key press (`KeyboardEvent.metaKey`). */
  meta?: boolean;
}
