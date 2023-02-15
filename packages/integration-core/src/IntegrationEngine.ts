import {
  defaultStep,
  domUtil,
  IComponentDriverOption,
  ITestEngine,
  PartDriverInstance,
  PartDriverLookup,
  PartQueryType,
  ScenePart,
  StepFunction,
  TooManyMatchingElementError,
} from '@testzilla/core';

import { defaultTestEngineOption } from '../../core/src/defaultValues';
import { ITestEngineOption } from '../../core/src/types';

export class IntegrationEngine<T extends PartDriverLookup> implements ITestEngine {
  private _parts: PartDriverInstance<T> = {} as PartDriverInstance<T>;
  private readonly _option: ITestEngineOption;
  constructor(
    private partDefinitions: ScenePart<T>,
    private root: Element,
    option?: Readonly<Partial<ITestEngineOption>>,
    public readonly parentEngine?: ITestEngine,
  ) {
    this._option = Object.assign({}, defaultTestEngineOption, option);
    this.updateBinding();
  }

  getParentEngine(): ITestEngine | null {
    return this.parentEngine ?? null;
  }

  updateBinding(): void {
    const result: Partial<PartDriverInstance<T>> = {};

    for (const [nestedComponentName, scenePart] of Object.entries(this.partDefinitions) as [
      keyof T,
      ScenePart<T>[keyof T],
    ][]) {
      const { query = nestedComponentName as string, driver, option: optionOverride } = scenePart;

      const option: IComponentDriverOption = {
        step: optionOverride?.step ?? this._option.step,
        onFinishUpdate: optionOverride?.onFinishUpdate ?? this._option.onFinishUpdate,
        engine: this,
      };

      const partEl = this.findElement(this.root, query);

      // @ts-ignore
      result[nestedComponentName] = new driver(partEl, option);
    }

    this._parts = result as PartDriverInstance<T>;
  }

  findElement(el: Element, query: PartQueryType): Element | null {
    const elements = el.querySelectorAll(query);
    const els: Element[] = [];
    elements.forEach((x) => els.push(x));
    const filtered = domUtil.removeAllChildren(els);
    if (filtered.length === 0) {
      return null;
    } else if (filtered.length === 1) {
      return filtered[0];
    }
    throw new TooManyMatchingElementError(query);
  }

  getParts(): PartDriverInstance<T> {
    this.updateBinding();
    return this._parts;
  }

  getStep(): StepFunction {
    return defaultStep;
  }
}
