import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { fileUploadExample, fileUploadExampleTestSuite } from './FileUpload.suite';

export { fileUploadExample, fileUploadExampleTestSuite };

export const fileUploadExamples = [fileUploadExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
