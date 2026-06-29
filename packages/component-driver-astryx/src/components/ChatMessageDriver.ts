import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatMessage (`@astryxdesign/core/Chat`) — the per-message
 * sender wrapper that aligns the avatar, name, bubble(s), and metadata for one
 * turn in a conversation.
 *
 * ChatMessage renders an `<article class="astryx-chat-message {sender}">` carrying
 * the stable `data-sender` and `data-density` attributes, and forwards
 * `data-testid` onto that root. The sender name (when present) lives in an inner
 * `<div id>` referenced by the article's `aria-labelledby`; that id is generated,
 * not a CSS-expressible anchor and the article emits no name testid, so **the name
 * is deliberately not exposed** (#909/#923 deferred name-aware lookup). The bubble
 * and metadata are descendants targeted by their stable `astryx-chat-message-*`
 * classes — the lone exception to the no-class rule, since those are semantic
 * (not StyleX-hashed) and Astryx documents them as targetable.
 */
export class ChatMessageDriver extends ComponentDriver<{}> {
  /** The message bubble (`.astryx-chat-message-bubble`), when the content is bubbled. */
  private get bubble(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('.astryx-chat-message-bubble'));
  }

  /** The footer metadata block (`.astryx-chat-message-metadata`), when present. */
  private get metadata(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('.astryx-chat-message-metadata'));
  }

  /** The sender (`data-sender`): `'user'`, `'assistant'`, or `'system'`. */
  async getSender(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-sender');
  }

  /** The visual density (`data-density`): `'compact'`, `'balanced'`, or `'spacious'`. */
  async getDensity(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-density');
  }

  /** The whole message's visible text (name + bubble + metadata), trimmed. */
  override async getText(): Promise<Optional<string>> {
    return (await super.getText())?.trim() || undefined;
  }

  /** Just the bubble's text, or `undefined` when the message has no bubble. */
  async getBubbleText(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.bubble))) {
      return undefined;
    }
    return (await this.interactor.getText(this.bubble))?.trim() || undefined;
  }

  /** The metadata block's text, or `undefined` when the message has no metadata. */
  async getMetadataText(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.metadata))) {
      return undefined;
    }
    return (await this.interactor.getText(this.metadata))?.trim() || undefined;
  }

  override get driverName(): string {
    return 'AstryxChatMessageDriver';
  }
}
