import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { ratingExampleTestSuite } from '../src/examples';

testRunner(ratingExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
