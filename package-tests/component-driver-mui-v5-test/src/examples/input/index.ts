import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicInputUIExample } from './BasicInput.examples';
import { basicInputExample, basicInputTestSuite } from './BasicInput.suite';

export { basicInputUIExample, basicInputExample, basicInputTestSuite };

export const inputExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicInputExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
