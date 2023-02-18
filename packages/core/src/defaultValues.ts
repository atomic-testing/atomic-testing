import { ITestEngineOption } from './types';
import { wait } from './utils/timingUtil';

export async function defaultStep(work: () => Promise<void>): Promise<void> {
  await work();
}

export async function defaultOnFinishUpdate(): Promise<void> {
  return wait(0);
}

export const defaultTestEngineOption: Readonly<ITestEngineOption> = Object.freeze({
  step: defaultStep,
  onFinishUpdate: defaultOnFinishUpdate,
});
