import { JSX } from 'react';

import { IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

import { basicSliderUIExample } from './BasicSlider.examples';
import { basicSliderExample, basicSliderTestSuite } from './BasicSlider.suite';

export { basicSliderUIExample, basicSliderExample, basicSliderTestSuite };

export const sliderUIExamples: IExampleUIUnit<JSX.Element>[] = [
  basicSliderUIExample,
] satisfies IExampleUIUnit<JSX.Element>[];

export const sliderExamples: IExampleUnit<ScenePart, JSX.Element>[] = [basicSliderExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
