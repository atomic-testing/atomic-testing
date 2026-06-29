import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { typeaheadExample, typeaheadExampleTestSuite } from './Typeahead.suite';

export { typeaheadUIExample } from './Typeahead.examples';
export { typeaheadExample, typeaheadExampleTestSuite };

export const typeaheadExamples = [typeaheadExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
