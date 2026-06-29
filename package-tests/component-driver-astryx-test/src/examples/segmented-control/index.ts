import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { segmentedControlExample, segmentedControlExampleTestSuite } from './SegmentedControl.suite';

export { segmentedControlUIExample } from './SegmentedControl.examples';
export { segmentedControlExample, segmentedControlExampleTestSuite };

export const segmentedControlExamples = [segmentedControlExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
