import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { chatToolCallsExampleTestSuite } from '../src/examples';

testRunner(chatToolCallsExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
