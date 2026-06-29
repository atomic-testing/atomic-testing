import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
  ScenePartDriver,
} from '@atomic-testing/core';

export const parts = {
  input: {
    locator: byCssSelector('input[type="range"][data-index="0"]'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export type SelectScenePart = typeof parts;
export type SelectScenePartDriver = ScenePartDriver<SelectScenePart>;

export class SliderDriver extends ComponentDriver<SelectScenePart> implements IInputDriver<number> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: parts,
    });
  }

  /**
   * Return the first occurrence of the Slider input
   * @returns
   */
  async getValue(): Promise<number> {
    const values = await this.getRangeValues(1);
    return values[0]!;
  }

  /**
   * Set the slider's value by driving its range input to the target.
   *
   * The value is applied through the {@link Interactor.setRangeValue} primitive,
   * so the browser snaps an off-step target to the slider's nearest step. On a
   * multi-thumb (range) slider this sets the first thumb only; use
   * {@link setRangeValues} to set every thumb.
   *
   * @param value The target value; snapped to the slider's step in-browser
   * @returns Whether the slider's input was found and set
   */
  async setValue(value: number): Promise<boolean> {
    return this.setRangeValues([value]);
  }

  async getRangeValues(count?: number): Promise<readonly number[]> {
    await this.enforcePartExistence('input');
    const result: number[] = [];

    let index = 0;
    let done = false;
    while (!done) {
      const locator = locatorUtil.append(this.locator, this.getInputLocator(index));
      const exists = await this.interactor.exists(locator);
      if (exists) {
        index++;
        done = count != null && index >= count;
        // Read the value *property* (not the `value` attribute, which keeps the
        // initial value after a programmatic change in real browsers).
        const value = await this.interactor.getInputValue(locator);
        result.push(parseFloat(value!));
      } else {
        done = true;
      }
    }
    return result;
  }

  private getInputLocator(index: number): PartLocator {
    return byCssSelector(`input[type="range"][data-index="${index}"]`);
  }

  /**
   * Set every thumb of the slider, one `value` per thumb in document order.
   *
   * Each thumb's range input is driven through the {@link Interactor.setRangeValue}
   * primitive, so the browser snaps an off-step target to the slider's nearest
   * step. Thumbs are set in index order and MUI clamps a thumb at its neighbor, so
   * pass already-ordered, non-crossing values (e.g. `[20, 70]`, not `[70, 20]`).
   *
   * @param values One target per thumb, lowest thumb first
   * @returns `true` once every thumb was set; `false` if more values than thumbs
   *   were supplied (a missing thumb input stops the run)
   */
  async setRangeValues(values: readonly number[]): Promise<boolean> {
    await this.enforcePartExistence('input');
    for (let index = 0; index < values.length; index++) {
      const locator = locatorUtil.append(this.locator, this.getInputLocator(index));
      const exists = await this.interactor.exists(locator);
      if (!exists) {
        return false;
      }
      await this.interactor.setRangeValue(locator, values[index]!);
    }
    return true;
  }

  async isDisabled(): Promise<boolean> {
    await this.enforcePartExistence('input');
    const disabled = await this.parts.input.isDisabled();
    return disabled;
  }

  /**
   * The minimum value of the slider (the input's native `min` attribute).
   */
  async getMin(): Promise<number> {
    await this.enforcePartExistence('input');
    return parseFloat((await this.interactor.getAttribute(this.parts.input.locator, 'min'))!);
  }

  /**
   * The maximum value of the slider (the input's native `max` attribute).
   */
  async getMax(): Promise<number> {
    await this.enforcePartExistence('input');
    return parseFloat((await this.interactor.getAttribute(this.parts.input.locator, 'max'))!);
  }

  /**
   * The slider's step increment, or `null` when stepping is disabled (`step={null}`,
   * i.e. the thumb may only land on marks).
   */
  async getStep(): Promise<number | null> {
    await this.enforcePartExistence('input');
    const step = await this.interactor.getAttribute(this.parts.input.locator, 'step');
    const parsed = parseFloat(step!);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * The accessible value text of the active thumb (`aria-valuetext`, set via
   * `getAriaValueText`/`valueLabelFormat`), or `undefined` when none.
   */
  async getValueText(): Promise<Optional<string>> {
    await this.enforcePartExistence('input');
    return (await this.interactor.getAttribute(this.parts.input.locator, 'aria-valuetext')) ?? undefined;
  }

  /**
   * The labels of the slider's marks, in document order. Returns `[]` when the slider
   * has no labelled marks. Mark labels are addressed by their `data-index` (0,1,2,…)
   * rather than `:nth-of-type`, because they are spans interleaved with the slider's
   * other spans (rail/track/thumb) — a position `:nth-of-type` cannot express portably.
   */
  async getMarks(): Promise<string[]> {
    const result: string[] = [];
    for (let index = 0; ; index++) {
      const markLocator = locatorUtil.append(
        this.locator,
        byCssSelector(`.MuiSlider-markLabel[data-index="${index}"]`)
      );
      if (!(await this.interactor.exists(markLocator))) {
        break;
      }
      const text = await this.interactor.getText(markLocator);
      if (text != null) {
        result.push(text.trim());
      }
    }
    return result;
  }

  get driverName(): string {
    return 'MuiV7SliderDriver';
  }
}
