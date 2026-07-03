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
   * `Dialog.Title`, linked from the content's `aria-labelledby`. It renders
   * `<h2>` by default with NO explicit `role` attribute (`role="heading"` is
   * only the tag's IMPLICIT ARIA role, computed by the accessibility tree, not
   * present in the DOM — `byRole('heading')` would not match it, since the
   * locator system matches only explicit `[role="..."]` attributes) and no
   * `data-slot` in bare Radix. `byTagName('h2')` is the only remaining stable
   * signal; if a consumer overrides the heading level via `asChild`, this part
   * needs a matching adjustment.
   */
  title: {
    locator: byTagName('h2'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const dialogRootLocator: PartLocator = byRole('dialog', 'Root');
const defaultTransitionDuration = 250;

/**
 * Driver for a Radix `Dialog` (`Dialog.Root`/`Dialog.Content` from `radix-ui`).
 *
 * **Portal re-root**: `Dialog.Content` renders `role="dialog"` as a **direct
 * child of `document.body`** (see `agent-docs/modules/component-driver-radix.md`),
 * not nested under the trigger, so the static `overriddenParentLocator`/
 * `overrideLocatorRelativePosition` hooks re-root this driver's own locator at
 * the document root — the scene's declared locator (e.g. a `data-testid`
 * forwarded onto `Dialog.Content`) becomes a compound selector on the SAME
 * `[role="dialog"]` element, searched from `document`, per the portal recipe in
 * `docs/docs/guides/portal-and-overlays.md`. Mirrors
 * `component-driver-mui-v7`'s `DialogDriver` shape.
 *
 * **`Dialog.Overlay` is a separate `document.body` child** (a sibling of
 * `Dialog.Content`, not nested inside it — unlike MUI, which wraps both under one
 * `role="presentation"` container), and carries no ARIA role or Radix state
 * attribute that distinguishes it from arbitrary page content without an
 * app-specific `data-testid`/`data-slot`. There is therefore no library-portable
 * `closeByBackdropClick`; the only universally reachable dismissal path proven
 * against real Radix DOM is `closeByEscape` (Radix's `DismissableLayer` handles
 * `Escape` globally, same code path a real user relies on).
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

  /** The dialog's title text, or `null` when `Dialog.Title` is absent. */
  async getTitle(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.title.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.title.getText()) ?? null;
  }

  /**
   * Dismiss the dialog by pressing `Escape`, then wait for it to close.
   * Radix's `DismissableLayer` handles a `keydown` of `Escape` while the dialog
   * is open (unreachable by any click, since a click never produces a key
   * event) — the same dismissal path `Dialog.Content`'s own `onEscapeKeyDown`
   * consumer hook fires from. Whether it actually closes depends on the
   * consumer honoring the dismissal (Radix's `onOpenChange`); the returned
   * boolean reflects the observed close, not merely the key press.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.exists()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  /** Wait for the dialog to open (its content to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the dialog to close (its content to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Whether the dialog is open. Radix mounts `Dialog.Content` only while open
   * (`forceMount` off by default), so simple existence is the open signal — no
   * separate always-mounted container to check visibility on, unlike MUI.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  get driverName(): string {
    return 'RadixV1DialogDriver';
  }
}
