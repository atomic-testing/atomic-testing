import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { searchBoxExample, searchBoxExampleTestSuite } from './SearchBox.suite';

export { searchBoxUIExample } from './SearchBox.examples';
export { searchBoxExample, searchBoxExampleTestSuite };

export const searchBoxExamples = [searchBoxExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
