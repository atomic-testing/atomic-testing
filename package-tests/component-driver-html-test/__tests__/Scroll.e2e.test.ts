import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { scrollExampleTestSuite } from '../src/examples';

testRunner(scrollExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
