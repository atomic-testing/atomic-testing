import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { accountMenuTestSuite, accountMenuExample } from './AccountMenu.suite';

export { accountMenuExample, accountMenuTestSuite };

export const menuExamples: IExampleUnit<ScenePart, JSX.Element>[] = [accountMenuExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
