import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { metadataListExample, metadataListExampleTestSuite } from './MetadataList.suite';

export { metadataListUIExample } from './MetadataList.examples';
export { metadataListExample, metadataListExampleTestSuite };

export const metadataListExamples = [metadataListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
