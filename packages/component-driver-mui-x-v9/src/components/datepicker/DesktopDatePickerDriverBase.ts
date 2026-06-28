import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { DatePickerCharacteristic } from './types';

// Since MUI X v6 the desktop pickers no longer use a plain editable <input>. The visible field
// is a `PickersSectionList`: a `role="group"` of `contenteditable` `role="spinbutton"` section
// spans (`.MuiPickersSectionList-sectionContent`, one per Month/Day/Year). A single hidden,
// `aria-hidden` `<input class="MuiPickersInputBase-input">` mirrors the committed value as a
// locale-formatted string for form submission — which is the stable, portable read path.
//
// NOTE: This base is read-only. A portable `setValue` requires typing real keystrokes into a
// section span; the DOM interactor types via `userEvent.type` (real keys, works) but the
// Playwright interactor types via `locator.fill` (innerText replacement, which MUI ignores).
// Setting a value portably therefore needs a new keystroke primitive on `Interactor`,
// tracked as a follow-up.
const parts = {
  // The hidden input mirrors the committed value as a formatted string (e.g. "06/27/2026").
  valueInput: {
    locator: byCssClass('MuiPickersInputBase-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export abstract class DesktopDatePickerDriverBase extends ComponentDriver<typeof parts> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    protected characteristic: DatePickerCharacteristic,
    option?: Partial<IComponentDriverOption>
  ) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /**
   * The committed value parsed into a `Date`, or `null` when the field is empty.
   * Reads the hidden input that mirrors the field's locale-formatted value.
   */
  async getValue(): Promise<Date | null> {
    const text = await this.getValueText();
    if (text == null) {
      return null;
    }
    const format = await this.getFormat();
    return this.characteristic.textEntryToValue(text, format);
  }

  /**
   * The raw locale-formatted text shown by the field (e.g. "06/27/2026"), or `undefined`
   * when the field is empty.
   */
  async getValueText(): Promise<Optional<string>> {
    await this.enforcePartExistence('valueInput');
    const value = await this.interactor.getInputValue(this.parts.valueInput.locator);
    return value != null && value.length > 0 ? value : undefined;
  }

  /**
   * The v5 driver read the field's `placeholder` to discover the format, but the v9 section
   * field has no placeholder attribute. The format is carried implicitly by the section spans,
   * so fall back to the driver's declared default format.
   */
  async getFormat(defaultFormat: string = this.characteristic.defaultFormat): Promise<string> {
    return defaultFormat;
  }
}
