import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tokenExampleTestSuite } from '../src/examples';

testRunner(tokenExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
