import { byCssSelector, byTagName, ComponentDriver, locatorUtil, Optional } from '@atomic-testing/core';

// Astryx appends the optional/required state as a visible, bullet-prefixed suffix
// inside the `<label>` (e.g. "Phone ∙ Required"). Match the bullet marker, not the
// bare word, so a label whose own text contains "Required"/"Optional" isn't
// misread as the state — and the two markers stay mutually exclusive.
const REQUIRED_MARKER = '∙ Required';
const OPTIONAL_MARKER = '∙ Optional';

/**
 * Driver for the Astryx Field (`@astryxdesign/core/Field`) — the label/description/
 * status wrapper other inputs compose.
 *
 * Field forwards `data-testid` onto its root `<div>` (anchored by the scene) and
 * lays out a `<label for>`, an optional description `<span id>`, the control, and
 * an optional status message. Astryx renders the optional/required state only as
 * a visible text marker appended inside the `<label>` (no data attribute), so
 * `getLabel` returns the label including that marker and `isRequired`/`isOptional`
 * read it back — the sole DOM signal Astryx exposes.
 */
export class FieldDriver extends ComponentDriver<{}> {
  /** The field's label text (includes the " ∙ Optional"/" ∙ Required" marker when present). */
  async getLabel(): Promise<Optional<string>> {
    const label = locatorUtil.append(this.locator, byTagName('label'));
    if (!(await this.interactor.exists(label))) {
      return undefined;
    }
    return (await this.interactor.getText(label)) ?? undefined;
  }

  /** The field's description text (the `<span id>` between label and control), if any. */
  async getDescription(): Promise<Optional<string>> {
    const description = locatorUtil.append(this.locator, byCssSelector('span[id]'));
    if (!(await this.interactor.exists(description))) {
      return undefined;
    }
    return (await this.interactor.getText(description)) ?? undefined;
  }

  /** The field's status/validation message (the element carrying `data-type`), if any. */
  async getStatusMessage(): Promise<Optional<string>> {
    const status = locatorUtil.append(this.locator, byCssSelector('[data-type]'));
    if (!(await this.interactor.exists(status))) {
      return undefined;
    }
    return (await this.interactor.getText(status)) ?? undefined;
  }

  /** Whether the field is marked required (Astryx appends a " ∙ Required" label marker). */
  async isRequired(): Promise<boolean> {
    return (await this.getLabel())?.includes(REQUIRED_MARKER) ?? false;
  }

  /** Whether the field is marked optional (Astryx appends a " ∙ Optional" label marker). */
  async isOptional(): Promise<boolean> {
    return (await this.getLabel())?.includes(OPTIONAL_MARKER) ?? false;
  }

  get driverName(): string {
    return 'AstryxFieldDriver';
  }
}
