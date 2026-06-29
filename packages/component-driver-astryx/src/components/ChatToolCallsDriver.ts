import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx ChatToolCalls (`@astryxdesign/core/Chat`) — the block that
 * surfaces an LLM turn's tool/function invocations.
 *
 * The root `<div class="astryx-chat-tool-calls">` forwards `data-testid`. Its shape
 * depends on the call count:
 * - **Single call** — one inline call row, no group chrome and no `aria-expanded`.
 * - **Multiple calls** — a collapsible header `<div role="button" aria-expanded>`
 *   summarising the group, followed by a body that always renders every call row
 *   in the DOM (it is only CSS-collapsed, never unmounted), so enumeration is
 *   faithful in jsdom as well as the browser.
 *
 * Astryx assigns no per-row anchor (rows are StyleX-styled `<div>`s), so the group
 * header — the one element carrying `aria-expanded` — is the stable handle for
 * {@link isExpanded}/{@link toggleGroup}. {@link getCallCount} counts the call rows
 * by their shape: a row is a `<div>` whose first child is the status-icon `<span>`,
 * which excludes the StyleX wrapper `<div>`s (their first child is a `<div>`) and
 * the group header (a `<div role="button">`). `:has()` is supported by jsdom's
 * nwsapi and every Playwright engine, mirroring `PowerSearchDriver`.
 */
const CALL_ROW_SELECTOR = 'div:not([role]):has(> span:first-child)';

export class ChatToolCallsDriver extends ComponentDriver<{}> {
  /** The collapsible group header — present only when there is more than one call. */
  private get groupHeader(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('[role="button"][aria-expanded]'));
  }

  /** The call rows (single inline row, or every row in a group's DOM-resident body). */
  private get callRows(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(CALL_ROW_SELECTOR));
  }

  /** Whether this is a multi-call group (it renders the collapsible header). */
  async isGrouped(): Promise<boolean> {
    return this.interactor.exists(this.groupHeader);
  }

  /**
   * The number of tool calls. A single call reports `1`; a group reports the number
   * of rows rendered in its (DOM-resident) body, regardless of expanded state.
   */
  async getCallCount(): Promise<number> {
    let count = 0;
    for (let i = 1; await this.interactor.exists(this.nthCallRow(i)); i++) {
      count++;
    }
    return count;
  }

  /**
   * Whether the group is expanded, or `undefined` for a single call (which has no
   * expandable header). Read from the header's `aria-expanded`.
   */
  async isExpanded(): Promise<Optional<boolean>> {
    if (!(await this.isGrouped())) {
      return undefined;
    }
    return (await this.interactor.getAttribute(this.groupHeader, 'aria-expanded')) === 'true';
  }

  /** Toggle the group's expanded state by clicking its header. No-op for a single call. */
  async toggleGroup(): Promise<void> {
    if (await this.isGrouped()) {
      await this.interactor.click(this.groupHeader);
    }
  }

  private nthCallRow(index: number): PartLocator {
    return locatorUtil.append(this.callRows, byCssSelector(`:nth-of-type(${index})`, 'Same'));
  }

  override get driverName(): string {
    return 'AstryxChatToolCallsDriver';
  }
}
