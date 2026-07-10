import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { groupedDataGridPremiumTestSuite } from '../src/examples';

testRunner(groupedDataGridPremiumTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
