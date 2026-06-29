import { byCssSelector, ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for the Astryx FileInput (`@astryxdesign/core/FileInput`).
 *
 * Astryx forwards `data-testid` onto the **hidden native `<input type="file">`**,
 * not the visible `div[role="button"]` dropzone — which is convenient, because the
 * input is the element every meaningful read and the upload itself live on:
 * `accept`, `multiple`, `aria-required`, `aria-invalid`, `disabled`, and the
 * `aria-describedby` → status-message link are all attributes of the input, and
 * `setInputFiles` must target a real `<input type="file">`. The scene therefore
 * anchors this driver on that input.
 *
 * v1 scope: read-side state + the {@link uploadFiles} interaction (backed by the
 * `setInputFiles` interactor primitive — `userEvent.upload` in jsdom,
 * `locator.setInputFiles` in Playwright). The *rendered selected-file list* is
 * consumer-`value`-controlled (Astryx FileInput is controlled), and the OS file
 * picker and drag-and-drop are native — so file-chip readback and dropzone DnD are
 * **E2E-only** and not surfaced here.
 */
export class FileInputDriver extends ComponentDriver<{}> {
  /**
   * Upload one or more files. Targets the hidden `<input type="file">` via the
   * `setInputFiles` primitive; the consumer's `onChange` then drives any visible
   * file chips (which are E2E-only to observe).
   */
  async uploadFiles(files: string | string[]): Promise<void> {
    return this.interactor.setInputFiles(this.locator, files);
  }

  /** The accepted MIME/extension filter (`accept`), or `undefined` when unrestricted. */
  async getAccept(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'accept');
  }

  /** Whether multiple files may be selected (`multiple`). */
  async isMultiple(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'multiple');
  }

  /** Whether the field is required (`aria-required="true"`). */
  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  /** Whether the field is in an error state (`aria-invalid="true"`, mirrored by the button's `data-status="error"`). */
  async isInvalid(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-invalid')) === 'true';
  }

  /** Whether the field is disabled (native `disabled` on the input). */
  async isDisabled(): Promise<boolean> {
    return this.interactor.hasAttribute(this.locator, 'disabled');
  }

  /**
   * The field's visible label, resolved through the native `for`/`id` link
   * (`<label for="{inputId}">`) rather than a StyleX-hashed wrapper class.
   */
  async getLabel(): Promise<Optional<string>> {
    const id = await this.interactor.getAttribute(this.locator, 'id');
    if (!id) {
      return undefined;
    }
    return (await this.interactor.getText(byCssSelector(`label[for="${id}"]`, 'Root'))) ?? undefined;
  }

  /**
   * The validation message text, resolved through the input's `aria-describedby`
   * → status element (`[role="alert"]`/`[role="status"]`) id link. `undefined`
   * when the field carries no status.
   */
  async getStatusMessage(): Promise<Optional<string>> {
    const describedBy = await this.interactor.getAttribute(this.locator, 'aria-describedby');
    if (!describedBy) {
      return undefined;
    }
    return (await this.interactor.getText(byCssSelector(`[id="${describedBy}"]`, 'Root'))) ?? undefined;
  }

  get driverName(): string {
    return 'AstryxFileInputDriver';
  }
}
