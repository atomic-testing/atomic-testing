import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { metadataListExample, metadataListExampleTestSuite } from './MetadataList.suite';

export { metadataListUIExample } from './MetadataList.examples';
export { metadataListExample, metadataListExampleTestSuite };

export const metadataListExamples = [metadataListExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
