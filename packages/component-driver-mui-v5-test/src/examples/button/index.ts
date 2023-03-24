import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { complexExample as complex } from './Complex.example';
import { iconAndLabelExample as iconAndLabel } from './IconAndLabel.example';

export const iconAndLabelExample = iconAndLabel;
export const complexExample = complex;
export const buttonExamples = [iconAndLabelExample, complexExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
