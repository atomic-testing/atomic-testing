import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import {
  byAttribute,
  byCssSelector,
  byRole,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const dialogParts = {
  /**
   * The header close button — PrimeVue's own `data-pc-name="pcclosebutton"`
   * marker rather than its `aria-label="Close"`, which localizes with the
   * consumer's PrimeVue locale and is therefore not a stable anchor.
   */
  closeButton: {
    locator: byCssSelector('[data-pc-name="pcclosebutton"]'),
    driver: HTMLButtonDriver,
  },
} satisfies ScenePart;

const dialogRootLocator: PartLocator = byRole('dialog', 'Root');
// A ceiling, not a sleep: waitUntil returns as soon as the probe flips. PrimeVue's
// leave transition plus mask teardown lands around 250-350ms in real browsers,
// so the MUI-era 250ms ceiling was borderline; 1000ms absorbs slow engines.
const defaultTransitionDuration = 1000;

/**
 * Option for {@link DialogDriver}.
 */
export interface IDialogDriverOption<ContentT extends ScenePart> extends IContainerDriverOption<
  ContentT,
  typeof dialogParts
> {
  /**
   * Set when the scene renders this Dialog with PrimeVue's `appendTo="self"`
   * (see the class doc's "Anchoring" section) — the dialog then renders in-tree
   * instead of teleporting to `document.body`, so the driver must resolve its
   * locator as an ordinary descendant of the scene's declared locator rather
   * than re-rooting at the document. Defaults to `false` (the zero-config,
   * default-`appendTo` path).
   */
  selfAnchored?: boolean;
}

/**
 * Driver for the PrimeVue `Dialog` component.
 *
 * DOM audit (primevue@4.5.5): the dialog renders `role="dialog"` +
 * `aria-modal="true"` on a `.p-dialog` root teleported (default `appendTo`)
 * under `document.body` inside a `.p-dialog-mask` wrapper, and unmounts
 * entirely while closed — so existence is the open signal and the static
 * portal hooks re-root this driver's locator at the document root (the scene's
 * declared locator, e.g. a forwarded `data-testid`, compounds onto the SAME
 * `[role="dialog"]` element, per the MUI portal recipe). The wrapping mask is
 * NOT used as an anchor: `role="dialog"` is the element PrimeVue's a11y
 * contract names, while the mask is an unlabelled styling wrapper (MUI's
 * `role="presentation"` container has no PrimeVue counterpart).
 *
 * The header links to the dialog via `aria-labelledby` → the title span's
 * `id`, which is how {@link getTitle} resolves the title (PrimeVue's a11y
 * contract) rather than assuming a header structure.
 *
 * **Anchoring (`appendTo`, #1033).** PrimeVue's `Portal` wrapper (shared by
 * every overlay in this package) renders its slot INLINE — no `<Teleport>` at
 * all — whenever `appendTo === 'self'` (`primevue/portal/Portal.vue`'s
 * `inline` computed: `this.disabled || this.appendTo === 'self'`). A
 * self-anchored dialog is therefore a genuine, ordinary DOM descendant of
 * wherever the scene declares it: the document-root re-root above is not just
 * unnecessary there, it is actively wrong (there is no portalled element at
 * the document root to find). Pass `{ selfAnchored: true }` in the driver
 * option for a scene rendering `appendTo="self"`; the portal hooks below then
 * return `undefined` so `getPartFromDefinition` falls back to its normal
 * parent-chain-relative resolution — the SAME code path an ordinary in-tree
 * component uses. Default (`selfAnchored` unset/`false`) is unchanged.
 */
export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof dialogParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IDialogDriverOption<ContentT>>) {
    super(locator, interactor, {
      ...option,
      parts: dialogParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(option?: Partial<IDialogDriverOption<any>>): Optional<PartLocator> {
    return option?.selfAnchored ? undefined : dialogRootLocator;
  }

  static override overrideLocatorRelativePosition(
    option?: Partial<IDialogDriverOption<any>>
  ): Optional<LocatorRelativePosition> {
    return option?.selfAnchored ? undefined : 'Same';
  }

  /**
   * The dialog's title text, resolved through the root's `aria-labelledby` id
   * link, or `null` when the dialog is closed or renders no labelled header.
   */
  async getTitle(): Promise<string | null> {
    if (!(await this.exists())) {
      return null;
    }
    const titleId = await this.getAttribute('aria-labelledby');
    if (!titleId) {
      return null;
    }
    const titleLocator = byAttribute('id', titleId, 'Root');
    if (!(await this.interactor.exists(titleLocator))) {
      return null;
    }
    return (await this.interactor.getText(titleLocator))?.trim() ?? null;
  }

  /**
   * Dismiss the dialog through its header close button, then wait for it to
   * close. Requires `closable` (PrimeVue's default) — the button does not
   * render otherwise.
   * @returns true if the dialog closed within the timeout
   */
  async close(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    await this.enforcePartExistence('closeButton');
    await this.parts.closeButton.click();
    return this.waitForClose(timeoutMs);
  }

  /**
   * Dismiss the dialog by pressing `Escape`, then wait for it to close.
   * PrimeVue handles a `keydown` of `Escape` while the dialog has focus
   * (`closeOnEscape`, on by default) — a dismissal path no click can reach,
   * since a click never produces a key event. Whether it actually closes
   * depends on the consumer honoring `update:visible`; the returned boolean
   * reflects the observed close, not merely the key press.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.exists()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  /**
   * Wait for the dialog to open. "Open" means mounted AND focus settled:
   * PrimeVue moves focus into the dialog in the enter transition's
   * `afterEnter` hook, a frame after the dialog mounts, so an interaction
   * issued in that window can lose focus mid-gesture (observed as truncated
   * typing into a content input). The focus wait probes `:focus-within` —
   * portable CSS in both jsdom and every Playwright engine — and is tolerated
   * to fail, since a dialog with nothing focusable never takes focus.
   */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    if (isOpened !== true) {
      return false;
    }
    const focusedLocator = locatorUtil.append(this.locator, byCssSelector(':focus-within', 'Same'));
    await this.interactor.waitUntil({
      probeFn: () => this.interactor.exists(focusedLocator),
      terminateCondition: true,
      timeoutMs,
    });
    return true;
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
   * Whether the dialog is open. PrimeVue mounts the dialog only while
   * `visible` (no keep-mounted mode is covered here), so simple existence is
   * the open signal — same shape as the Radix `DialogDriver`.
   */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  get driverName(): string {
    return 'PrimeVueV4DialogDriver';
  }
}
