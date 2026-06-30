import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { carouselExampleTestSuite } from '../src/examples';

testRunner(carouselExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
