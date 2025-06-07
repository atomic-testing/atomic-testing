import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicAutoCompleteUIExample } from './BasicAutoComplete.examples';
import { basicAutoCompleteExample, basicAutoCompleteTestSuite } from './BasicAutoComplete.suite';

export { basicAutoCompleteUIExample, basicAutoCompleteExample, basicAutoCompleteTestSuite };

export const autoCompleteExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicAutoCompleteExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
