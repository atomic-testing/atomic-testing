import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { basicTablePaginationUIExample } from './BasicTablePagination.example';
import { basicTablePaginationExample, basicTablePaginationTestSuite } from './BasicTablePagination.suite';

export { basicTablePaginationUIExample, basicTablePaginationExample, basicTablePaginationTestSuite };

export const tablePaginationExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicTablePaginationExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
