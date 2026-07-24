import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { tooltipTestSuite } from '../src/examples/tooltip/Tooltip.suite';

testRunner(tooltipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
