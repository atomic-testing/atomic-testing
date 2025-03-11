import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { clickLocationMouseEventExample, clickLocationMouseEventExampleTestSuite } from './ClickLocation.examples';
import { hoverMouseEventExample, hoverMouseEventExampleTestSuite } from './Hover.examples';
import { mouseLocationMouseEventExample, mouseLocationMouseEventExampleTestSuite } from './MouseLocation.examples';
import { mouseOverMouseEventExample, mouseOverMouseEventExampleTestSuite } from './MouseOver.examples';

export {
  clickLocationMouseEventExample,
  clickLocationMouseEventExampleTestSuite,
  hoverMouseEventExample,
  hoverMouseEventExampleTestSuite,
  mouseLocationMouseEventExample,
  mouseLocationMouseEventExampleTestSuite,
  mouseOverMouseEventExample,
  mouseOverMouseEventExampleTestSuite,
};

export const mouseEventExamples = [
  hoverMouseEventExample,
  clickLocationMouseEventExample,
  mouseLocationMouseEventExample,
  mouseOverMouseEventExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
