import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { fileUploadExample, fileUploadExampleTestSuite } from './FileUpload.suite';

export { fileUploadExample, fileUploadExampleTestSuite };

export const fileUploadExamples = [fileUploadExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
