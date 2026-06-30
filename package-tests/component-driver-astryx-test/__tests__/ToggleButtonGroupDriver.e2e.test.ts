import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { toggleButtonGroupExampleTestSuite } from '../src/examples';

testRunner(toggleButtonGroupExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
