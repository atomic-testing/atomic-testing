import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicInputExample, basicInputTestSuite } from './BasicInput.examples';

export { basicInputExample, basicInputTestSuite };

export const inputExamples = [basicInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
