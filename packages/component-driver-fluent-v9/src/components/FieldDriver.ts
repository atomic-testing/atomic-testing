import { byCssSelector, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

import { readLabelText } from '../internal/labelText';
import { readOptionalDescendantText } from '../internal/optionalText';

const labelLocator = byCssSelector('label');
const hintLocator = byCssSelector('.fui-Field__hint');
const validationMessageLocator = byCssSelector('.fui-Field__validationMessage');

/**
 * Driver for the Fluent v9 `Field` component — the label/hint/validation
 * wrapper around a form control (Input, Checkbox, Select, ...).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a
 * `<div class="fui-Field">` containing, as true descendants, a `<label for>`
 * (linked to the wrapped control's auto-generated `id`), the wrapped control
 * itself, and — when present — a `<div class="fui-Field__validationMessage"
 * role="alert">` and a `<div class="fui-Field__hint">`. Field's own
 * `data-testid` lands on this wrapping div (not the control), so all three
 * reads are descendant lookups off it, anchored on Fluent's own structural
 * classes (the un-hashed `fui-Field__*` names, not the hashed Griffel utility
 * classes alongside them) rather than the generated `id`s, which change per
 * render.
 */
export class FieldDriver extends ComponentDriver<{}> {
  /**
   * The field's label text, or `undefined` when it renders none. Strips
   * Fluent's required-marker `*` when the field is required (see
   * {@link readLabelText}).
   */
  getLabel(): Promise<Optional<string>> {
    return readLabelText(this.interactor, locatorUtil.append(this.locator, labelLocator));
  }

  /** The field's hint text, or `undefined` when it renders none. */
  getHint(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, hintLocator);
  }

  /** The field's validation message, or `undefined` when it renders none. */
  getValidationMessage(): Promise<Optional<string>> {
    return readOptionalDescendantText(this.interactor, this.locator, validationMessageLocator);
  }

  get driverName(): string {
    return 'FluentV9FieldDriver';
  }
}
