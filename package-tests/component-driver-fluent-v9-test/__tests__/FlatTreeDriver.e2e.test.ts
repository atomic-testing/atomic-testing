import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { flatTreeExampleTestSuite } from '../src/examples';

testRunner(flatTreeExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
