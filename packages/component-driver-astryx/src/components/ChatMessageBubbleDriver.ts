import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatMessageBubble (`@astryxdesign/core/Chat`) — the
 * styled "bubble" content container within a chat message.
 *
 * The bubble renders one `<div class="astryx-chat-message-bubble">` that reflects
 * its visual props as stable `data-*` attributes: `data-sender` (inherited from the
 * enclosing `ChatMessage` context, defaulting to `assistant` when standalone),
 * `data-variant` (`filled` | `ghost`), and `data-density`. The scene anchors on
 * the forwarded `data-testid`, and state is read from those data attributes rather
 * than the StyleX-hashed classes.
 */
export class ChatMessageBubbleDriver extends ComponentDriver<{}> {
  /** The bubble's text content. */
  async getText(): Promise<Optional<string>> {
    return (await super.getText())?.trim() || undefined;
  }

  /** The sender (`data-sender`): `'user'`, `'assistant'`, or `'system'`. */
  async getSender(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-sender');
  }

  /** The visual variant (`data-variant`): `'filled'` (default) or `'ghost'`. */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  /** The visual density (`data-density`): `'compact'`, `'balanced'`, or `'spacious'`. */
  async getDensity(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-density');
  }

  override get driverName(): string {
    return 'AstryxChatMessageBubbleDriver';
  }
}
