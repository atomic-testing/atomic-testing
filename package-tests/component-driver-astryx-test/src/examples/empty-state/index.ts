import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { emptyStateExample, emptyStateExampleTestSuite } from './EmptyState.suite';

export { emptyStateUIExample } from './EmptyState.examples';
export { emptyStateExample, emptyStateExampleTestSuite };

export const emptyStateExamples = [emptyStateExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
