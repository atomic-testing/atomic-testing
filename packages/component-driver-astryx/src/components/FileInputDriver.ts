import { HTMLFileInputDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, Optional, PartLocator } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx FileInput (`@astryxdesign/core/FileInput`).
 *
 * Astryx forwards `data-testid` onto the **hidden native `<input type="file">`**,
 * not the visible `div[role="button"]` dropzone — which is convenient, because
 * `accept`, `multiple`, and `disabled` (native HTML semantics the real file picker
 * needs) plus `setInputFiles`'s target are all the input's. The scene therefore
 * anchors this driver on that input.
 *
 * Astryx 0.1.3 moved `aria-describedby`/`aria-required`/`aria-invalid` off the
 * hidden, never-focused input onto the focusable `div[role="button"]` wrapper
 * that describes the operable control (forms-6). Since this codebase's CSS
 * locators have no parent axis, those three reads resolve the wrapper via `:has()`
 * keyed on the input's own `id` (which Astryx always sets via `useId()`) rather
 * than walking up from `this.locator`.
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

  /** Whether the field is required (`aria-required="true"` on the `role="button"` wrapper). */
  async isRequired(): Promise<boolean> {
    const wrapper = await this.wrapperLocator();
    return wrapper != null && (await this.interactor.getAttribute(wrapper, 'aria-required')) === 'true';
  }

  /** Whether the field is in an error state (`aria-invalid="true"` on the `role="button"` wrapper). */
  async isInvalid(): Promise<boolean> {
    const wrapper = await this.wrapperLocator();
    return wrapper != null && (await this.interactor.getAttribute(wrapper, 'aria-invalid')) === 'true';
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
   * The validation message text, resolved through the `role="button"` wrapper's
   * `aria-describedby` → status element id link. `undefined` when the field
   * carries no status.
   *
   * `aria-describedby` is an IDREF *list*: Astryx points the wrapper at both its
   * description and its status when both are present (`FileInput` joins
   * `descriptionID` + `statusMessageID`). The status is the `FieldStatus` element
   * carrying a `data-type` severity marker (the description is a plain element
   * without it), so each id is resolved and the one with `data-type` is returned —
   * matching the whole multi-id attribute as a single id would find nothing. This
   * mirrors {@link AstryxFieldInputDriver.getStatusMessage}.
   */
  async getStatusMessage(): Promise<Optional<string>> {
    const wrapper = await this.wrapperLocator();
    if (wrapper == null) {
      return undefined;
    }
    const describedBy = await this.interactor.getAttribute(wrapper, 'aria-describedby');
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

  /**
   * The focusable `div[role="button"]` wrapper around the hidden input, resolved
   * from the document by the input's own `id` — the closest thing to a parent
   * lookup this locator system supports. `null` when the input carries no `id`
   * (shouldn't happen; Astryx always sets one via `useId()`).
   */
  private async wrapperLocator(): Promise<PartLocator | null> {
    const inputId = await this.interactor.getAttribute(this.locator, 'id');
    if (!inputId) {
      return null;
    }
    return byCssSelector(`div[role="button"]:has(> input[id="${inputId}"])`, 'Root');
  }

  override get driverName(): string {
    return 'AstryxFileInputDriver';
  }
}
