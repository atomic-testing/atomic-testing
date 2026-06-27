import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicDrawerUIExample } from './BasicDrawer.example';
import { basicDrawerExample, basicDrawerTestSuite } from './BasicDrawer.suite';

export { basicDrawerUIExample, basicDrawerExample, basicDrawerTestSuite };

export const drawerExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicDrawerExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
