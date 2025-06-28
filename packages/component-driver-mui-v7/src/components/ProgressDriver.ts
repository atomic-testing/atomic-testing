import { HTMLRadioButtonGroupDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byInputType,
  byValue,
  ComponentDriver,
  IComponentDriverOption,
  IInputDriver,
  Interactor,
  type LocatorRelativePosition,
  locatorUtil,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const parts = {
  choices: {
    locator: byInputType('radio'),
    driver: HTMLRadioButtonGroupDriver,
  },
} satisfies ScenePart;

export class ProgressDriver extends ComponentDriver<typeof parts> implements IInputDriver<number | null> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts,
    });
  }

  async getValue(): Promise<number | null> {
    const rawValue = await this.getAttribute('aria-valuenow');
    const numValue = Number(rawValue);
    if (rawValue == null || isNaN(numValue)) {
      return null;
    }
    return Number(rawValue);
  }

  async getType(): Promise<'linear' | 'circular'> {
    const cssClasses = await this.getAttribute('class');
    if (cssClasses?.includes('MuiCircularProgress-root')) {
      return 'circular';
    }
    return 'linear';
  }

  async isDeterminate(): Promise<boolean> {
    const val = await this.getValue();
    return val != null;
  }

  //TODO: Buffer value can be extracted from style="transform: translateX(-15%);" actual value would be 100 - 15 = 85
  // <span class="MuiLinearProgress-bar MuiLinearProgress-bar2 MuiLinearProgress-colorPrimary MuiLinearProgress-bar2Buffer css-1v1662g-MuiLinearProgress-bar2" style="transform: translateX(-15%);"></span>

  async setValue(value: number | null): Promise<boolean> {
    // TODO: Setting value to null is not supported.  https://github.com/atomic-testing/atomic-testing/issues/68
    const currentValue = await this.getValue();
    if (value === currentValue) {
      return true;
    }

    const valueToClick = (value == null ? currentValue : value) as number;
    const targetLocator = locatorUtil.append(this.parts.choices.locator, byValue(valueToClick.toString(), 'Same'));

    const targetExists = await this.interactor.exists(targetLocator);
    if (targetExists) {
      const id = await this.interactor.getAttribute(targetLocator, 'id');
      const labelLocator = locatorUtil.append(this.locator, byCssSelector(`label[for="${id}"]`));
      await this.interactor.click(labelLocator);
    }
    // TODO: throw error if the value does not exist
    return targetExists;
  }

  get driverName(): string {
    return 'MuiV7ProgressDriver';
  }
}
