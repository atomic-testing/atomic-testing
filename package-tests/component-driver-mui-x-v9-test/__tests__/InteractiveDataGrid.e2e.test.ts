import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { interactiveDataGridPremiumTestSuite } from '../src/examples';

testRunner(interactiveDataGridPremiumTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
