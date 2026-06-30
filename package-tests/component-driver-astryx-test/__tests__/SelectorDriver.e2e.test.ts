import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { selectorExampleTestSuite } from '../src/examples';

testRunner(selectorExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
