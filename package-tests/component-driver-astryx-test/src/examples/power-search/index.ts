import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { powerSearchExample, powerSearchExampleTestSuite } from './PowerSearch.suite';

export { powerSearchUIExample } from './PowerSearch.examples';
export { powerSearchExample, powerSearchExampleTestSuite };

export const powerSearchExamples = [powerSearchExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
