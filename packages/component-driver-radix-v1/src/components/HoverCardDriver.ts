import {
  byCssSelector,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

/**
 * The portalled popper surface Radix mounts floating content into. HoverCard
 * content renders inside `div[data-radix-popper-content-wrapper]` — a Radix
 * structural attribute (anchor tier 3), the ONLY stable portal marker
 * HoverCard has (see the class doc).
 */
const popperWrapperLocator: PartLocator = byCssSelector('[data-radix-popper-content-wrapper]', 'Root');

const defaultTransitionDuration = 250;

/**
 * Driver for a Radix `HoverCard` (`HoverCard.Root`/`HoverCard.Content` from
 * `radix-ui`), anchored at the CONTENT via a forwarded `data-testid`.
 *
 * **Why neither the role re-root (`DialogDriver`) nor the trigger-link pattern
 * (`PopoverDriver`/`TooltipDriver`) applies**: Radix documents HoverCard as
 * "intended for sighted users only," and the rendered DOM (verified against
 * `radix-ui@1.6.1`) reflects that — the portalled content is ROLE-LESS, and
 * the trigger carries NO `aria-controls`/`aria-describedby`/`aria-haspopup`,
 * only `data-state`. With no role to re-root at and no a11y link to follow,
 * the remaining stable anchors are the popper wrapper's structural attribute
 * plus a scene-forwarded `data-testid` on `HoverCard.Content`: the static
 * hooks re-root at `[data-radix-popper-content-wrapper]` (document-rooted) and
 * keep the scene locator as a DESCENDANT (unlike Dialog's `'Same'` — the
 * testid lands on the content `<div>` INSIDE the wrapper), which is
 * per-instance safe because the testid disambiguates simultaneous poppers.
 *
 * The scene therefore declares TWO parts: the trigger (any driver with
 * `hover()`, e.g. `HTMLElementDriver`) and this content driver — the same
 * trigger/overlay split `DropdownMenuDriver` scenes use.
 *
 * **jsdom vs E2E split**: opening by hovering the trigger works under jsdom
 * (`DOMInteractor.hover` fires the `pointerenter` sequence Radix listens to)
 * when the scene sets `openDelay={0}`; the default 700ms/300ms delay
 * behaviour, and closing by pointer-leave (jsdom's `mouseOut` fires no
 * `pointerleave`), are E2E-only — {@link closeByEscape} is the portable close.
 */
export class HoverCardDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption<ContentT, {}>>) {
    super(locator, interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return popperWrapperLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Descendant';
  }

  /**
   * Whether the card is open. Radix mounts `HoverCard.Content` only while open
   * (`forceMount` off by default), so existence is the open signal.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the card to open (its content to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the card to close (its content to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Dismiss the card by pressing `Escape`, then wait for it to close. Radix's
   * `DismissableLayer` handles `Escape` while open — the portable close path,
   * since pointer-leave closing is E2E-only (see the class doc).
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'RadixV1HoverCardDriver';
  }
}
