import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { teachingPopoverExampleTestSuite } from '../src/examples';

testRunner(teachingPopoverExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
