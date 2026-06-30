import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { ratingTestSuite } from '../src/examples';

testRunner(ratingTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
