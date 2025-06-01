import { IExampleUnit, ScenePart } from '@atomic-testing/core';

import { complexExample as complex } from './ComplexButton.example';
import { iconAndLabelExample as iconAndLabel } from './IconAndLabelButton.example';

export { complexButtonTestSuite } from './ComplexButton.example';
export { iconAndLabelButtonTestSuite } from './IconAndLabelButton.example';

export const iconAndLabelExample = iconAndLabel;
export const complexExample = complex;
export const buttonExamples = [iconAndLabelExample, complexExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
