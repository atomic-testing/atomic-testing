import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byTagName,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { isDialogOpen, OVERLAY_TRANSITION_MS, waitForDialogOpenState } from '../internal/overlayLifecycle';

export const parts = {
  title: {
    locator: byTagName('h2'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

/**
 * Driver for the Astryx Dialog (`@astryxdesign/core/Dialog`).
 *
 * Astryx Dialog is a controlled, native `<dialog>` opened with `showModal()`; it
 * forwards `data-testid` onto that element and is always `aria-modal="true"`. The
 * driver anchors on the `<dialog>` by testid and reads open state from its `open`
 * attribute (set by `showModal()`). Unlike MUI's portalled dialog, Astryx renders
 * the `<dialog>` in place, so child content is a normal descendant — there is no
 * portal root to escape to, hence no `overriddenParentLocator()`.
 *
 * `getTitle` reads the `DialogHeader` title (`<h2>`); arbitrary content is reached
 * through this `ContainerDriver`'s `content` parts. The Escape-to-dismiss flow
 * works in jsdom (the `<dialog>` keydown handler) and in a real browser; backdrop
 * (`::backdrop`) dismissal is a native pointer behaviour left to the E2E run.
 */
export class DialogDriver<ContentT extends ScenePart> extends ContainerDriver<ContentT, typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  /** Whether the dialog is open — Astryx sets the `<dialog>`'s `open` attribute via `showModal()`. */
  async isOpen(): Promise<boolean> {
    return isDialogOpen(this.interactor, this.locator);
  }

  /** Whether the dialog is modal (`aria-modal="true"`, always set by Astryx). */
  async isModal(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-modal')) === 'true';
  }

  /**
   * The dialog's explicit ARIA role: `'alertdialog'` only when `purpose="required"`,
   * otherwise `undefined` (a plain `<dialog>` has the implicit `dialog` role, which
   * is not exposed as an attribute).
   */
  async getRole(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'role');
  }

  /** The dialog title rendered by `DialogHeader` (`<h2>`), or `undefined` when absent. */
  async getTitle(): Promise<Optional<string>> {
    if (!(await this.interactor.exists(this.parts.title.locator))) {
      return undefined;
    }
    return (await this.parts.title.getText()) ?? undefined;
  }

  /** Wait until the dialog is open. */
  async waitForOpen(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    return waitForDialogOpenState(this.interactor, this.locator, true, timeoutMs);
  }

  /** Wait until the dialog is closed. */
  async waitForClose(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    return waitForDialogOpenState(this.interactor, this.locator, false, timeoutMs);
  }

  /**
   * Dismiss the dialog by pressing `Escape`, then wait for it to close.
   *
   * Astryx handles `Escape` on the `<dialog>`'s `keydown` (calling `onOpenChange`)
   * unless `purpose="required"`. Whether it actually closes depends on the
   * consumer's `onOpenChange`; the returned boolean reflects the observed close.
   */
  async closeByEscape(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    await this.pressKey('Escape');
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'AstryxDialogDriver';
  }
}
