import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicTablePaginationUIExample } from './BasicTablePagination.example';
import { basicTablePaginationExample, basicTablePaginationTestSuite } from './BasicTablePagination.suite';

export { basicTablePaginationUIExample, basicTablePaginationExample, basicTablePaginationTestSuite };

export const tablePaginationExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicTablePaginationExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
