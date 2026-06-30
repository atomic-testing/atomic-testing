import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { buttonGroupExampleTestSuite } from '../src/examples';

testRunner(buttonGroupExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
