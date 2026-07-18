import {
  byCssClass,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { ColorAreaDriver } from './ColorAreaDriver';
import { ColorSliderDriver } from './ColorSliderDriver';

export const colorPickerParts = {
  area: { locator: byCssClass('fui-ColorArea'), driver: ColorAreaDriver },
  hueSlider: { locator: byCssClass('fui-ColorSlider__input'), driver: ColorSliderDriver },
} satisfies ScenePart;

/**
 * Driver for the Fluent v9 `ColorPicker` component — a composite of a
 * `ColorArea` (saturation/value) plus a `ColorSlider` (hue), wired together
 * through a shared React context rather than any prop the composite passes
 * explicitly.
 *
 * DOM audit (@fluentui/react-components@9.74.3): unlike some Fluent
 * composites that render no DOM of their own (e.g. `Field`'s wrapper is real
 * but a bare context-only provider was a real possibility this wave audited
 * for), `<ColorPicker>` DOES render its OWN real DOM node — the locator you
 * place on it lands on a `<div class="fui-ColorPicker">` wrapping whatever
 * `ColorArea`/`ColorSlider` children the consumer composes inside it.
 * {@link parts}' `area`/`hueSlider` are located by Fluent's own un-hashed
 * structural classes (`.fui-ColorArea`, and `.fui-ColorSlider__input` — the
 * slider's PRIMARY slot, see `ColorSliderDriver`'s class doc), scoped as
 * descendants of THIS driver's own locator — verified to disambiguate two
 * `ColorPicker`s rendered side by side correctly (driving one instance's hue
 * leaves the other's untouched), with no portal/re-root recipe needed
 * (`ColorPicker` does not portal, unlike the Wave 2 overlay surfaces).
 *
 * `ColorPicker` itself is a strictly CONTROLLED component — verified against
 * `useColorPicker_unstable`'s source: it holds no internal state at all, only
 * `color`/`onColorChange`, both handed straight to context (no `defaultColor`
 * escape hatch the way `Checkbox`/`Slider` have `defaultChecked`/`defaultValue`).
 * A scene exercising this driver's write methods needs its example to
 * actually hold `color` in `useState` and update it from `onColorChange`,
 * exactly like a real consumer would — see `ColorPicker.examples.tsx`.
 * `ColorPicker` also has no `disabled` prop of its own (verified: passing one
 * has zero DOM effect on the root `<div>`, the same reason
 * {@link ColorAreaDriver}'s class doc records for `ColorArea`), so there is
 * no root-level disabled state to expose beyond each part's own.
 *
 * Scope: only ONE `ColorArea` and ONE `ColorSlider` child are addressed (the
 * common hue-slider composition this driver targets) — a `ColorPicker`
 * composed with more than one of either (e.g. an extra `channel="saturation"`
 * slider) resolves {@link parts} to whichever matches first in DOM order,
 * out of scope here. There is also no dedicated alpha-channel slider in this
 * version of `@fluentui/react-color-picker` at all (audited: `ColorSlider`'s
 * `channel` prop is `'hue' | 'saturation' | 'value'` only) — see the package
 * README's Known gaps.
 */
export class ColorPickerDriver extends ComponentDriver<typeof colorPickerParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: colorPickerParts,
    });
  }

  /** The current color: hue (`0`–`360`) plus saturation/value (`0`–`100` each). */
  async getColor(): Promise<{ hue: number; saturation: number; value: number }> {
    const [hue, area] = await Promise.all([this.parts.hueSlider.getValue(), this.parts.area.getValue()]);
    return { hue, ...area };
  }

  /** Drive the hue channel (`0`–`360`) through the hue slider's native range input. */
  async setHue(hue: number): Promise<boolean> {
    return this.parts.hueSlider.setValue(hue);
  }

  /** Drive the saturation/value channels (`0`–`100` each) through the color area's two native range inputs. */
  async setSaturationValue(saturation: number, value: number): Promise<boolean> {
    return this.parts.area.setValue({ saturation, value });
  }

  get driverName(): string {
    return 'FluentV9ColorPickerDriver';
  }
}
