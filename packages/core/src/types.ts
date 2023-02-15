export type StepFunction = (work: () => Promise<void>) => Promise<void>;

export interface ITestEngine {
  updateBinding(): void;
  getParentEngine(): ITestEngine | null;
}

export interface ITestEngineOption {
  step: StepFunction;
  onFinishUpdate?: () => Promise<void>;
}

export interface IComponentDriverOption {
  step: StepFunction;
  engine: ITestEngine;
  onFinishUpdate?: () => Promise<void>;
}
