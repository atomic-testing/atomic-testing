import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { typeTextExample, typeTextExampleTestSuite } from './TypeText.suite';

export { typeTextExample, typeTextExampleTestSuite };

export const typeTextExamples = [typeTextExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
