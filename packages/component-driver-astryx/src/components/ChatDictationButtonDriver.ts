import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatDictationButton (`@astryxdesign/core/Chat`) — the
 * microphone toggle for voice input in a chat composer.
 *
 * It wraps an icon-only `<button>` in a `<span>` and, like {@link ChatSendButtonDriver},
 * **does not forward `data-testid`**; the button also renders `null` when speech
 * recognition is unsupported and `isHiddenWhenUnsupported` is left at its default.
 * The scene therefore anchors directly on the inner button via its verbatim
 * accessible name, which the icon-only Button writes as `aria-label`:
 * `"Start dictation"` when idle and `"Stop dictation"` while listening. State is
 * read from that name — {@link isListening} — since the visual difference (a static
 * mic icon versus volume-reactive bars) is a browser-only rendering detail.
 */
export class ChatDictationButtonDriver extends ComponentDriver<{}> {
  /** The button's accessible name (`aria-label`): `"Start dictation"` or `"Stop dictation"`. */
  async getAccessibleName(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Whether dictation is active — the button reads `aria-label="Stop dictation"`. */
  async isListening(): Promise<boolean> {
    return (await this.getAccessibleName()) === 'Stop dictation';
  }

  override get driverName(): string {
    return 'AstryxChatDictationButtonDriver';
  }
}
