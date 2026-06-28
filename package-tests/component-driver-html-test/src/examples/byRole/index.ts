import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { byRoleExample, byRoleExampleTestSuite } from './ByRole.suite';

export { byRoleExample, byRoleExampleTestSuite };

export const byRoleExamples = [byRoleExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
