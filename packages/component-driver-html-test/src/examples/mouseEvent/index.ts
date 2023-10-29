import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { clickLocationMouseEventExample, clickLocationMouseEventExampleTestSuite } from './ClickLocation.examples';
import { hoverMouseEventExample, hoverMouseEventExampleTestSuite } from './Hover.examples';
import { mouseLocationMouseEventExample, mouseLocationMouseEventExampleTestSuite } from './MouseLocation.examples';

export {
  clickLocationMouseEventExample,
  clickLocationMouseEventExampleTestSuite,
  hoverMouseEventExample,
  hoverMouseEventExampleTestSuite,
  mouseLocationMouseEventExample,
  mouseLocationMouseEventExampleTestSuite,
};

export const mouseEventExamples = [
  hoverMouseEventExample,
  clickLocationMouseEventExample,
  mouseLocationMouseEventExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
