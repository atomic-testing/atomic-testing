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

export const alertDialogParts = {
  /**
   * `AlertDialog.Title`, linked from the content's `aria-labelledby`. Same
   * constraint as `DialogDriver`'s title part: it renders `<h2>` with NO
   * explicit `role` attribute (the heading role is implicit, invisible to the
   * CSS-only locator engine) and no `data-slot` in bare Radix, so
   * `byTagName('h2')` is the only remaining stable signal; an `asChild`
   * heading-level override needs a matching scene adjustment.
   */
  title: {
    locator: byTagName('h2'),
    driver: HTMLElementDriver,
  },
  /**
   * `AlertDialog.Description`, linked from the content's `aria-describedby`.
   * Renders `<p>` with no explicit role or `data-slot` — same one-tier-down
   * tag anchor rationale as the title.
   */
  description: {
    locator: byTagName('p'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const alertDialogRootLocator: PartLocator = byRole('alertdialog', 'Root');
const defaultTransitionDuration = 250;

/**
 * Driver for a Radix `AlertDialog` (`AlertDialog.Root`/`AlertDialog.Content`
 * from `radix-ui`).
 *
 * **Portal re-root**: identical shape to `DialogDriver` — overlay and content
 * are EACH direct `document.body` children — except the content renders
 * `role="alertdialog"`, so the static hooks re-root at that role. Because the
 * role differs from both modal Dialog (`dialog`) and Popover (`dialog`), the
 * static re-root has no collision problem and the trigger-anchored
 * `aria-controls` pattern `PopoverDriver` needs is unnecessary here.
 *
 * **`AlertDialog.Cancel`/`AlertDialog.Action` have NO distinguishing DOM
 * attribute** (both render plain `<button>`s with no role/`data-*` marker, and
 * their order is consumer-defined — verified against rendered `radix-ui@1.6.1`
 * DOM), so the driver cannot expose portable `clickCancel`/`clickAction`;
 * declare them as `content` parts anchored by forwarded `data-testid`s.
 * (Astryx's positional first/last-button match does not transfer: Radix
 * imposes no button order or count.)
 *
 * Note Radix AlertDialog blocks outside-pointer dismissal by design, but
 * `Escape` still dismisses through `DismissableLayer` — `closeByEscape` is the
 * portable programmatic dismissal, same as `DialogDriver`.
 */
export class AlertDialogDriver<ContentT extends ScenePart = {}> extends ContainerDriver<
  ContentT,
  typeof alertDialogParts
> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, typeof alertDialogParts>>
  ) {
    super(locator, interactor, {
      ...option,
      parts: alertDialogParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return alertDialogRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /** The dialog's title text, or `null` when `AlertDialog.Title` is absent. */
  async getTitle(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.title.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.title.getText()) ?? null;
  }

  /** The dialog's description text, or `null` when `AlertDialog.Description` is absent. */
  async getDescription(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.description.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.description.getText()) ?? null;
  }

  /**
   * Dismiss the dialog by pressing `Escape`, then wait for it to close.
   * Radix intentionally disables AlertDialog's outside-pointer dismissal, but
   * `Escape` still flows through `DismissableLayer` (verified against rendered
   * DOM: the dialog unmounts). The returned boolean reflects the observed
   * close, not merely the key press.
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
   * Whether the dialog is open. Radix mounts `AlertDialog.Content` only while
   * open (`forceMount` off by default), so existence is the open signal.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  get driverName(): string {
    return 'RadixV1AlertDialogDriver';
  }
}
