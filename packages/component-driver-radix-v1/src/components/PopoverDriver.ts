import {
  byLinkedElement,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

const defaultTransitionDuration = 250;

/**
 * Driver for a Radix `Popover` (`Popover.Root`/`Popover.Content` from `radix-ui`).
 *
 * **Why this driver does NOT use the `overriddenParentLocator`/
 * `overrideLocatorRelativePosition` static-hook recipe that `DialogDriver` and
 * `DropdownMenuDriver` use**: `Popover.Content` renders `role="dialog"` — the
 * IDENTICAL role a modal `Dialog.Content` uses (see
 * `agent-docs/modules/component-driver-radix.md`). The static hooks carry no
 * per-instance data, so a generic `byRole('dialog', 'Root')` re-root cannot tell
 * "the popover" apart from "a simultaneously-open modal dialog" — both resolve
 * to the same role. Radix already solves this instance-scoping problem itself:
 * `Popover.Trigger` carries `aria-controls` pointing at `Popover.Content`'s id,
 * but ONLY while open. So this driver is constructed from the SCENE-supplied
 * TRIGGER locator (an ordinary in-tree element, not portalled) and derives the
 * portalled content locator by following that link with `byLinkedElement`,
 * re-resolved fresh on every interaction (a `LinkedCssLocator` re-reads
 * `aria-controls` each call, so it never goes stale across renders) — the same
 * technique `component-driver-astryx`'s `DropdownMenuDriver` uses to resolve its
 * `aria-controls`-linked panel.
 *
 * **Consequence**: while the popover is closed, `aria-controls` is absent, so
 * `byLinkedElement` cannot resolve a content element at all. Any operation that
 * touches `this.locator` (content parts, `exists()`, `getText()`, …) in that
 * state would otherwise throw — `exists()` is overridden below to treat that
 * specific failure as "not attached," so `isOpen()`/`waitForOpen()`/
 * `waitForClose()` behave the same as `DialogDriver`'s. Declared `content` parts
 * are therefore only meaningful once `isOpen()` (or `open()`) confirms the
 * popover is mounted, exactly as documented on `ContainerDriver`-based portal
 * drivers generally.
 */
export class PopoverDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  /** The scene-supplied trigger locator — also the anchor subclasses (e.g. `ComboboxDriver`) read trigger-side state from. */
  protected readonly triggerLocator: PartLocator;

  constructor(
    triggerLocator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, {}>>
  ) {
    const contentLocator: PartLocator = byLinkedElement('Root')
      .onLinkedElement(triggerLocator)
      .extractAttribute('aria-controls')
      .toMatchMyAttribute('id');
    super(contentLocator, interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
    this.triggerLocator = triggerLocator;
  }

  /**
   * Whether the popover's content is mounted. Radix mounts `Popover.Content`
   * only while open (`forceMount` off by default); when closed, the trigger's
   * `aria-controls` link is absent, so the underlying content locator cannot
   * resolve — `exists()` treats that unresolvable-link failure as "not
   * attached" rather than letting it throw.
   */
  override async exists(): Promise<boolean> {
    try {
      return await super.exists();
    } catch {
      return false;
    }
  }

  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Open the popover by clicking its trigger, if not already open. */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Close the popover by clicking its trigger, if open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Wait for the popover to open (its content to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the popover to close (its content to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Dismiss the popover by pressing `Escape`, then wait for it to close.
   * Radix's `DismissableLayer` handles `Escape` globally while the popover is
   * open — the same dismissal path a real user relies on. Popover (unlike
   * modal `Dialog`) renders no backdrop element to click through, so this is
   * the only universally reachable programmatic dismissal beyond `close()`.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'RadixV1PopoverDriver';
  }
}
