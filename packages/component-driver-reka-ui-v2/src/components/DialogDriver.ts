import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byRole,
  byTagName,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const dialogParts = {
  /**
   * `DialogTitle` renders `<h2>` by default with NO explicit `role` attribute
   * (implicit ARIA role is not matchable by `byRole`, which only matches
   * explicit `[role="..."]`), so `byTagName('h2')` is the only remaining
   * stable signal — same delta-free finding as `component-driver-radix-v1`'s
   * `DialogDriver`.
   */
  title: {
    locator: byTagName('h2'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const dialogRootLocator: PartLocator = byRole('dialog', 'Root');
const defaultTransitionDuration = 250;

/**
 * Driver for a Reka UI Dialog (`DialogRoot`/`DialogContent` from `reka-ui`).
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered, verified live via `createTestEngine`
 * with a rendered `DialogRoot`/`DialogTrigger`/`DialogPortal`/`DialogOverlay`/
 * `DialogContent`/`DialogTitle` scene): `DialogContent` renders a single
 * `<div role="dialog" data-state="open"/"closed" aria-labelledby aria-describedby>`
 * as a direct child of `document.body` — no wrapper element between it and
 * the `role="dialog"` attribute (Reka's `DismissableLayer`/`FocusScope`
 * ancestors both render `as-child`, forwarding attributes onto this same
 * element) — matching `component-driver-radix-v1`'s `DialogDriver` contract
 * byte-for-byte for the portal re-root recipe below. `DialogTitle` renders
 * `<h2>` with no explicit `role`, confirmed live.
 *
 * One confirmed delta: `DialogOverlay` DOES carry a `data-state="open"/"closed"`
 * attribute (verified live), unlike Radix's own Overlay, which per that
 * driver's doc comment carries no distinguishing role/state attribute at all.
 * This does not unlock a portable `closeByBackdropClick`, though — `data-state`
 * is shared vocabulary across every Reka primitive (checkbox, switch, toggle,
 * …), not overlay-specific, so it still cannot reliably distinguish THIS
 * dialog's own overlay from arbitrary other page content. `DialogOverlay`
 * remains a separate `document.body` child (a sibling of `DialogContent`, not
 * nested inside it), so the only universally reachable dismissal path stays
 * `closeByEscape` — verified live: Reka's `DismissableLayer` attaches its
 * `Escape` handler to `window` (via `@vueuse/core`'s `onKeyStroke`), the same
 * "handled globally" behavior Radix's own `DismissableLayer` documents, so a
 * bubbling `keydown` dispatched anywhere in the document (including on this
 * driver's own re-rooted locator, via `Interactor.pressKey`) reaches it.
 */
export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof dialogParts> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, typeof dialogParts>>
  ) {
    super(locator, interactor, {
      ...option,
      parts: dialogParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return dialogRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  async getTitle(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.title.locator);
    if (!exists) return null;
    return (await this.parts.title.getText()) ?? null;
  }

  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.exists()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  get driverName(): string {
    return 'RekaUiV2DialogDriver';
  }
}
