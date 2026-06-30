import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { stateAccessorsTestSuite } from '../src/examples';

testRunner(stateAccessorsTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
