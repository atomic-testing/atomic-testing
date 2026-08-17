import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, Optional } from '@atomic-testing/core';

import { resolveDescribedByRoleText, resolveLinkedLabelText } from '../internal/linkedLocators';

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
    return resolveLinkedLabelText(this.interactor, this.locator);
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
   * Whether the field is read-only — Astryx 0.4.0's `isReadOnly`: the value stays
   * at full opacity, still submits with the form, and cannot be edited.
   *
   * The native `readonly` attribute alone is **not** the signal. Astryx also
   * swaps `disabled` for `aria-disabled` + `readOnly` when a field is disabled
   * *with a `disabledMessage`*, so that the reason stays focus-discoverable — a
   * field in that state is disabled, not read-only, and the two are distinguished
   * by the accompanying `aria-disabled`. `isDisabled` takes precedence over
   * `isReadOnly` upstream, so this reports the read-only state only when the field
   * is not disabled at all.
   */
  async isReadOnly(): Promise<boolean> {
    if (!(await this.interactor.hasAttribute(this.locator, 'readonly'))) {
      return false;
    }
    return !(await this.isDisabled());
  }

  /**
   * Whether the field is disabled, by either mechanism Astryx uses: the native
   * `disabled` attribute, or — when a `disabledMessage` must stay reachable —
   * `aria-disabled="true"` on a still-focusable control.
   */
  override async isDisabled(): Promise<boolean> {
    if (await super.isDisabled()) {
      return true;
    }
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  /**
   * The status/validation message text, resolved via the control's
   * `aria-describedby` link to the floating status element.
   *
   * `aria-describedby` may list several ids: Astryx points the control at both
   * its description and its status when both are present. The status message is
   * the described element carrying the `data-type` severity marker (the
   * description is a plain `<span id>` without it), so each id is resolved and the
   * one with `data-type` is returned — matching the whole multi-id attribute as a
   * single id would find nothing. Returns `undefined` when no status is set.
   *
   * `statusVariant="tooltip"` (Astryx 0.2.0) is the exception the `data-type`
   * probe alone misses: that variant hides the message box and surfaces the
   * message from a focusable info-tip instead, whose layer is a plain
   * `role="tooltip"` carrying no severity marker. So a `role="tooltip"` target is
   * the fallback — but only on a field that is not disabled, because a
   * `disabledMessage` renders through the same `useTooltip` primitive and would
   * otherwise be reported as the status (see {@link getDisabledMessage}). A field
   * that is *both* disabled-with-message and carrying a tooltip status cannot be
   * told apart from the DOM; the disabled reason wins there.
   */
  async getStatusMessage(): Promise<Optional<string>> {
    const describedBy = await this.interactor.getAttribute(this.locator, 'aria-describedby');
    if (!describedBy) {
      return undefined;
    }
    for (const id of describedBy.split(/\s+/).filter(Boolean)) {
      // ids come from React's `useId`, so a quoted attribute match is exact and
      // searches from the root (the status is not a descendant of the control).
      const statusLocator = byCssSelector(`[id="${id}"][data-type]`, 'Root');
      if (await this.interactor.exists(statusLocator)) {
        return (await this.interactor.getText(statusLocator)) ?? undefined;
      }
    }
    if (await this.isDisabled()) {
      return undefined;
    }
    return resolveDescribedByRoleText(this.interactor, this.locator, 'aria-describedby', 'tooltip');
  }

  /**
   * The `disabledMessage` tooltip text, resolved via the control's
   * `aria-describedby` link to the `role="tooltip"` layer that
   * `isDisabled` + `disabledMessage` renders (the same `useTooltip` primitive as
   * the standalone Tooltip). `undefined` when the field isn't in that
   * disabled-with-message state.
   */
  async getDisabledMessage(): Promise<Optional<string>> {
    return resolveDescribedByRoleText(this.interactor, this.locator, 'aria-describedby', 'tooltip');
  }
}
