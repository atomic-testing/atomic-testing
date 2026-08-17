import { HTMLFileInputDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, Optional, PartLocator } from '@atomic-testing/core';

import { resolveDescribedByRoleText, resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Astryx FileInput (`@astryxdesign/core/FileInput`).
 *
 * Astryx forwards `data-testid` onto the **hidden native `<input type="file">`**,
 * not the visible `div[role="button"]` dropzone — which is convenient, because
 * `accept`, `multiple`, and `disabled` (native HTML semantics the real file picker
 * needs) plus `setInputFiles`'s target are all the input's. The scene therefore
 * anchors this driver on that input.
 *
 * The operable control is a **sibling** of that input, not an ancestor of it, and
 * it is where `aria-describedby`/`aria-invalid` live. Astryx 0.2.0 reshaped it: the
 * old `div[role="button"]` wrapper nested the clear and status buttons inside
 * itself, which is a nested-interactive violation (WCAG 4.1.2), so the trigger is
 * now a real, visually hidden `<button>` sitting alongside them in a
 * non-interactive container. Since this codebase's CSS locators have no parent
 * axis, {@link triggerLocator} resolves that button from the document via `:has()`
 * keyed on the input's own `id` (which Astryx always sets via `useId()`) rather
 * than walking up from `this.locator`.
 *
 * **The required state is no longer readable.** `aria-required` is unsupported on
 * `role="button"`, so Astryx 0.2.0 replaced it with a visually hidden, *translated*
 * sentence pointed at by `aria-describedby` — indistinguishable in the DOM from the
 * field's description except by matching its English text. There is therefore no
 * `isRequired()`; assert the requirement through the form's own submit behaviour,
 * or through {@link getLabel}, which includes Astryx's required marker.
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

  /** Whether the field is in an error state (`aria-invalid="true"` on the trigger button). */
  async isInvalid(): Promise<boolean> {
    const trigger = await this.triggerLocator();
    return trigger != null && (await this.interactor.getAttribute(trigger, 'aria-invalid')) === 'true';
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
   * The validation message text, resolved through the trigger button's
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
    const trigger = await this.triggerLocator();
    if (trigger == null) {
      return undefined;
    }
    const describedBy = await this.interactor.getAttribute(trigger, 'aria-describedby');
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
   * The `disabledMessage` tooltip text, resolved via the trigger button's
   * `aria-describedby` link — like `aria-invalid` (see the class doc), the
   * disabled-message tooltip describes the operable trigger, not the hidden native
   * input. `undefined` when the field isn't in that disabled-with-message state.
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    const trigger = await this.triggerLocator();
    if (trigger == null) {
      return undefined;
    }
    return resolveDescribedByRoleText(this.interactor, trigger, 'aria-describedby', 'tooltip');
  }

  /**
   * The visually hidden trigger `<button>` beside the input, resolved from the
   * document by the input's own `id` — the closest thing to a sibling-before
   * lookup this locator system supports, since CSS has no preceding-sibling
   * combinator. Astryx renders the trigger first inside the control container, so
   * `:first-child` picks it out from the clear/status buttons that follow.
   * `undefined` when the input carries no `id` (shouldn't happen; Astryx always
   * sets one via `useId()`).
   */
  private async triggerLocator(): Promise<Optional<PartLocator>> {
    const inputId = await this.interactor.getAttribute(this.locator, 'id');
    if (!inputId) {
      return undefined;
    }
    return byCssSelector(`div:has(> input[id="${inputId}"]) > :first-child > button`, 'Root');
  }

  override get driverName(): string {
    return 'AstryxFileInputDriver';
  }
}
