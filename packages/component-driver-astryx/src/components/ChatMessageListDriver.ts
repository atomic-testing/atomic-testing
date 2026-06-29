import {
  byCssSelector,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  locatorUtil,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { ChatMessageDriver } from './ChatMessageDriver';

/**
 * Driver for the Astryx ChatMessageList (`@astryxdesign/core/Chat`) — the
 * `role="log"` scroll container that holds a conversation's messages.
 *
 * The list root is a `<div role="log" aria-live="polite" class="astryx-chat-message-list">`
 * that forwards `data-testid` and carries `data-density`. Each message is an
 * `<article class="astryx-chat-message">` descendant, so rows are addressed by that
 * stable semantic class and driven by {@link ChatMessageDriver}. Astryx renders the
 * full history in the DOM (auto-scroll is a browser-only concern owned by
 * `ChatLayout`), so enumeration is faithful in jsdom as well as the browser.
 *
 * When the list is empty it renders the caller's `emptyState` node instead of any
 * messages; {@link getEmptyStateText} reads it via a part the scene anchors on the
 * empty-state content (the empty state has no testid of its own).
 */
export class ChatMessageListDriver extends ListComponentDriver<ChatMessageDriver> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      itemClass: ChatMessageDriver,
      itemLocator: byCssSelector('article.astryx-chat-message'),
      ...option,
    });
  }

  /** The number of rendered messages. */
  async getMessageCount(): Promise<number> {
    return this.getItemCount();
  }

  /** The visual density (`data-density`): `'compact'`, `'balanced'`, or `'spacious'`. */
  async getDensity(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-density');
  }

  /**
   * The empty-state text, or `undefined` when the list has messages.
   *
   * Reads a descendant matched by `selector` — the scene supplies a testid placed
   * on its own empty-state node, since Astryx renders the caller's `emptyState`
   * verbatim without a stable anchor.
   */
  async getEmptyStateText(selector: string): Promise<Optional<string>> {
    const emptyState = locatorUtil.append(this.locator, byCssSelector(selector));
    if (!(await this.interactor.exists(emptyState))) {
      return undefined;
    }
    return (await this.interactor.getText(emptyState))?.trim() || undefined;
  }

  override get driverName(): string {
    return 'AstryxChatMessageListDriver';
  }
}
