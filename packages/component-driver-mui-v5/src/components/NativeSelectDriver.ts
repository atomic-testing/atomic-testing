import { HTMLSelectDriver } from '@atomic-testing/component-driver-html';
import {
  ComponentDriver,
  defaultStep,
  IComponentDriverOption,
  IInputDriver,
  IInteractor,
  LocatorChain,
  ScenePart,
  ScenePartDriver,
} from '@atomic-testing/core';

export const nativeSelectPart = {
  select: {
    locator: 'select',
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export type NativeSelectScenePart = typeof nativeSelectPart;
export type NativeSelectScenePartDriver = ScenePartDriver<NativeSelectScenePart>;

export class NativeSelectDriver
  extends ComponentDriver<NativeSelectScenePart>
  implements IInputDriver<string | readonly string[] | null>
{
  constructor(locator: LocatorChain, interactor: IInteractor, option?: IComponentDriverOption) {
    super(locator, interactor, {
      perform: defaultStep,
      ...option,
      parts: nativeSelectPart,
    });
  }

  async getValue(): Promise<string | readonly string[] | null> {
    await this.enforcePartExistence('select');
    const value = await this.parts.select.getValue();
    return value ?? null;
  }

  async setValue(value: string | null): Promise<boolean> {
    await this.enforcePartExistence('select');
    const success = await this.parts.select.setValue(value);

    return Promise.resolve(success);
  }

  get driverName(): string {
    return 'MuiV5SelectDriver';
  }
}
