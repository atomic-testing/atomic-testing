import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { elementNotFoundTestSuite } from '../src/examples';

testRunner(elementNotFoundTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
