import { JSX } from 'react';

import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { clickLocationMouseEventExample, clickLocationMouseEventExampleTestSuite } from './ClickLocation.suite';
import { hoverMouseEventExample, hoverMouseEventExampleTestSuite } from './Hover.suite';
import { mouseLocationMouseEventExample, mouseLocationMouseEventExampleTestSuite } from './MouseLocation.suite';
import { mouseOverMouseEventExample, mouseOverMouseEventExampleTestSuite } from './MouseOver.suite';

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
