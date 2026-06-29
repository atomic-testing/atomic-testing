import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { itemExample, itemExampleTestSuite } from './Item.suite';

export { itemUIExample } from './Item.examples';
export { itemExample, itemExampleTestSuite };

export const itemExamples = [itemExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
