import { byCssSelector, ComponentDriver, FocusOption, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatComposerInput (`@astryxdesign/core/ChatComposerInput`).
 *
 * The editor is a **`contenteditable` `div[role="textbox"]`**, not an `<input>`/
 * `<textarea>`. That dictates the whole v1 surface:
 *
 * - The value is read from the element's text content ({@link getValue} via
 *   `getText`), because the `getInputValue` interactor primitive returns `null`
 *   for a contenteditable (no `.value`).
 * - Typing is **append-only** ({@link appendValue} via `enterText`): `userEvent.clear`
 *   throws on a contenteditable, so there is no portable "set from scratch".
 *   Blocking dependency: a contenteditable-aware clear/set primitive.
 *
 * The placeholder is a separate `aria-hidden` sibling (not the HTML `placeholder`
 * attribute), and the `@mention`/`/command` suggestion menu is a native popover
 * whose open state (`aria-expanded` on the textbox) only transitions in a real
 * browser — so suggestion *opening* is E2E-only; the closed `aria-expanded="false"`
 * and the accessible name read faithfully in jsdom.
 */
export class ChatComposerInputDriver extends ComponentDriver<{}> {
  /** The contenteditable editor element. */
  protected get editable(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[role="textbox"][contenteditable="true"]'));
  }

  /** The current text, read from the contenteditable's text content (not `.value`). */
  async getValue(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.editable)) ?? undefined;
  }

  /** Append text to the editor. Append-only — see class docs on the contenteditable constraint. */
  async appendValue(text: string): Promise<void> {
    return this.interactor.enterText(this.editable, text);
  }

  /** Focus the editor — the inner contenteditable, not the wrapper root. */
  override async focus(option?: Partial<FocusOption>): Promise<void> {
    return this.interactor.focus(this.editable, option);
  }

  /** The editor's accessible name (`aria-label`, from the `label` prop). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.editable, 'aria-label');
  }

  /** The placeholder text (an `aria-hidden` sibling, not the native `placeholder` attribute). */
  async getPlaceholder(): Promise<Optional<string>> {
    const placeholder = locatorUtil.append(this.locator, byCssSelector('[aria-hidden="true"]'));
    if (!(await this.interactor.exists(placeholder))) {
      return undefined;
    }
    return (await this.interactor.getText(placeholder)) ?? undefined;
  }

  /** Whether the suggestion menu is open (`aria-expanded` on the textbox) — the open transition is E2E-only. */
  async isSuggestionsOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.editable, 'aria-expanded')) === 'true';
  }

  get driverName(): string {
    return 'AstryxChatComposerInputDriver';
  }
}
