import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { toggleButtonExampleTestSuite } from '../src/examples';

testRunner(toggleButtonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
