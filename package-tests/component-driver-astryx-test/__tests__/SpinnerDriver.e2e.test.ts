import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { spinnerExampleTestSuite } from '../src/examples';

testRunner(spinnerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
