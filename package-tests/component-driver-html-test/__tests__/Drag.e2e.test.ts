import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dragExampleTestSuite } from '../src/examples';

testRunner(dragExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
