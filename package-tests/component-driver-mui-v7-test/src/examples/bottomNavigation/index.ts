import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { basicBottomNavigationUIExample } from './BasicBottomNavigation.example';
import { basicBottomNavigationExample, basicBottomNavigationTestSuite } from './BasicBottomNavigation.suite';

export { basicBottomNavigationUIExample, basicBottomNavigationExample, basicBottomNavigationTestSuite };

export const bottomNavigationExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicBottomNavigationExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
