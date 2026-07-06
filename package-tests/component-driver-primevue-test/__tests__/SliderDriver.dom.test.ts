import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { SliderExample } from '../src/examples/slider/Slider.examples';
import { sliderTestSuite } from '../src/examples/slider/Slider.suite';

testRunner(sliderTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(SliderExample, scenePart),
});
