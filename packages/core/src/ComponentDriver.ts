import { defaultOnFinishUpdate, defaultStep, defaultTestEngineOption } from './defaultValues';
import { MissingPartError } from './errors/MissingPartError';
import { TooManyMatchingElementError } from './errors/TooManyMatchingElementError';
import { LocatorRelativePosition, PartLocatorType } from './locators/PartLocatorType';
import {
  IComponentDriverOption,
  ITestEngine,
  ITestEngineOption,
  PartName,
  ScenePart,
  ScenePartDriver,
  StepFunction,
} from './types';
import * as domUtil from './utils/domUtil';

export abstract class ComponentDriver<InnerPart extends ScenePart = {}> {
  protected readonly step: StepFunction;
  protected readonly onFinishUpdate: () => Promise<void>;
  protected readonly option: IComponentDriverOption;
  protected innerPartEngine: ITestEngine<InnerPart> | null = null;

  private lastBoundBaseElement: Element | null = null;
  private lastBoundPartDefinition: Readonly<InnerPart> | null = null;

  constructor(public readonly baseElement: Element | null, option: Partial<IComponentDriverOption>) {
    this.step = option?.step ?? defaultStep;
    this.option = {
      step: this.performStep.bind(this),
      onFinishUpdate: defaultOnFinishUpdate,
      // @ts-ignore TODO: fix this
      engine: option?.engine,
      ...option,
    };
    this.onFinishUpdate = option?.onFinishUpdate ?? defaultOnFinishUpdate;
    this.innerPartEngine = this.getInnerEngine();
  }

  private async performStep(work: () => Promise<void>): Promise<void> {
    await this.option.step(work);
    this.getInnerEngine()?.updateBinding();
  }

  async exists(): Promise<boolean> {
    return Promise.resolve(!!this.baseElement);
  }

  async text(): Promise<string | null> {
    if (this.baseElement == null) {
      return Promise.resolve(null);
    }
    return Promise.resolve(this.baseElement.textContent);
  }

  protected getInnerEngine(): ITestEngine<InnerPart> | null {
    let engine: ITestEngine<InnerPart> | null = this.innerPartEngine;

    const part = this.getInnerPartDefinition?.();
    if (part != this.lastBoundPartDefinition || this.baseElement != this.lastBoundBaseElement) {
      this.lastBoundPartDefinition = part;
      this.lastBoundBaseElement = this.baseElement;
      if (part != null && this.baseElement != null) {
        engine = new IntegrationTestEngine(part, this.baseElement, this.option, this.option.engine);
      } else {
        engine = null;
      }
    }

    this.innerPartEngine = engine;
    return engine;
  }

  protected abstract getInnerPartDefinition(): Readonly<InnerPart> | null;

  get html(): string | null {
    if (this.baseElement == null) {
      return null;
    }
    return this.baseElement.outerHTML;
  }

  get dom(): Element | null {
    return this.baseElement;
  }

  abstract get driverName(): string;
}

export class IntegrationTestEngine<T extends ScenePart> implements ITestEngine<T> {
  private _parts: ScenePartDriver<T> = {} as ScenePartDriver<T>;
  private readonly _option: ITestEngineOption;
  constructor(
    private partDefinitions: T,
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
    const result: Partial<ScenePartDriver<T>> = {};

    for (const [nestedComponentName, scenePart] of Object.entries(this.partDefinitions)) {
      const { locator: query = nestedComponentName as string, driver, option: optionOverride } = scenePart;

      const option: IComponentDriverOption = {
        step: optionOverride?.step ?? this._option.step,
        onFinishUpdate: optionOverride?.onFinishUpdate ?? this._option.onFinishUpdate,
        engine: this,
      };

      const partEl = this.findElement(this.root, query);

      // @ts-ignore
      result[nestedComponentName] = new driver(partEl, option);
    }

    this._parts = result as ScenePartDriver<T>;
  }

  findElement(el: Element, query: PartLocatorType): Element | null {
    let elements: NodeListOf<Element>;
    if (typeof query === 'string') {
      elements = el.querySelectorAll(query);
    } else {
      const baseEl = query.relative === LocatorRelativePosition.documentRoot ? document.documentElement : el;
      elements = baseEl.querySelectorAll(query.selector);
    }

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

  enforcePartExistence(partName: PartName<T> | ReadonlyArray<PartName<T>>): void {
    const missingPartNames = this.getMissingPartNames(partName);
    if (missingPartNames.length > 0) {
      throw new MissingPartError(missingPartNames);
    }
  }

  getMissingPartNames(partName?: PartName<T> | ReadonlyArray<PartName<T>>): ReadonlyArray<PartName<T>> {
    let partNames: ReadonlyArray<keyof T>;
    if (partName == null) {
      partNames = Object.keys(this._parts) as ReadonlyArray<keyof T>;
    } else {
      partNames = Array.isArray(partName) ? partName : [partName];
    }
    return partNames.filter((x) => this._parts[x] == null);
  }

  getParts(): ScenePartDriver<T> {
    this.updateBinding();
    return this._parts;
  }

  getStep(): StepFunction {
    return defaultStep;
  }
}
