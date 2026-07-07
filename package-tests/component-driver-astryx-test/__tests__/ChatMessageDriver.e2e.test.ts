import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { chatMessageExampleTestSuite } from '../src/examples';

testRunner(chatMessageExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
