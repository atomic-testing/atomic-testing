import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Astryx ChatSendButton (`@astryxdesign/core/Chat`) — the circular
 * send/stop toggle for a chat composer.
 *
 * It renders an icon-only `<button class="astryx-chat-send-button">`. Crucially,
 * **it does not forward `data-testid`** (it spreads props onto the inner `Button`,
 * which keeps its own), so the scene anchors on the stable `astryx-chat-send-button`
 * class, or — to disambiguate the two states — on the verbatim accessible name the
 * icon-only Button writes as `aria-label`: `"Send"` (accent/primary) versus
 * `"Stop"` (neutral/secondary). The send state disables via the native `disabled`
 * attribute, so {@link isDisabled} is inherited from {@link HTMLButtonDriver}.
 */
export class ChatSendButtonDriver extends HTMLButtonDriver {
  /** The accessible name the icon-only button exposes — `"Send"` or `"Stop"`. */
  private async getAccessibleName(): Promise<string | undefined> {
    return (await this.interactor.getAttribute(this.locator, 'aria-label')) ?? undefined;
  }

  /** Whether the button is in its send state (`aria-label="Send"`). */
  async isSend(): Promise<boolean> {
    return (await this.getAccessibleName()) === 'Send';
  }

  /** Whether the button is in its stop state (`aria-label="Stop"`). */
  async isStop(): Promise<boolean> {
    return (await this.getAccessibleName()) === 'Stop';
  }

  override get driverName(): string {
    return 'AstryxChatSendButtonDriver';
  }
}
