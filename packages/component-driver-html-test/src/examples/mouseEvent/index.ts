import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { hoverMouseEventExample, hoverMouseEventExampleTestSuite } from './Hover.examples';

export { hoverMouseEventExample, hoverMouseEventExampleTestSuite };

export const mouseEventExamples = [hoverMouseEventExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
