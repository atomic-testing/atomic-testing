import {
  byLinkedElement,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

const defaultTransitionDuration = 250;

/**
 * Driver for one expandable `NavigationMenu.Item` (trigger + content) of a
 * Radix `NavigationMenu`, anchored at the item's TRIGGER.
 *
 * **In-tree, but still trigger-anchored**: unlike the other Radix overlays,
 * NavigationMenu does NOT portal — open content mounts inside
 * `NavigationMenu.Viewport`, a descendant of the root `<nav>` (verified
 * against rendered `radix-ui@1.6.1` DOM). The content element is however NOT a
 * DOM descendant of the trigger's `<li>` (it re-parents into the shared
 * viewport), and it is role-less, so a scene cannot chain to it structurally.
 * The trigger carries the contract: `data-state`/`aria-expanded` always
 * present, `aria-controls` pointing at the viewport-mounted content while open
 * — followed at call time via `byLinkedElement`, the same pattern as
 * `PopoverDriver`/`MenubarMenuDriver`, including the `exists()` translation of
 * the unresolvable-link throw while closed.
 *
 * Items that are a plain `NavigationMenu.Link` (no trigger/content) need no
 * driver — they are ordinary in-tree anchors; declare them as plain scene
 * parts. Consumer links INSIDE this item's content go in the `content` scene.
 */
export class NavigationMenuItemDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  private readonly triggerLocator: PartLocator;

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

  /** See the class doc: unresolvable `aria-controls` (item closed) reads as "not attached". */
  override async exists(): Promise<boolean> {
    try {
      return await super.exists();
    } catch {
      return false;
    }
  }

  /** Whether this item's content is open, read from the trigger's always-present `data-state`. */
  async isOpen(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.triggerLocator, 'data-state')) === 'open';
  }

  /** The trigger's visible label. */
  async getTriggerLabel(): Promise<Optional<string>> {
    return (await this.interactor.getText(this.triggerLocator))?.trim() ?? undefined;
  }

  /** Open this item by clicking its trigger, if not already open (triggers also open on hover in real browsers). */
  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Close this item by clicking its trigger (Radix navigation triggers toggle), if open. */
  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  /** Wait for this item's content to mount into the viewport. */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for this item's content to unmount from the viewport. */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  get driverName(): string {
    return 'RadixV1NavigationMenuItemDriver';
  }
}
