import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicAccordionUIExample } from './BasicAccordion.examples';
import { basicAccordionExample, basicAccordionTestSuite } from './BasicAccordion.suite';

export { basicAccordionUIExample, basicAccordionExample, basicAccordionTestSuite };

export const accordionExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicAccordionExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
