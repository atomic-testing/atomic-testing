import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicSpeedDialUIExample } from './BasicSpeedDial.example';
import { basicSpeedDialExample, basicSpeedDialTestSuite } from './BasicSpeedDial.suite';

export { basicSpeedDialUIExample, basicSpeedDialExample, basicSpeedDialTestSuite };

export const speedDialExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicSpeedDialExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
