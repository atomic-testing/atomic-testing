import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dragExample, dragExampleTestSuite } from './Drag.suite';
import { geometryExample, geometryExampleTestSuite } from './Geometry.suite';

export { dragExample, dragExampleTestSuite, geometryExample, geometryExampleTestSuite };

export const dragExamples = [dragExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
