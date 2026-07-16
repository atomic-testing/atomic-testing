import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const dialogParts = {
  title: {
    locator: byCssClass('fui-DialogTitle'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const dialogSurfaceRootLocator: PartLocator = byCssClass('fui-DialogSurface', 'Root');
const defaultTransitionDuration = 1000;

/**
 * Driver for the Fluent v9 `Dialog` (`DialogTrigger` + `DialogSurface` /
 * `DialogBody` / `DialogTitle` / `DialogContent` / `DialogActions`).
 *
 * **Portal re-root** (DOM audit, `@fluentui/react-components@9.74.3`):
 * `DialogSurface` mounts into a cloned `FluentProvider` on `document.body`
 * (Fluent's own `mountNode` default, confirmed against
 * `@fluentui/react-portal`'s types) — a sibling of the render root, not a
 * descendant of the trigger — and renders `role="dialog"` with `aria-modal`
 * reflecting the `modalType` prop (`"modal"` / `"non-modal"`). This driver
 * therefore re-roots via the static portal hooks, the same recipe
 * `component-driver-mui-v9`'s `DialogDriver` uses.
 *
 * **Anchor choice — class over role**: `role="dialog"` is shared with
 * `OverlayDrawer` and `TeachingPopover` (both reuse the same modal/tabster
 * machinery), so on its own it cannot tell the three apart — exactly the case
 * Wave 1's anchor priority defers to tier 2 for ("Fluent's own un-hashed
 * structural classes... where role/ARIA isn't enough"). This driver re-roots on
 * the un-hashed `fui-DialogSurface` class instead. The scene's own locator
 * (forwarded onto `DialogSurface`, e.g. `<DialogSurface data-testid="...">`)
 * then compounds onto that SAME element (`'Same'` position), giving
 * `.fui-DialogSurface[data-testid="..."]` — verified against rendered DOM to
 * disambiguate two simultaneously open dialogs correctly, since each surface
 * only matches its own forwarded test id.
 *
 * **Non-modal dialogs auto-render a close `X`** (`fui-DialogTitle__action`,
 * `aria-label="close"`) when `DialogTitle` has no explicit `action` prop; modal
 * dialogs do not render one (they rely on `DialogActions`/Escape instead).
 *
 * **No portable `closeByBackdropClick`**: unlike MUI (whose backdrop nests
 * inside the same `role="presentation"` container the dialog root resolves
 * to), Fluent's backdrop (`fui-DialogSurface__backdrop`) is a SEPARATE
 * `document.body` sibling of `DialogSurface`, not its descendant — verified
 * against rendered DOM. With no id/data-* link back to a specific dialog, a
 * backdrop click cannot be scoped to THIS instance when more than one modal is
 * open, so only {@link closeByEscape} is offered as a portable dismissal path
 * (mirrors `component-driver-radix-v1`'s `DialogDriver`, which hits the same
 * un-linkable-overlay wall).
 */
export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof dialogParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: dialogParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return dialogSurfaceRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /** The dialog's title text, or `null` when `DialogTitle` is absent. */
  async getTitle(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.title.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.title.getText()) ?? null;
  }

  /** Whether this dialog is modal (`aria-modal="true"`) or non-modal (`"false"`). */
  async isModal(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-modal')) === 'true';
  }

  /**
   * Whether the dialog is mounted. Fluent mounts `DialogSurface` only while
   * open (`unmountOnExit`-equivalent default), so existence is the open signal.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the dialog to open (its surface to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the dialog to close (its surface to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /**
   * Dismiss the dialog by pressing `Escape`, then wait for it to close.
   * Whether it actually closes depends on the consumer honoring `onOpenChange`;
   * the returned boolean reflects the observed close, not merely the key press.
   *
   * **Escape dismisses the topmost stacked overlay, not necessarily THIS one**:
   * verified against real Chromium — with two simultaneously open dialogs,
   * `Escape` closes only the most-recently-opened one, regardless of which
   * dialog's locator the key event is dispatched on (Fluent's dismiss handling
   * is a global, stack-ordered listener, not per-element). Call this on the
   * LAST-opened instance when driving a stacked scenario.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.exists()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'FluentV9DialogDriver';
  }
}
