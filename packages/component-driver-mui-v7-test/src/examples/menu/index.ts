import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { accountMenuExample, accountMenuTestSuite } from './AccountMenu.examples';

export { accountMenuExample, accountMenuTestSuite };

export const menuExamples: IExampleUnit<ScenePart, JSX.Element>[] = [accountMenuExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
