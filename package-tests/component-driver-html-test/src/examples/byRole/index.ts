import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { byRoleExample, byRoleExampleTestSuite } from './ByRole.suite';

export { byRoleExample, byRoleExampleTestSuite };

export const byRoleExamples = [byRoleExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
