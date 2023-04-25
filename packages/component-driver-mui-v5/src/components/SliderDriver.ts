import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  locatorUtil,
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
   * Set slider's range value.  Do not use as it will throw an error
   * @param values
   * @see https://github.com/atomic-testing/atomic-testing/issues/73
   */
  async setValue(value: number): Promise<boolean> {
    const success = await this.setRangeValues([value]);
    return success;
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
        const value = await this.interactor.getAttribute(locator, 'value');
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
   * Set slider's range values.  Do not use as it will throw an error
   * @param values
   * @see https://github.com/atomic-testing/atomic-testing/issues/73
   */
  async setRangeValues(values: readonly number[]): Promise<boolean> {
    await this.enforcePartExistence('input');
    throw new Error('setRangeValue is not supported.');
    // for (let index = 0; index < values.length; index++) {
    //   const locator = locatorUtil.append(this.locator, this.getInputLocator(index));
    //   const exists = await this.interactor.exists(locator);
    //   if (exists) {
    //     // @ts-ignore
    //     await this.interactor.changeValue(locator, values[index].toString());
    //     // const driver = new HTMLTextInputDriver(locator, this.interactor);
    //     // await driver.setValue(values[index].toString());
    //   } else {
    //     return false;
    //   }
    // }

    // return true;
  }

  async isDisabled(): Promise<boolean> {
    await this.enforcePartExistence('input');
    const disabled = await this.parts.input.isDisabled();
    return disabled;
  }

  get driverName(): string {
    return 'MuiV5SliderDriver';
  }
}
