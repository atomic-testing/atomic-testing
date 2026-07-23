import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { sliderTestSuite } from '../src/examples/slider/Slider.suite';

testRunner(sliderTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
