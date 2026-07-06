import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { separatorExample, separatorExampleTestSuite } from './Separator.suite';

export { separatorUIExample } from './Separator.examples';
export { separatorExample, separatorExampleTestSuite };

export const separatorExamples = [separatorExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
