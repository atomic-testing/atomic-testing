import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tokenizerExampleTestSuite } from '../src/examples';

testRunner(tokenizerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
