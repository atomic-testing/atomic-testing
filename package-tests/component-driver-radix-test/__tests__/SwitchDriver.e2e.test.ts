import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { switchExampleTestSuite } from '../src/examples';

testRunner(switchExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
