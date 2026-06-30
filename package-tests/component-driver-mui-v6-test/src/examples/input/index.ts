import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicInputUIExample } from './BasicInput.examples';
import { basicInputExample, basicInputTestSuite } from './BasicInput.suite';

export { basicInputUIExample, basicInputExample, basicInputTestSuite };

export const inputExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicInputExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
