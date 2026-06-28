import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { Optional, PartLocator } from '@atomic-testing/core';

import { linkedDescribedByLocator, linkedLabelLocator } from '../internal/linkedLocators';

/**
 * Shared base for Astryx single-control field inputs (TextInput, NumberInput,
 * TimeInput, TextArea).
 *
 * Astryx renders these as `<label for={id}>…</label> … <input id={id}>` (the
 * `<textarea>` for TextArea), where the visible label and the floating status
 * message are NOT descendants of the control — they are wired by the native
 * accessibility links `<label for>`↔`<input id>` and `<input aria-describedby>`↔
 * `<status id>`. The driver is therefore anchored on the control itself (so the
 * inherited `getValue`/`setValue`/`isDisabled` operate on the real `<input>`),
 * and the label/status are reached by resolving those a11y links — never by a
 * StyleX-hashed class or a brittle positional selector.
 *
 * @see https://github.com/facebook/astryx (package: `@astryxdesign/core`)
 */
export abstract class AstryxFieldInputDriver extends HTMLTextInputDriver {
  /**
   * The field's visible label, resolved via the `<label for>`↔`id` link.
   *
   * Returns the label element's full text. Astryx appends an optional/required
   * marker (" ∙ Optional"/" ∙ Required") inside the same `<label>`, so when the
   * field is marked optional/required this includes that suffix — read
   * {@link isRequired}/{@link isOptional} for the state itself. Returns
   * `undefined` when no associated label exists.
   */
  async getLabel(): Promise<Optional<string>> {
    const labelLocator = this.linkedLabelLocator();
    if (!(await this.interactor.exists(labelLocator))) {
      return undefined;
    }
    return (await this.interactor.getText(labelLocator)) ?? undefined;
  }

  /**
   * Whether the field is required — Astryx sets `aria-required="true"` on the
   * control (the visible " ∙ Required" marker is cosmetic).
   */
  async isRequired(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-required')) === 'true';
  }

  /**
   * Whether the field is in an invalid/error state — `aria-invalid="true"` on
   * the control, set when a `status` of type `error` is supplied.
   */
  async isInvalid(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-invalid')) === 'true';
  }

  /**
   * Whether the field is in a loading state — `aria-busy="true"` on the control.
   */
  async isBusy(): Promise<boolean> {
    return (await this.interactor.getAttribute(this.locator, 'aria-busy')) === 'true';
  }

  /**
   * The status/validation message text, resolved via the control's
   * `aria-describedby`↔`id` link to the floating status element.
   *
   * Returns `undefined` when the control describes no element (no `status` set).
   * Note: when both a `description` and a `status` are present Astryx points
   * `aria-describedby` at multiple ids; this resolves the single-id (status-only)
   * case, which is the common one for validation messages.
   */
  async getStatusMessage(): Promise<Optional<string>> {
    // Guard first: a linked locator throws if its source attribute is absent, so
    // a field with no `aria-describedby` (no status) must short-circuit here
    // rather than fail to resolve.
    const describedBy = await this.interactor.getAttribute(this.locator, 'aria-describedby');
    if (!describedBy) {
      return undefined;
    }
    const statusLocator = this.linkedDescribedByLocator();
    if (!(await this.interactor.exists(statusLocator))) {
      return undefined;
    }
    return (await this.interactor.getText(statusLocator)) ?? undefined;
  }

  /** Locate the `<label for={id}>` associated with this control. */
  protected linkedLabelLocator(): PartLocator {
    return linkedLabelLocator(this.locator);
  }

  /** Locate the element this control points at via `aria-describedby`. */
  protected linkedDescribedByLocator(): PartLocator {
    return linkedDescribedByLocator(this.locator);
  }
}
