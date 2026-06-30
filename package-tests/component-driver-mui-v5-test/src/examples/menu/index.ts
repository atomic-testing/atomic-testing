import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { accountMenuTestSuite, accountMenuExample } from './AccountMenu.suite';

export { accountMenuExample, accountMenuTestSuite };

export const menuExamples: IExampleUnit<ScenePart, JSX.Element>[] = [accountMenuExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
