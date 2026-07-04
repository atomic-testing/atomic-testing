import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { comboboxExampleTestSuite } from '../src/examples';

testRunner(comboboxExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
