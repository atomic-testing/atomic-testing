import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { inputGroupExampleTestSuite } from '../src/examples';

testRunner(inputGroupExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
