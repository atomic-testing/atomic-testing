import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { fieldExampleTestSuite } from '../src/examples';

testRunner(fieldExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
