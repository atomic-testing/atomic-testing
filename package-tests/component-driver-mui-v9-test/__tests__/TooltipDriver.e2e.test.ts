import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicTooltipTestSuite } from '../src/examples';

testRunner(basicTooltipTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
