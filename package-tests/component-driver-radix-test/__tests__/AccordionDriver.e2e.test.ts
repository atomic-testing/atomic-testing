import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { accordionExampleTestSuite } from '../src/examples';

testRunner(accordionExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
