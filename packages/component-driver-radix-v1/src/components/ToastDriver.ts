import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const toastParts = {
  /**
   * `Toast.Action`. Radix marks it with `data-radix-toast-announce-alt` (the
   * required `altText` prop lands there) — the only attribute that
   * distinguishes it from `Toast.Close`, which shares
   * `data-radix-toast-announce-exclude` (a Radix structural attribute, anchor
   * tier 3; neither button carries a role or `data-slot` in bare Radix).
   */
  action: {
    locator: byCssSelector('[data-radix-toast-announce-alt]'),
    driver: HTMLButtonDriver,
  },
  /**
   * `Toast.Close` — announce-excluded like the action, but WITHOUT the
   * action's `altText` attribute.
   */
  close: {
    locator: byCssSelector('[data-radix-toast-announce-exclude]:not([data-radix-toast-announce-alt])'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

const defaultTransitionDuration = 250;

/**
 * Driver for a single Radix `Toast` (`Toast.Root` from `radix-ui`), anchored
 * by a `data-testid` forwarded onto `Toast.Root`.
 *
 * **In-tree, no portal**: the toast renders as an `<li>` inside
 * `Toast.Viewport`'s `<ol>` (itself wrapped in a hotkey-labelled
 * `role="region"` landmark), wherever the consumer placed the viewport —
 * verified against rendered `radix-ui@1.6.1` DOM. No re-root hooks are needed;
 * the scene locator chains normally.
 *
 * **`Toast.Title`/`Toast.Description` have NO stable anchor** (plain `<div>`s,
 * no role/`data-slot`/link — the `role="status"` live announcer Radix renders
 * is a separate off-tree element that duplicates the text for screen readers),
 * so title/description reads are consumer `content` parts anchored by
 * forwarded `data-testid`s rather than driver-owned parts. The action/close
 * buttons DO have structural anchors (see {@link toastParts}).
 *
 * The auto-dismiss `duration` timer is real-time behaviour; suites assert the
 * click-driven paths ({@link close}, {@link clickAction}) and leave
 * timer-driven auto-dismissal to E2E where it matters to the consumer.
 */
export class ToastDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, typeof toastParts> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, typeof toastParts>>
  ) {
    super(locator, interactor, {
      ...option,
      parts: toastParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  /**
   * Whether the toast is open. Radix mounts `Toast.Root` only while open
   * (`forceMount` off by default), so existence is the open signal.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** The toast's `data-state` (`open`/`closed`), or `undefined` when unmounted. */
  async getState(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-state');
  }

  /** Click `Toast.Close`, firing the toast's dismissal (`onOpenChange(false)`). */
  async close(): Promise<void> {
    await this.parts.close.click();
  }

  /** Click `Toast.Action`. Radix dismisses the toast after an action click. */
  async clickAction(): Promise<void> {
    await this.parts.action.click();
  }

  /** Wait for the toast to appear (its root to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the toast to disappear (its root to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'RadixV1ToastDriver';
  }
}
