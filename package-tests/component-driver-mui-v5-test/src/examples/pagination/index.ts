import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicPaginationUIExample } from './BasicPagination.example';
import { basicPaginationExample, basicPaginationTestSuite } from './BasicPagination.suite';

export { basicPaginationUIExample, basicPaginationExample, basicPaginationTestSuite };

export const paginationExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicPaginationExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
