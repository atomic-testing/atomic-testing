import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { toggleExampleTestSuite } from '../src/examples';

testRunner(toggleExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
