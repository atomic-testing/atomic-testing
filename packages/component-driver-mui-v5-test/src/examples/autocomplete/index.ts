import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicAutoCompleteExample, basicAutoCompleteTestSuite } from './BasicAutoComplete.examples';

export { basicAutoCompleteExample, basicAutoCompleteTestSuite };

export const autoCompleteExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  basicAutoCompleteExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
