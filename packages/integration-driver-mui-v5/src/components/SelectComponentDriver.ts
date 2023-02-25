import userEvent from '@testing-library/user-event';
import {
  ComponentDriver,
  IInputDriver,
  ScenePart,
  ScenePartDriver,
  SelectorRelativePosition,
  SelectorType,
  SimpleComponentDriver,
} from '@testzilla/core';

export const selectComponentPart: ScenePart = {
  trigger: {
    locator: '[role=button]',
    driver: ComponentDriver,
  },
  dropdown: {
    locator: {
      type: SelectorType.css,
      selector: '[role=presentation].MuiPopover-root [role=listbox].MuiList-root',
      relative: SelectorRelativePosition.documentRoot,
    },
    driver: ComponentDriver,
  },
  input: {
    locator: 'input.MuiSelect-nativeInput',
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
    this.getInnerEngine()?.enforcePartExistence('input');
    const input = this.getInnerEngine()?.getParts?.()?.input;
    const value = input?.dom?.getAttribute('value') ?? null;
    return Promise.resolve(value);
  }

  async setValue(value: string | null): Promise<boolean> {
    if (this.baseElement == null) {
      return Promise.resolve(false);
    }
    let success = false;
    await this.step(async () => {
      this.getInnerEngine()?.enforcePartExistence('trigger');
      const trigger = this.getInnerEngine()?.getParts?.()?.trigger as SelectComponentScenePartDriver['trigger'];
      await userEvent.click(trigger?.dom as HTMLElement);
      return Promise.resolve();
    });

    await this.step(async () => {
      this.getInnerEngine()?.enforcePartExistence('dropdown');
      const dropdown = this.getInnerEngine()?.getParts?.()?.dropdown as SelectComponentScenePartDriver['dropdown'];
      const option = dropdown?.dom?.querySelector(`[data-value="${value}"]`);
      if (option != null) {
        await userEvent.click(option);
        success = true;
      }
      return Promise.resolve();
    });

    return Promise.resolve(success);
  }

  protected override getInnerPartDefinition(): SelectComponentScenePart {
    return selectComponentPart;
  }

  get driverName(): string {
    return 'MuiV5Select';
  }
}
