import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dataGridExampleTestSuite } from '../src/examples';

testRunner(dataGridExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
