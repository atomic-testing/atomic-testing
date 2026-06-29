import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { badgeExample, badgeExampleTestSuite } from './Badge.suite';

export { badgeUIExample } from './Badge.examples';
export { badgeExample, badgeExampleTestSuite };

export const badgeExamples = [badgeExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
