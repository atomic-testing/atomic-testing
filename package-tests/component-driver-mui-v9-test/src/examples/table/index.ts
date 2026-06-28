import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicTableUIExample } from './BasicTable.example';
import { basicTableExample, basicTableTestSuite } from './BasicTable.suite';

export { basicTableUIExample, basicTableExample, basicTableTestSuite };

export const tableExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicTableExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
