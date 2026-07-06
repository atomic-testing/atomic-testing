import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { buttonTestSuite } from '../src/examples/button/Button.suite';

testRunner(buttonTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
