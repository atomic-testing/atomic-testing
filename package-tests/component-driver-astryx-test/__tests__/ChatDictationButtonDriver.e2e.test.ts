import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { chatDictationButtonExampleTestSuite } from '../src/examples';

testRunner(chatDictationButtonExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
