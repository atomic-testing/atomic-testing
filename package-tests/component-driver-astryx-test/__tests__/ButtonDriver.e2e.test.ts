import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { buttonExampleTestSuite } from '../src/examples';

testRunner(buttonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
