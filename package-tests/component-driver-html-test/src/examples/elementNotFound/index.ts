import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { elementNotFoundExample, elementNotFoundTestSuite } from './ElementNotFound.suite';

export { elementNotFoundExample, elementNotFoundTestSuite };

export const elementNotFoundExamples = [elementNotFoundExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
