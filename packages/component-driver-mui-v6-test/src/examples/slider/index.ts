import { IExampleUnit, ScenePart } from '@atomic-testing/core';
import { basicSliderExample as basicSlider } from './BasicSlider.examples';

export { basicSliderTestSuite } from './BasicSlider.examples';

export const basicSliderExample = basicSlider;
export const sliderExamples = [basicSliderExample] satisfies IExampleUnit<ScenePart, JSX.Element>[];
