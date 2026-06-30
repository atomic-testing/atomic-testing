import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { paginationExample, paginationExampleTestSuite } from './Pagination.suite';

export { paginationUIExample } from './Pagination.examples';
export { paginationExample, paginationExampleTestSuite };

export const paginationExamples = [paginationExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
