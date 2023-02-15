import { defaultOnFinishUpdate, defaultStep } from './defaultValues';
import { IComponentDriverOption, StepFunction } from './types';

export class ComponentDriver {
  protected readonly step: StepFunction;
  protected readonly onFinishUpdate: () => Promise<void>;
  readonly driverName: string = '';

  constructor(readonly baseElement: Element | null, option: Partial<IComponentDriverOption>) {
    this.step = option?.step ?? defaultStep;
    this.onFinishUpdate = option?.onFinishUpdate ?? defaultOnFinishUpdate;
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

  get html(): string | null {
    if (this.baseElement == null) {
      return null;
    }
    return this.baseElement.outerHTML;
  }

  get dom(): Element | null {
    return this.baseElement;
  }
}
