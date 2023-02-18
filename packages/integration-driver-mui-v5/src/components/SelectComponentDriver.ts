import {
  ComponentDriver,
  IInputDriver,
  ScenePart,
  ScenePartDriver,
  SelectorType,
  SimpleComponentDriver,
} from '@testzilla/core';

export const selectComponentPart: ScenePart = {
  trigger: {
    selector: '[role=button]',
    driver: ComponentDriver,
  },
  dropdown: {
    selector: {
      type: SelectorType.css,
      selector: '[role=presentation].MuiPopover-root [role=listbox].MuiList-root',
    },
    driver: ComponentDriver,
  },
  input: {
    selector: 'input.MuiSelect-nativeInput',
    driver: SimpleComponentDriver,
  },
};

export type SelectComponentScenePart = typeof selectComponentPart;
export type SelectComponentScenePartDriver = ScenePartDriver<SelectComponentScenePart>;

export class SelectComponentDriver
  extends ComponentDriver<SelectComponentScenePart>
  implements IInputDriver<string | null>
{
  getValue(): Promise<string | null> {
    if (this.baseElement == null) {
      return Promise.resolve(null);
    }

    const input = this.getInnerEngine()?.getParts?.()?.input;
    if (input == null) {
      return Promise.resolve(null);
    }
    const value = input.dom?.getAttribute('value') ?? null;
    return Promise.resolve(value);
  }

  async setValue(value: string | null): Promise<boolean> {
    if (this.getInnerEngine() == null) {
      return Promise.resolve(false);
    }

    let success = false;
    await this.step(async () => {
      this.getInnerEngine()?.enforcePartExistence('trigger');
      const trigger = this.getInnerEngine()?.getParts?.()?.trigger as SelectComponentScenePartDriver['trigger'];
      (trigger?.dom as HTMLElement).click();
      return Promise.resolve();
    });

    await this.step(async () => {
      this.getInnerEngine()?.enforcePartExistence('dropdown');
      const dropdown = this.getInnerEngine()?.getParts?.()?.dropdown as SelectComponentScenePartDriver['dropdown'];
      const option = dropdown?.dom?.querySelector(`[data-value="${value}"]`);
      if (option != null) {
        (option as HTMLElement).click();
        success = true;
      }
      return Promise.resolve();
    });

    return Promise.resolve(success);
  }

  override getInnerPartDefinition(): SelectComponentScenePart {
    return selectComponentPart;
  }

  get driverName(): string {
    return 'MuiV5Select';
  }
}
