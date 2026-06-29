import { byCssSelector, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

// AlertDialog renders exactly two buttons: a ghost "cancel" and the action
// button (whose variant defaults to destructive but is configurable), so the
// action is matched as "the non-ghost button" rather than by a specific variant.
const cancelButton = byCssSelector('button[data-variant="ghost"]');
const actionButton = byCssSelector('button:not([data-variant="ghost"])');

const defaultTransitionDuration = 250;

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
    return this.interactor.hasAttribute(this.locator, 'open');
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
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const closed = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return closed === false;
  }

  /**
   * Dismiss by pressing `Escape` (AlertDialog uses `purpose="form"`, which allows
   * Escape), then wait for it to close.
   */
  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
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
