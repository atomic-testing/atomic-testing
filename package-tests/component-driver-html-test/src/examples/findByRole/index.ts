import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { findByRoleExample, findByRoleExampleTestSuite } from './FindByRole.suite';

export { findByRoleExample, findByRoleExampleTestSuite };

export const findByRoleExamples = [findByRoleExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
