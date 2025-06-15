import { JSX } from 'react';

import { IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

import { basicProgressUIExample } from './Progress.examples';
import { basicProgressExample, progressTestSuite } from './Progress.suite';

export { basicProgressUIExample, basicProgressExample, progressTestSuite };

export const progressUIExamples: IExampleUIUnit<JSX.Element>[] = [
  basicProgressUIExample,
] satisfies IExampleUIUnit<JSX.Element>[];

export const progressExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicProgressExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
