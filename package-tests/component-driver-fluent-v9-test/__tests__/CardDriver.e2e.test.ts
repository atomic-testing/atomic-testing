import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { cardExampleTestSuite } from '../src/examples';

testRunner(cardExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
