import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { basicAccordionExample, basicAccordionTestSuite } from './BasicAccordion.examples';

export { basicAccordionExample, basicAccordionTestSuite };

export const accordionExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicAccordionExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
