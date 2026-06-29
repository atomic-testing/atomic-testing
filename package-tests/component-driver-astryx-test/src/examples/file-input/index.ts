import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { fileInputExample, fileInputExampleTestSuite } from './FileInput.suite';

export { fileInputUIExample } from './FileInput.examples';
export { fileInputExample, fileInputExampleTestSuite };

export const fileInputExamples = [fileInputExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
