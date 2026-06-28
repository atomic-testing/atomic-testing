import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { dragExample, dragExampleTestSuite } from './Drag.suite';
import { geometryExample, geometryExampleTestSuite } from './Geometry.suite';

export { dragExample, dragExampleTestSuite, geometryExample, geometryExampleTestSuite };

export const dragExamples = [dragExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
