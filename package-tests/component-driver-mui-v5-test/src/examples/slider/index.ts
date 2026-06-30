import { ScenePart } from '@atomic-testing/core';
import { IExampleUnit, IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

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
