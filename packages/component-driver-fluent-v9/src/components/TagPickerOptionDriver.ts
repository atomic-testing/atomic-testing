import { ComponentDriver, Optional } from '@atomic-testing/core';

/**
 * Driver for a single Fluent v9 `TagPickerOption` (`role="option"`, class
 * `fui-TagPickerOption`) OR a single currently-selected tag as rendered inside
 * `TagPickerGroup` — DOM audit (@fluentui/react-components@9.74.3): forcing
 * `role="listbox"` on `TagPickerGroup` cascades into `Tag`'s own
 * `useTagBase_unstable`, which renders `role="option"` for any `Tag` inside a
 * `role="listbox"` group. The two therefore share an identical read shape
 * (trimmed text label, optional `aria-disabled`), which is why
 * `TagPickerDriver` reuses this one class for both {@link
 * TagPickerDriver.getOptionLabels}/{@link TagPickerDriver.selectByLabel}
 * (reading/clicking OPEN-list options) and {@link
 * TagPickerDriver.getSelectedLabels}/{@link TagPickerDriver.removeSelected}
 * (reading/clicking selected tags) — see that class's doc for why `click()`
 * means "select" in the first case and "dismiss" in the second, a distinction
 * this driver itself has no need to encode.
 *
 * Deliberately standalone rather than extending `ComboboxOptionDriver`
 * (Wave 3's `Combobox` sibling) or `DropdownOptionDriver`: the shared shape
 * with THOSE is coincidental too (all three sit on `@fluentui/react-combobox`'s
 * `useOption_unstable` under the hood), not a real inheritance relationship —
 * same reasoning `ComboboxOptionDriver`'s class doc gives for not extending
 * `MenuItemDriver`.
 *
 * **No portable `isSelected`**: `useTagPickerOption_unstable` overrides the
 * shared `Option` primitive's computed `aria-selected`/`aria-checked` with a
 * literal `props['aria-checked']` (DOM audit of the compiled hook) — i.e. it
 * reflects only what the CONSUMER explicitly passes as an `aria-checked` prop,
 * never Fluent's own selection bookkeeping; a selected `Tag` likewise only
 * gets `aria-selected` when the consumer explicitly passes it a `selected`
 * prop. The idiomatic `TagPicker` usage (this package's own example,
 * mirroring Fluent's own docs) filters selected values OUT of the rendered
 * option list entirely and never passes `selected` to the group's `Tag`s, so
 * neither role ever carries a reliable selected/checked DOM signal in
 * practice — this driver offers no `isSelected` method for either use.
 *
 * **`isDisabled` checks both the native property AND `aria-disabled`**: the
 * two DOM shapes disagree on which one they set — DOM audit shows a disabled
 * `TagPickerOption` (a plain `<div role="option">`, no native `disabled`
 * concept) sets `aria-disabled="true"`, while a disabled selected `Tag`
 * (a real `<button disabled>`, forced by `TagPickerGroup`'s `dismissible`
 * context) sets the native `disabled` attribute and NO `aria-disabled` at
 * all. Checking only one signal would silently misreport the other shape, so
 * this method honors whichever is present — the same "native property, ARIA
 * fallback" idiom `DOMInteractor.isReadonly`/`isRequired` already use.
 */
export class TagPickerOptionDriver extends ComponentDriver<{}> {
  /** The option's visible, trimmed text, or `undefined` when empty. */
  async getLabel(): Promise<Optional<string>> {
    return (await this.getText())?.trim() || undefined;
  }

  /** Whether the option/tag is disabled (see class doc for the two DOM shapes this covers). */
  async isDisabled(): Promise<boolean> {
    if (await this.interactor.isDisabled(this.locator)) {
      return true;
    }
    return (await this.interactor.getAttribute(this.locator, 'aria-disabled')) === 'true';
  }

  get driverName(): string {
    return 'FluentV9TagPickerOptionDriver';
  }
}
