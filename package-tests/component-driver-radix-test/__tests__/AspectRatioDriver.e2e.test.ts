import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { aspectRatioExampleTestSuite } from '../src/examples';

testRunner(aspectRatioExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
