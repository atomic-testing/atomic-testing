import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { separatorExampleTestSuite } from '../src/examples';

testRunner(separatorExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
