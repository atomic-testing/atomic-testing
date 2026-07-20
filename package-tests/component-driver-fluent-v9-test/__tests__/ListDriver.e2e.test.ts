import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { listExampleTestSuite } from '../src/examples';

testRunner(listExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
