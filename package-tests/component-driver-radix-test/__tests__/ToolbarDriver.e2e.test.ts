import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { toolbarExampleTestSuite } from '../src/examples';

testRunner(toolbarExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
