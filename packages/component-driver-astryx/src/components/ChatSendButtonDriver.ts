import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Astryx ChatSendButton (`@astryxdesign/core/Chat`) — the circular
 * send/stop toggle for a chat composer.
 *
 * It renders an icon-only `<button class="astryx-button ...">` — it is a thin
 * wrapper around the shared `Button` and carries neither its own `data-testid` nor
 * a stable class of its own (only `Button`'s), so the scene anchors on the
 * verbatim accessible name it writes as `aria-label`: `"Send"` (accent/primary)
 * versus `"Stop"` (neutral/secondary) — unconditional in either state, so
 * `:is(button[aria-label="Send"], button[aria-label="Stop"])` is a reliable
 * anchor within a scoped parent. Keep the `:is(...)` wrapper rather than a bare
 * `,` union: `locatorUtil.append`/`toCssSelector` concatenate a locator chain
 * into one selector **string**, so a top-level `,` splits into two selectors —
 * the second loses the parent's scoping and can match anywhere in the document
 * (see `ChatComposerDriver`, which anchors this same pair). The send state
 * disables via the native `disabled` attribute, so {@link isDisabled} is
 * inherited from {@link HTMLButtonDriver}.
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
