import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { accordionExample, accordionExampleTestSuite } from './Accordion.suite';

export { accordionUIExample } from './Accordion.examples';
export { accordionExample, accordionExampleTestSuite };

export const accordionExamples = [accordionExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
