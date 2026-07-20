import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { skeletonExampleTestSuite } from '../src/examples';

testRunner(skeletonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
