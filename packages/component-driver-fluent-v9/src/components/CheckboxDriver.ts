import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, IRequirableDriver, locatorUtil, Optional } from '@atomic-testing/core';

import { resolveLinkedLabelText } from '../internal/linkedLocators';

/**
 * Driver for the Fluent v9 `Checkbox` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the `data-testid`/locator you
 * put on `<Checkbox>` forwards straight to a REAL native
 * `<input class="fui-Checkbox__input" type="checkbox">` — the component root
 * IS the input, so `HTMLCheckboxDriver`'s native `checked`/`disabled` surface
 * applies unchanged; this driver adds only what's Fluent-specific: `required`
 * (a real native attribute `HTMLCheckboxDriver` doesn't expose), tri-state
 * (`indeterminate`), and the label link. The `label` prop renders a real
 * `<label for>` as a SIBLING of the input inside the same `fui-Checkbox`
 * wrapper span, not an ancestor or descendant of the input itself, so
 * {@link getLabel} resolves it via the `for`↔`id` accessibility link rather
 * than DOM nesting (mirrors `component-driver-radix-v1`'s `CheckboxDriver`,
 * adapted for a real native input instead of a fake button-based one).
 *
 * Fluent sets `indeterminate` as a live DOM property with no HTML attribute
 * reflection and no ARIA mirror (unlike MUI, which stamps its own
 * `data-indeterminate` attribute) — but that live property is exactly what
 * the `:indeterminate` CSS pseudo-class matches (supported by jsdom's nwsapi
 * and every Playwright engine), so {@link isIndeterminate} reads it through
 * the existing locator/interactor surface with no new primitive, the same
 * approach `component-driver-astryx`'s `CheckboxInputDriver` already uses.
 *
 * Extending `HTMLCheckboxDriver` also inherits its `isReadonly()`. Fluent's
 * `Checkbox` has no documented `readOnly` prop and the native `readonly`
 * attribute has no defined effect on `type="checkbox"` per the HTML spec, so
 * that method only reflects an `aria-readonly` a caller sets directly — it is
 * not a real Fluent Checkbox capability, just an inherited one.
 */
export class CheckboxDriver extends HTMLCheckboxDriver implements IRequirableDriver {
  /** Whether the checkbox is marked required (native `required` attribute). */
  isRequired(): Promise<boolean> {
    return this.interactor.isRequired(this.locator);
  }

  /** Whether the checkbox is in the tri-state `indeterminate` state (matches `:indeterminate`). */
  isIndeterminate(): Promise<boolean> {
    return this.interactor.exists(locatorUtil.append(this.locator, byCssSelector(':indeterminate', 'Same')));
  }

  /**
   * The text of the `<label for>` linked to this checkbox via its `id`, or
   * `undefined` when the checkbox has no id / no matching label.
   */
  async getLabel(): Promise<Optional<string>> {
    return resolveLinkedLabelText(this.interactor, this.locator);
  }

  override get driverName(): string {
    return 'FluentV9CheckboxDriver';
  }
}
