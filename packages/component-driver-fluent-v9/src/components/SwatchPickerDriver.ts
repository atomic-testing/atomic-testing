import { childListHelper, ComponentDriver, Optional } from '@atomic-testing/core';

import { SwatchNotFoundError } from '../errors/SwatchNotFoundError';
import { SwatchPickerItemDriver } from './SwatchPickerItemDriver';

// Fluent's own un-hashed structural class (`colorSwatchClassNames.root` in
// `@fluentui/react-swatch-picker`), not `role`: a child's role is `radio` in
// the default `layout="row"` picker but `gridcell` in `layout="grid"` (see
// SwatchPickerItemDriver's class doc) — no single role selector spans both,
// but this class does, verified against rendered DOM in both modes.
const swatchSelector = '.fui-ColorSwatch';

/**
 * Driver for the Fluent v9 `SwatchPicker` (+ `ColorSwatch` children).
 *
 * DOM audit (@fluentui/react-components@9.74.3): the locator placed on
 * `<SwatchPicker>` forwards straight to the rendered `<div class="fui-SwatchPicker">`
 * — it does not portal, so two side-by-side instances disambiguate correctly
 * through their own scene locators alone, unlike the Wave 2 overlay drivers'
 * re-root recipe.
 *
 * Item iteration goes through `childListHelper` (see `MenuDriver`) rather than
 * `:nth-of-type`, so a non-`ColorSwatch` sibling (an `EmptySwatch`/`ImageSwatch`)
 * cannot shift the positional count or index addressing.
 *
 * `SwatchPicker`'s own `selectedValue`/`defaultSelectedValue` props have no DOM
 * trace either (the same gap as each swatch's `value` — see
 * {@link SwatchPickerItemDriver}), so {@link getSelectedColor} is derived by
 * scanning the children for the one whose {@link SwatchPickerItemDriver.isSelected}
 * is true, rather than read directly off this driver's own root.
 */
export class SwatchPickerDriver extends ComponentDriver<{}> {
  /** The number of swatches in the picker. */
  async getSwatchCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, swatchSelector);
  }

  /** The swatch driver at the given zero-based index, or `null` if out of range. */
  async getSwatchByIndex(index: number): Promise<SwatchPickerItemDriver | null> {
    let position = 0;
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      swatchSelector,
      SwatchPickerItemDriver
    )) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }

  /** The rendered color of every swatch, in DOM order (see {@link SwatchPickerItemDriver.getColor}). */
  async getSwatchColors(): Promise<ReadonlyArray<Optional<string>>> {
    const colors: Optional<string>[] = [];
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      swatchSelector,
      SwatchPickerItemDriver
    )) {
      colors.push(await item.getColor());
    }
    return colors;
  }

  /** The color of the currently selected swatch, or `undefined` when none is selected. */
  async getSelectedColor(): Promise<Optional<string>> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      swatchSelector,
      SwatchPickerItemDriver
    )) {
      if (await item.isSelected()) {
        return item.getColor();
      }
    }
    return undefined;
  }

  /** Select the swatch at the given zero-based index. @throws {SwatchNotFoundError} when out of range. */
  async selectByIndex(index: number): Promise<void> {
    const item = await this.getSwatchByIndex(index);
    if (item == null) {
      throw new SwatchNotFoundError(`index ${index}`, this);
    }
    await item.setSelected(true);
  }

  /** Select the swatch whose rendered color matches `color`. @throws {SwatchNotFoundError} when absent. */
  async selectByColor(color: string): Promise<void> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      swatchSelector,
      SwatchPickerItemDriver
    )) {
      if ((await item.getColor()) === color) {
        await item.setSelected(true);
        return;
      }
    }
    throw new SwatchNotFoundError(`color ${color}`, this);
  }

  get driverName(): string {
    return 'FluentV9SwatchPickerDriver';
  }
}
