import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { exclusiveSelectionUIExample } from './ExclusiveSelection.example';
import { exclusiveSelectionExample, exclusiveSelectionTestSuite } from './ExclusiveSelection.suite';
import { regularSelectionUIExample } from './MultipleSelection.example';
import { regularSelectionExample, regularSelectionButtonTestSuite } from './MultipleSelection.suite';
import { singleToggleUIExample } from './SingleToggle.example';
import { singleToggleExample, singleToggleButtonTestSuite } from './SingleToggle.suite';

export {
  singleToggleUIExample,
  singleToggleExample,
  singleToggleButtonTestSuite,
  exclusiveSelectionUIExample,
  exclusiveSelectionExample,
  exclusiveSelectionTestSuite,
  regularSelectionUIExample,
  regularSelectionExample,
  regularSelectionButtonTestSuite,
};

export const toggleButtonExamples: IExampleUnit<ScenePart, JSX.Element>[] = [
  singleToggleExample,
  exclusiveSelectionExample,
  regularSelectionExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
