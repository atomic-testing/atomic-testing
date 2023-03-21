import { HTMLRadioButtonGroupDriver } from '@atomic-testing/component-driver-html';
import {
  byInputType,
  byValue,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  IInteractor,
  LocatorChain,
  LocatorRelativePosition,
  LocatorType,
  locatorUtil,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  choices: {
    locator: byInputType('radio'),
    driver: HTMLRadioButtonGroupDriver,
  },
} satisfies ScenePart;

export class RatingDriver extends ComponentDriver<typeof parts> implements IInputDriver<number | null> {
  constructor(locator: LocatorChain, interactor: IInteractor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async getValue(): Promise<number | null> {
    // TODO: https://github.com/tangentlin/atomic-testing/issues/69
    // getValue() does not work when readonly
    await this.enforcePartExistence('choices');
    const value = await this.parts.choices.getValue();
    if (value == null) {
      return null;
    }
    return parseFloat(value);
  }

  async setValue(value: number | null): Promise<boolean> {
    // TODO: Setting value to null is not supported.  https://github.com/tangentlin/atomic-testing/issues/68
    const currentValue = await this.getValue();
    if (value === currentValue) {
      return true;
    }

    const valueToClick = (value == null ? currentValue : value) as number;
    const targetLocator = locatorUtil.append(
      this.parts.choices.locator,
      byValue(valueToClick.toString(), LocatorRelativePosition.Same),
    );

    const targetExists = await this.interactor.exists(targetLocator);
    if (targetExists) {
      const id = await this.interactor.getAttribute(targetLocator, 'id');
      const labelLocator = locatorUtil.append(this.locator, { type: LocatorType.Css, selector: `label[for="${id}"]` });
      await this.interactor.click(labelLocator);
    }
    // TODO: throw error if the value does not exist
    return targetExists;
  }

  get driverName(): string {
    return 'MuiV5RatingDriver';
  }
}
