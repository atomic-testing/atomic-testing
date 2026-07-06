import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { oneTimePasswordFieldExampleTestSuite } from '../src/examples';

testRunner(oneTimePasswordFieldExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
