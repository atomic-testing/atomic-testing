import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { linkedElementExample, linkedElementExampleScenePart } from './LinkedElement.examples';

export { linkedElementExample, linkedElementExampleScenePart };

export const formExamples = [linkedElementExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
