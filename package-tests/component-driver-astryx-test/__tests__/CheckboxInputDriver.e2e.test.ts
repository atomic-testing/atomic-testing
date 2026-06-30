import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { checkboxInputExampleTestSuite } from '../src/examples';

testRunner(checkboxInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
