import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { numberInputExample, numberInputExampleTestSuite } from './NumberInput.suite';

export { numberInputUIExample } from './NumberInput.examples';
export { numberInputExample, numberInputExampleTestSuite };

export const numberInputExamples = [numberInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
