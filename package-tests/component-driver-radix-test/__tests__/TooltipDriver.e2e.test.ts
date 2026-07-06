import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tooltipExampleTestSuite } from '../src/examples';

testRunner(tooltipExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
