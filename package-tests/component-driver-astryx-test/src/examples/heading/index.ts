import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { headingExample, headingExampleTestSuite } from './Heading.suite';

export { headingUIExample } from './Heading.examples';
export { headingExample, headingExampleTestSuite };

export const headingExamples = [headingExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
