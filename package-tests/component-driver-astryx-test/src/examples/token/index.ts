import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { tokenExample, tokenExampleTestSuite } from './Token.suite';

export { tokenUIExample } from './Token.examples';
export { tokenExample, tokenExampleTestSuite };

export const tokenExamples = [tokenExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
