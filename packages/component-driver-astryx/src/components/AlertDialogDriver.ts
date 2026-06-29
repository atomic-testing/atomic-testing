import { byCssSelector, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

import { isDialogOpen, OVERLAY_TRANSITION_MS, waitForDialogOpenState } from '../internal/overlayLifecycle';

// AlertDialog renders exactly two buttons, in the WAI-ARIA order [cancel, action]
// as siblings, and nothing else in the dialog is a <button>. They are matched by
// that position rather than by `data-variant` — the action's variant is a
// configurable styling prop (default 'destructive', but a consumer may set it to
// 'ghost', which would collide with the cancel button), whereas the order is fixed.
const cancelButton = byCssSelector('button:first-of-type');
const actionButton = byCssSelector('button:last-of-type');

/**
 * Driver for the Astryx AlertDialog (`@astryxdesign/core/AlertDialog`).
 *
 * AlertDialog is a controlled, native `<dialog role="alertdialog">` that builds
 * its own title/description/buttons; it forwards `data-testid` onto that element.
 * The title and description are linked by `aria-labelledby`/`aria-describedby` to
 * elements carrying generated ids, so the driver resolves those links at runtime
 * (mirroring `AstryxFieldInputDriver`) rather than guessing a structural selector.
 * Open state is the `<dialog>`'s `open` attribute (set by `showModal()`).
 */
export class AlertDialogDriver extends ComponentDriver {
  /** Whether the dialog is open — Astryx sets the `<dialog>`'s `open` attribute via `showModal()`. */
  async isOpen(): Promise<boolean> {
    return isDialogOpen(this.interactor, this.locator);
  }

  /** The dialog's ARIA role — always `'alertdialog'` for AlertDialog. */
  async getRole(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'role');
  }

  /** The title, resolved via the `aria-labelledby` link. */
  async getTitle(): Promise<Optional<string>> {
    return this.resolveLinkedText('aria-labelledby');
  }

  /** The description, resolved via the `aria-describedby` link. */
  async getDescription(): Promise<Optional<string>> {
    return this.resolveLinkedText('aria-describedby');
  }

  /** The action (confirm) button's label. */
  async getActionLabel(): Promise<Optional<string>> {
    return (await this.interactor.getText(locatorUtil.append(this.locator, actionButton))) ?? undefined;
  }

  /** The cancel button's label. */
  async getCancelLabel(): Promise<Optional<string>> {
    return (await this.interactor.getText(locatorUtil.append(this.locator, cancelButton))) ?? undefined;
  }

  /** Click the action (confirm) button. Astryx does not auto-close on action. */
  async clickAction(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, actionButton));
  }

  /** Click the cancel button (fires `onOpenChange(false)`). */
  async clickCancel(): Promise<void> {
    await this.interactor.click(locatorUtil.append(this.locator, cancelButton));
  }

  /** Wait until the dialog is closed. */
  async waitForClose(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    return waitForDialogOpenState(this.interactor, this.locator, false, timeoutMs);
  }

  /**
   * Dismiss by pressing `Escape` (AlertDialog uses `purpose="form"`, which allows
   * Escape), then wait for it to close.
   */
  async closeByEscape(timeoutMs: number = OVERLAY_TRANSITION_MS): Promise<boolean> {
    await this.pressKey('Escape');
    return this.waitForClose(timeoutMs);
  }

  /**
   * Resolve a labelling link (`aria-labelledby`/`aria-describedby`) to the text of
   * the referenced element. The attribute may list several ids; the first that
   * resolves to an existing element wins. Ids come from React's `useId`, so an
   * exact `[id="..."]` match from the document root is safe.
   */
  private async resolveLinkedText(attr: string): Promise<Optional<string>> {
    const ids = await this.interactor.getAttribute(this.locator, attr);
    if (!ids) {
      return undefined;
    }
    for (const id of ids.split(/\s+/).filter(Boolean)) {
      const target = byCssSelector(`[id="${id}"]`, 'Root');
      if (await this.interactor.exists(target)) {
        return (await this.interactor.getText(target)) ?? undefined;
      }
    }
    return undefined;
  }

  get driverName(): string {
    return 'AstryxAlertDialogDriver';
  }
}
