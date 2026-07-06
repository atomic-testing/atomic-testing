import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { JSX } from 'react';

import { sliderExample, sliderExampleTestSuite } from './Slider.suite';

export { sliderUIExample } from './Slider.examples';
export { sliderExample, sliderExampleTestSuite };

export const sliderExamples = [sliderExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
