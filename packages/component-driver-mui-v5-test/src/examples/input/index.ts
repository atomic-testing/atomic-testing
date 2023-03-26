import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicInputExample as basicInput } from './BasicInput.examples';
export { basicInputTestSuite } from './BasicInput.examples';

export const basicInputExample = basicInput;
export const inputExamples = [basicInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
