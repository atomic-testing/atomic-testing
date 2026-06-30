import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { mobileNavExample, mobileNavExampleTestSuite } from './MobileNav.suite';

export { mobileNavUIExample } from './MobileNav.examples';
export { mobileNavExample, mobileNavExampleTestSuite };

export const mobileNavExamples = [mobileNavExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
