import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatSystemMessage (`@astryxdesign/core/Chat`) — the
 * centered, non-sender notice in a chat thread (e.g. "Conversation started", a
 * date separator).
 *
 * Both variants render a `<div role="status" class="astryx-chat-system-message">`
 * that forwards `data-testid` and carries the stable `data-variant` (`default` |
 * `divider`); the divider variant adds an inner `role="separator"` but keeps the
 * same root, so severity-style reads come from `data-variant` rather than the
 * shifting inner structure.
 */
export class ChatSystemMessageDriver extends ComponentDriver<{}> {
  /** The message text. */
  override async getText(): Promise<Optional<string>> {
    return (await super.getText())?.trim() || undefined;
  }

  /** The visual variant (`data-variant`): `'default'` or `'divider'`. */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  override get driverName(): string {
    return 'AstryxChatSystemMessageDriver';
  }
}
