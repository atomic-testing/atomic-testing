import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { chartInteractionTestSuite } from './ChartInteraction.suite';
import { chartsExample, chartsTestSuite } from './Charts.suite';

export { chartInteractionTestSuite, chartsExample, chartsTestSuite };

export const chartsExamples: IExampleUnit<ScenePart, JSX.Element>[] = [chartsExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
