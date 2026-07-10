import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { DatePickerCharacteristic } from './types';

// Since MUI X v6 the pickers no longer use a plain editable <input>. The visible field is a
// `PickersSectionList`: a `role="group"` of `contenteditable` `role="spinbutton"` section spans
// (`.MuiPickersSectionList-sectionContent`, one per date/time part) plus a single hidden,
// `aria-hidden` `<input class="MuiPickersInputBase-input">` that mirrors the committed value as a
// locale-formatted string for form submission — the stable, portable READ path.
//
// The WRITE path types real keystrokes into the section field via `Interactor.typeText`: typing a
// section's full digit width overwrites its previous value and auto-advances to the next section,
// so a full value is one concatenated digit stream (see `dateUtil`). Clearing selects all sections
// (Ctrl+A puts the field into its "all sections selected" state, moving focus to the sections
// container) and presses Backspace — both delivered with editing fidelity by `Interactor.pressKey`.
const parts = {
  // The hidden input mirrors the committed value as a formatted string (e.g. "06/27/2026").
  valueInput: {
    locator: byCssClass('MuiPickersInputBase-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

// The keyboard entry point: the first section's content span. Pinned to `data-sectionindex="0"`
// so the locator stays unique — every other section would match the content-span class too.
const firstSectionLocator = byCssSelector('[data-sectionindex="0"] .MuiPickersSectionList-sectionContent');

// The sections container owns focus while the field is in its "all sections selected" state
// (after Ctrl+A), when the individual section spans are temporarily not rendered.
const sectionsContainerLocator = byCssClass('MuiPickersInputBase-sectionsContainer');

/**
 * The open-picker adornment button. It carries a stable, locale-independent marker attribute
 * (its `aria-label` interpolates the selected date, so it is not a reliable handle). Both the
 * desktop pickers (popper popup) and the mobile pickers (modal dialog) render it.
 */
export const openPickerButtonLocator = byCssSelector('[data-mui-picker-open-button="true"]');

/**
 * Base driver for every MUI X v9 picker built on the section field (`PickersSectionList`):
 * desktop/mobile date pickers, datetime picker, time picker, and the single-input date range
 * field. Reads go through the hidden mirror input; writes type real keystrokes into the section
 * spans. The value type is generic so the range picker can share the exact same field mechanics
 * with a `DateRange` value.
 */
export abstract class PickerFieldDriverBase<TValue = Date>
  extends ComponentDriver<typeof parts>
  implements IInputDriver<TValue | null>
{
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    protected characteristic: DatePickerCharacteristic<TValue>,
    option?: Partial<IComponentDriverOption>
  ) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  /**
   * The committed value parsed from the hidden mirror input, or `null` when the field is empty.
   */
  async getValue(): Promise<TValue | null> {
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

  /**
   * Set the field's committed value by typing real keystrokes into the section field, or clear
   * it when `value` is `null`. Typing a section's full digit width overwrites whatever it held,
   * so no clearing happens before typing a non-null value.
   *
   * @param value The value to type, or `null` to clear the field.
   */
  async setValue(value: TValue | null): Promise<boolean> {
    if (value == null) {
      await this.clearField();
      return true;
    }
    const format = await this.getFormat();
    await this.typeIntoField(this.characteristic.valueToTextEntry(value, format));
    return true;
  }

  /**
   * Click the first section and type the given keystroke stream; MUI advances the focused
   * section automatically as each section's digits commit.
   */
  protected async typeIntoField(text: string): Promise<void> {
    const firstSection = locatorUtil.append(this.locator, firstSectionLocator);
    await this.interactor.click(firstSection);
    await this.interactor.typeText(firstSection, text);
  }

  /**
   * Clear every section: select all sections (Ctrl+A) and press Backspace. Focus moves to the
   * sections container in the select-all state, so the deletion targets the container. Ends by
   * blurring the field, which leaves the select-all editing state and re-renders the placeholder
   * sections so a subsequent {@link setValue} can target the first section again.
   */
  protected async clearField(): Promise<void> {
    const firstSection = locatorUtil.append(this.locator, firstSectionLocator);
    const sectionsContainer = locatorUtil.append(this.locator, sectionsContainerLocator);
    await this.interactor.click(firstSection);
    await this.interactor.pressKey(firstSection, 'a', { ctrl: true });
    await this.interactor.pressKey(sectionsContainer, 'Backspace');
    await this.interactor.blur(sectionsContainer);
  }
}
