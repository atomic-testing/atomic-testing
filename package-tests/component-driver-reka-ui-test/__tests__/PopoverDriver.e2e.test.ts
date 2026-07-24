import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { popoverTestSuite } from '../src/examples/popover/Popover.suite';

testRunner(popoverTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
