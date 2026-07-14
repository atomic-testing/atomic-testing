import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { linkExampleTestSuite } from '../src/examples';

testRunner(linkExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
