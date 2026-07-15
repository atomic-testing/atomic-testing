import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { menuExample, menuExampleTestSuite } from './Menu.suite';

export { menuUIExample } from './Menu.examples';
export { menuExample, menuExampleTestSuite };

export const menuExamples = [menuExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
