import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { clickLocationMouseEventExample, clickLocationMouseEventExampleTestSuite } from './ClickLocation.examples';
import { hoverMouseEventExample, hoverMouseEventExampleTestSuite } from './Hover.examples';

export {
  clickLocationMouseEventExample,
  clickLocationMouseEventExampleTestSuite,
  hoverMouseEventExample,
  hoverMouseEventExampleTestSuite,
};

export const mouseEventExamples = [hoverMouseEventExample, clickLocationMouseEventExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
