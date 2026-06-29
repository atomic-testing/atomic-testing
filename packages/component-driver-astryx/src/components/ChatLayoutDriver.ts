import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatLayout (`@astryxdesign/core/Chat`) — the shell that
 * places the message area in page flow with a composer docked to the bottom.
 *
 * The root `<div class="astryx-chat-layout">` forwards `data-testid` and carries
 * the stable `data-density`. When `children` is empty the message area renders the
 * caller's `emptyState` node instead; {@link getEmptyStateText} reads it via a part
 * the scene anchors on the empty-state content (Astryx renders it verbatim, with no
 * stable anchor of its own).
 *
 * The scroll-to-bottom button (`hasScrollButton`) drives `useChatStreamScroll`,
 * which depends on real layout geometry and an `IntersectionObserver`; it is a
 * browser-only concern, so it is intentionally not exposed here. Examples pass
 * `scrollButton={null}` to suppress the default button under jsdom.
 */
export class ChatLayoutDriver extends ComponentDriver<{}> {
  /** The visual density (`data-density`): `'compact'`, `'balanced'`, or `'spacious'`. */
  async getDensity(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-density');
  }

  /**
   * The empty-state text, or `undefined` when the layout has message content.
   *
   * Reads a descendant matched by `selector` — the scene supplies a testid placed
   * on its own empty-state node.
   */
  async getEmptyStateText(selector: string): Promise<Optional<string>> {
    const emptyState: PartLocator = locatorUtil.append(this.locator, byCssSelector(selector));
    if (!(await this.interactor.exists(emptyState))) {
      return undefined;
    }
    return (await this.interactor.getText(emptyState))?.trim() || undefined;
  }

  override get driverName(): string {
    return 'AstryxChatLayoutDriver';
  }
}
