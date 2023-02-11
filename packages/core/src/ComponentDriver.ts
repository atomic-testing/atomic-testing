export type StepFunction = (work: () => Promise<void>) => Promise<void>;

export async function defaultStep(work: () => Promise<void>): Promise<void> {
  await work();
}

export async function defaultOnFinishUpdate(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 0);
  });
}

export interface IComponentDriverOption {
  step: StepFunction;
  // Call upon react has finished update
  onFinishUpdate?: () => Promise<void>;
}

export class ComponentDriver {
  protected readonly step: StepFunction;
  protected readonly onFinishUpdate: () => Promise<void>;
  readonly driverName: string = '';

  constructor(readonly baseElement?: HTMLElement, option?: IComponentDriverOption) {
    this.step = option?.step ?? defaultStep;
    this.onFinishUpdate = option?.onFinishUpdate ?? defaultOnFinishUpdate;
  }

  async exists(): Promise<boolean> {
    return Promise.resolve(!!this.baseElement);
  }

  async text(): Promise<string | void | null> {
    return Promise.resolve(this.baseElement?.textContent);
  }

  get html(): string | void {
    return this.baseElement?.outerHTML;
  }

  get dom(): HTMLElement | void {
    return this.baseElement;
  }
}
