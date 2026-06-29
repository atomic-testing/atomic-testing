import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatComposer (`@astryxdesign/core/ChatComposer`).
 *
 * ChatComposer wraps a {@link ChatComposerInputDriver | ChatComposerInput} (the
 * `contenteditable` editor), a send/stop button, and an optional status message.
 * The scene anchors on the root (`data-testid`, `data-density`). The embedded
 * input carries no `data-testid` of its own, so it is reached by its
 * `role="textbox"][contenteditable]`; the send button by its stable
 * `astryx-chat-send-button` class (Astryx does not forward a testid there either).
 *
 * Reads are jsdom-faithful: `canSend` (the button's `disabled`), `isStopShown`
 * (the button flips `aria-label` Send↔Stop), and the status text (`role="alert"`).
 * Actual send-on-Enter and the contenteditable's append-only typing constraint are
 * inherited from ChatComposerInput; Enter-to-submit is **E2E-only**.
 */
export class ChatComposerDriver extends ComponentDriver<{}> {
  private get sendButton(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('.astryx-chat-send-button'));
  }

  private get editable(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[role="textbox"][contenteditable="true"]'));
  }

  /** The composer density (`data-density`). */
  async getDensity(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-density');
  }

  /** Append text to the embedded editor (append-only — see ChatComposerInput docs). */
  async appendValue(text: string): Promise<void> {
    return this.interactor.enterText(this.editable, text);
  }

  /** Click the send/stop button. */
  async submit(): Promise<void> {
    return this.interactor.click(this.sendButton);
  }

  /** Whether the send button is enabled (it is `disabled` while the editor is empty). */
  async canSend(): Promise<boolean> {
    return !(await this.interactor.hasAttribute(this.sendButton, 'disabled'));
  }

  /** Whether the button is in its "Stop" state (`aria-label="Stop"`) rather than "Send". */
  async isStopShown(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.sendButton, 'aria-label')) === 'Stop';
  }

  /** The status message text (`role="alert"`), or `undefined` when no status is set. */
  async getStatusMessage(): Promise<Optional<string>> {
    const status = locatorUtil.append(this.locator, byCssSelector('[role="alert"]'));
    if (!(await this.interactor.exists(status))) {
      return undefined;
    }
    return (await this.interactor.getText(status)) ?? undefined;
  }

  get driverName(): string {
    return 'AstryxChatComposerDriver';
  }
}
