import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { labelExampleTestSuite } from '../src/examples';

testRunner(labelExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
