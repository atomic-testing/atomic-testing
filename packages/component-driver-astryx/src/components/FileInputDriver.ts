import { HTMLFileInputDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, Optional } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

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
 * It extends {@link HTMLFileInputDriver} to inherit `uploadFiles` (the
 * `setInputFiles` primitive — `userEvent.upload` in jsdom, `locator.setInputFiles`
 * in Playwright), and resolves its label through the shared `<label for>`↔`id`
 * helper. The *rendered selected-file list* is consumer-`value`-controlled, and the
 * OS file picker and drag-and-drop are native — so file-chip readback and dropzone
 * DnD are **E2E-only** and not surfaced here.
 */
export class FileInputDriver extends HTMLFileInputDriver {
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
   * The field's visible label, resolved through the native `<label for>`↔`id`
   * link rather than a StyleX-hashed wrapper class. The id is matched through the
   * escaping `byLinkedElement` builder (shared with the field-input drivers), so a
   * consumer-supplied id with a CSS metacharacter cannot break the selector.
   */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  /**
   * The validation message text, resolved through the input's `aria-describedby`
   * → status element id link. `undefined` when the field carries no status.
   *
   * `aria-describedby` is an IDREF *list*: Astryx points the input at both its
   * description and its status when both are present (`FileInput` joins
   * `descriptionID` + `statusMessageID`). The status is the `FieldStatus` element
   * carrying a `data-type` severity marker (the description is a plain element
   * without it), so each id is resolved and the one with `data-type` is returned —
   * matching the whole multi-id attribute as a single id would find nothing. This
   * mirrors {@link AstryxFieldInputDriver.getStatusMessage}.
   */
  async getStatusMessage(): Promise<Optional<string>> {
    const describedBy = await this.interactor.getAttribute(this.locator, 'aria-describedby');
    if (!describedBy) {
      return undefined;
    }
    for (const id of describedBy.split(/\s+/).filter(Boolean)) {
      const statusLocator = byCssSelector(`[id="${id}"][data-type]`, 'Root');
      if (await this.interactor.exists(statusLocator)) {
        return (await this.interactor.getText(statusLocator)) ?? undefined;
      }
    }
    return undefined;
  }

  override get driverName(): string {
    return 'AstryxFileInputDriver';
  }
}
