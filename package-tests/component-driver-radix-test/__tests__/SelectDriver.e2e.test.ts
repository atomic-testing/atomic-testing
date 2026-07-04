import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { selectExampleTestSuite } from '../src/examples';

testRunner(selectExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
